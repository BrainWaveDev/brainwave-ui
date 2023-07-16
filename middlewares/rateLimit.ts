// middlewares/withHeaders.ts
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { MiddlewareContext, MiddlewareFactory } from "./types";
import { RequestBody } from "@/types/chat";
import { supabaseEdgeclient } from "@/utils/server";
import { HTTPError } from "@/utils/server/error";
import { Redis } from "@upstash/redis/nodejs";
import { DB_KEY } from "@/utils/server/constant";
import { User } from "@supabase/supabase-js";


/*
why use upstash redis?
both middleware and api are running on edge runtime, which means net module is not available, 
which means we can't use redis module. and edge functions are stateless, we cannot use in-memory cache.
nor can we maintain a connection to a redis server. So we need a connectionless redis client.

I tired use different runtime for the API but some dependecy only works on edge runtime
*/
const withRateLimit: MiddlewareFactory = (next: NextMiddleware, context: MiddlewareContext) => {
  return async (req: NextRequest, _next: NextFetchEvent) => {

    const redis = context.redis as Redis;
    if (!redis) throw new HTTPError("redis not found", 404);

    const { jwt } = (await req.json()) as RequestBody;
    if (!jwt) throw new HTTPError("jwt not found", 403);

    // Try to get the user from the Redis cache first
    // let user = await redis.get<User>(`user:${jwt}`);
    
    // let systemConfig = await redis.get<SystemConfig[]>('system_config');

    let [user,systemConfig] =  await Promise.all([
      redis.get<User>(`user:${jwt}`),
      redis.get<SystemConfig[]>('system_config'),
    ])

    const key:string = `${user!.id}:${req.nextUrl.pathname}`;
    const value = await redis.get<string>(key)


    if (!user) {
      // If the user isn't in the cache, fetch from Supabase
      const { data: { user: fetchedUser } } = await supabaseEdgeclient.auth.getUser(jwt);
      if (!fetchedUser) throw new HTTPError("user not found", 404);
      
      user = fetchedUser;

      // Cache the user in Redis for 5 minutes
      redis.set(`user:${jwt}`, JSON.stringify(user), {
        ex: 60 * 5,
      }).catch((err) => {
        console.error(err);
      });
    } 

    // Try to get the system config from the Redis cache first
    if (!systemConfig) {
      // If the system config isn't in the cache, fetch from Supabase
      let sys_config_res = await supabaseEdgeclient.from('system_config').select('*').throwOnError();
      systemConfig = sys_config_res.data!;
      if (!systemConfig) throw new HTTPError("system config not found", 404);
      // Cache the system config in Redis with no expiry
      redis.set('system_config', JSON.stringify(systemConfig))
      .catch((err) => {
        console.error(err);
      });
    } 


    const FREE_TIRE_RATE_LIMIT = systemConfig!.find((config) => config.key === DB_KEY.free_tier_message_limit)!.value;
    const FREE_TIRE_RATE_LIMIT_TIME = systemConfig!.find((config) => config.key === DB_KEY.free_tier_message_limit_period)!.value;


    if (value && parseInt(value) > parseInt(FREE_TIRE_RATE_LIMIT)) {
      throw new HTTPError("rate limit exceeded", 429);
    }

    try {
      const value = await redis.incr(key);
      console.log('key:', key, 'value:', value);
      if (value === 1) {
        await redis.expire(key, parseInt(FREE_TIRE_RATE_LIMIT_TIME))
      }
    } catch (err) {
      console.error('Failed to set key:', err);
    }

    return await next(req, _next);
  };
};

type SystemConfig = {
  key:string,
  value:string
}

const rateLimitMiddleware = {
  middleware: withRateLimit,
  path: ["/api/chat"]
}


export default rateLimitMiddleware;