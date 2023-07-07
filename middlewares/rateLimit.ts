// middlewares/withHeaders.ts
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { MiddlewareContext, MiddlewareFactory } from "./types";
const withRateLimit: MiddlewareFactory = (next: NextMiddleware,context:MiddlewareContext) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    // we gonna hammer the database for now, but we should use redis or something in the future
    // TODO: user redis 






    const res = await next(request, _next);
    return res;
  };
};


const rateLimitMiddleware = {
  middleware: withRateLimit,
  path: ["/chat"]
}


export default rateLimitMiddleware;