// middlewares/withHeaders.ts
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";
import { Middleware, MiddlewareContext, MiddlewareFactory } from "./types";
const testMiddlewarefactory: MiddlewareFactory = (next: NextMiddleware,context:MiddlewareContext) => {
  console.log("test factory called");
  return async (request: NextRequest, _next: NextFetchEvent) => {
    console.log("test middleware called");
    const res = await next(request, _next);
    return res;
  };
};


const testMiddleware = {
  middleware: testMiddlewarefactory,
  path: ["/chat"]
}

export const generateTestMiddleware = (i:number):Middleware => {
    return {
        middleware:(next,context) => {
            console.log(`test factory called ${i}`);
            return async (request, _next) => {
              console.log(`test middleware called ${i}`);
              const res = await next(request, _next);
              return res;
            };
          },
    path: ["/chat"]
    }
}


export default testMiddleware;