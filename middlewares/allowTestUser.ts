// middlewares/withHeaders.ts
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";
import { MiddlewareContext, MiddlewareFactory } from "./types";

const testUsers = process.env.TEST_USERS?.split(' ') ?? [];
export const inDevEnv = process.env.ENVIRONMENT
  ? process.env.ENVIRONMENT === 'development'
  : false;

const withAllowTestUser: MiddlewareFactory = (next: NextMiddleware, context:MiddlewareContext) => {
  return async (req: NextRequest, _next: NextFetchEvent) => {
    if(!context.supabaseMiddelwareClient) throw new Error("supabase client not initialized");
    const supabase = context.supabaseMiddelwareClient;
    const {
      data: { session }
    } = await supabase.auth.getSession();
    // Redirect URL
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/signin';
  
    // TODO: Remove this
    console.log('session', session);
  
    if (inDevEnv) {
      if (session) return next(req, _next);
      else return NextResponse.redirect(redirectUrl);
    } else {
      if (session && testUsers.includes(session.user.id)) return next(req, _next);
      else return NextResponse.redirect(redirectUrl);
    }
  };
};

const allowTestUserMiddleware = {
  middleware: withAllowTestUser,
  path: ['/((?!|terms-of-service|_next/static|_next/image|favicon.ico).*)']
};

export default allowTestUserMiddleware;

