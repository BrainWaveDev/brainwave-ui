// middlewares/withHeaders.ts
import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";
import { MiddlewareContext, MiddlewareFactory } from "./types";

const testUsers = process.env.TEST_USERS?.split(' ') ?? [];
export const inDevEnv = process.env.ENVIRONMENT
  ? process.env.ENVIRONMENT === 'development'
  : false;

const withAllowTestUser: MiddlewareFactory = (next: NextMiddleware, context:MiddlewareContext) => {
  return async (req: NextRequest, _next: NextFetchEvent) => {
    if(!context.supabase) throw new Error("supabase client not initialized");
    const supabase = context.supabase;
    const {
      data: { session }
    } = await supabase.auth.getSession();

    // Check auth condition
    if (inDevEnv && session && testUsers.includes(session.user.id)) {
      // Allow sign in for test users
      return next(req, _next);
    } else {
      // Not a test, sign out a user redirect to sign in page
      // await supabase.auth.signOut();
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/signin';
      return NextResponse.redirect(redirectUrl);
    }
  };
};

const allowTestUserMiddleware = {
  middleware: withAllowTestUser,
  path: ['/','/chat']
};

export default allowTestUserMiddleware;

