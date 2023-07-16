import { SystemConfig } from './types';
// middlewares/withHeaders.ts
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { MiddlewareFactory } from "./types";
import { RequestBody } from "@/types/chat";
import { supabaseEdgeclient } from "@/utils/server";
import { HTTPError } from "@/utils/server/error";
import { DB_KEY } from "@/utils/server/constant";
import { User } from "@supabase/supabase-js";
import { MiddlewareContext, guard } from './utils';


/*
why use upstash redis?
both middleware and api are running on edge runtime, which means net module is not available, 
which means we can't use redis module. and edge functions are stateless, we cannot use in-memory cache.
nor can we maintain a connection to a redis server. So we need a connectionless redis client.

I tired use different runtime for the API but some dependecy only works on edge runtime
*/
const withRateLimit: MiddlewareFactory = (next: NextMiddleware, context: MiddlewareContext) => {
  return async (req: NextRequest, _next: NextFetchEvent) => {

    const redis = context.getRedis();

    const { jwt } = (await req.json()) as RequestBody;
    guard(jwt).throw(new HTTPError("jwt not found", 400));

    let [user, systemConfig] = await Promise.all([
      redis.get<FullUser>(`user:${jwt}`),
      redis.get<SystemConfig[]>('system_config'),
    ])

    if (!user) {
      // If the user isn't in the cache, fetch from Supabase
      const { data: { user: fetchedUser } } = await supabaseEdgeclient.auth.getUser(jwt);
      if (!fetchedUser) throw new HTTPError("user not found", 404);

      const profile = await supabaseEdgeclient.from('profile').select('*').eq('user_id', fetchedUser!.id).single();
      guard(profile.data).throw(new HTTPError("profile not found", 404));


      user = {
        ...fetchedUser!,
        ...profile.data!,
      };

      // Cache the user in Redis for 5 minutes
      redis.set(`user:${jwt}`, JSON.stringify(user), {
        ex: 60 * 5,
      }).catch((err) => {
        throw new HTTPError("unknown error happend", 500);
      });
    }

    guard(user).throw(new HTTPError("user not found", 404));
    guard(user.tier).throw(new HTTPError("user tier not found", 404));

    // Try to get the system config from the Redis cache first
    if (!systemConfig) {
      // If the system config isn't in the cache, fetch from Supabase
      let sys_config_res = await supabaseEdgeclient.from('system_config').select('*').throwOnError();
      systemConfig = sys_config_res.data!;
      if (!systemConfig) throw new HTTPError("system config not found", 404);
      // Cache the system config in Redis with no expiry
      redis.set('system_config', JSON.stringify(systemConfig))
        .catch((err) => {
          throw new HTTPError("unknown error with redis happend", 500);
        });
    }

    guard(systemConfig).throw(new HTTPError("system config not found", 404));


    const key: string = `${user.id}:${req.nextUrl.pathname}`;
    const value = await redis.get<string>(key)

    if (validate_if_rate_limit(systemConfig, value, user)) {
      throw new HTTPError("rate limit exceeded", 429);
    }


    try {
      const value = await redis.incr(key);
      const FREE_TIRE_RATE_LIMIT_TIME = systemConfig.find((config) => config.key === DB_KEY.free_tier_message_limit_period)!.value;
      guard(FREE_TIRE_RATE_LIMIT_TIME).throw(new HTTPError("free tier rate limit time not found", 404));

      if (value === 1) {
        redis.expire(key, parseInt(FREE_TIRE_RATE_LIMIT_TIME))
      }
    } catch (err) {
      throw new HTTPError("unknown error with redis happend", 500);
    }

    return await next(req, _next);
  };
};


const validate_if_rate_limit = (systemConfig: SystemConfig[], value: string | null, user: FullUser) => {
  if (!value) { return false; }
  
  const validate_free_user = () => {
    const FREE_TIRE_RATE_LIMIT = systemConfig.find((config) => config.key === DB_KEY.free_tier_message_limit)!.value;
    return parseInt(value) > parseInt(FREE_TIRE_RATE_LIMIT);
  }
  const validate_tire_1_user = () => {
    const TIRE_1_RATE_LIMIT = systemConfig.find((config) => config.key === DB_KEY.tier_1_message_limit)!.value;
    return parseInt(value) > parseInt(TIRE_1_RATE_LIMIT);
  }

  try {
    if (user.tier === 0){
      return validate_free_user();
    }else if (user.tier === 1){
      return validate_tire_1_user();
    }
  } catch (err) {
    throw new HTTPError("unknown error when validating user use limit", 500);
  }

  return false;
}


type FullUser = User & ({
  tier: number | null;
  user_id: string;
  user_name: string | null;
} | undefined);

const rateLimitMiddleware = {
  middleware: withRateLimit,
  path: ["/api/chat"]
}


export default rateLimitMiddleware;