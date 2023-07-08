import { NextMiddleware, NextRequest, NextResponse } from "next/server";
import { Middleware, MiddlewareContext } from "./types";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { isPathIncluded } from "@/utils/helpers";
import { HTTPError } from "@/utils/server/error";



export function stackMiddlewares(
  prefunctions: Middleware[] = [],
  postfunctions: Middleware[] = [],
): NextMiddleware {
  const context: MiddlewareContext = {
    supabaseMiddelwareClient: null,
    res: null,
  }

  const stackMiddlewareHelper = (functions: Middleware[], req:NextRequest,  index = 0): NextMiddleware => {
    const current = functions[index];
    if (current && req.nextUrl && isPathIncluded(req.nextUrl.pathname,current.path)) {
      const next = stackMiddlewareHelper(functions,req,index + 1);
      return current.middleware(next, context);
    }

    return () => {
      return;
    };
  };

  return async (req, event) => {

    try {

    // pre-responses middleware
    const pre = stackMiddlewareHelper(prefunctions,req);
    const preRes = await pre(req, event)
    if (preRes) return preRes;

    // response from actual endpoint
    const res = await NextResponse.next();
    context.res = res;
    context.supabaseMiddelwareClient = createMiddlewareSupabaseClient<Database>({ req, res });

    // post-responses middleware
    const post = stackMiddlewareHelper(postfunctions,req);
    const postRes = await post(req, event)
    if (postRes) return postRes;
    return res;
    } catch (error) {
      if(typeof error === "string") {
        return NextResponse.error();
      }
      if(error instanceof HTTPError) {
        return NextResponse.json(error.message, { status: error.status });
      }
      throw error;
    }
  };
}