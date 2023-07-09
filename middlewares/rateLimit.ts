// middlewares/withHeaders.ts
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { MiddlewareContext, MiddlewareFactory } from "./types";
import { RequestBody } from "@/types/chat";
import { supabaseServerclient } from "@/utils/server";
import { HTTPError } from "@/utils/server/error";
import { Redis } from "@upstash/redis/nodejs";



const withRateLimit: MiddlewareFactory = (next: NextMiddleware, context: MiddlewareContext) => {

  return async (req: NextRequest, _next: NextFetchEvent) => {

    const { jwt } = (await req.json()) as RequestBody;
    if (!jwt) throw new HTTPError("jwt not found", 403);
    const { data: { user } } = await supabaseServerclient.auth.getUser(jwt);
    if (!user) throw new HTTPError("user not found", 404);

    const redis = context.redis as Redis;

    const FREE_TIRE_RATE_LIMIT = 20;
    const FREE_TIRE_RATE_LIMIT_TIME = 60 * 60; // 1 hour
    if (!redis) throw new HTTPError("redis not found", 404);

    const key = `${user.id}:${req.nextUrl.pathname}`;
    const value = await redis.get<string>(key)
    if (value && parseInt(value) > FREE_TIRE_RATE_LIMIT) {
      throw new HTTPError("rate limit exceeded", 429);
    }

    try {
      const value = await redis.incr(key);
      console.log('key:', key, 'value:', value);
      if (value === 1) {
        await redis.expire(key, FREE_TIRE_RATE_LIMIT_TIME)
      }
    } catch (err) {
      console.error('Failed to set key:', err);
    }

    return await next(req, _next);
  };
};


const rateLimitMiddleware = {
  middleware: withRateLimit,
  path: ["/api/chat"]
}


export default rateLimitMiddleware;