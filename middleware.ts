import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In dev environment, only test users will be allowed to sign in
const testUsers = process.env.TEST_USERS?.split(' ') ?? [];
export const inDevEnv = process.env.ENVIRONMENT
  ? process.env.ENVIRONMENT === 'development'
  : false;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  console.log('TEST_USERS', testUsers);
  console.log('Current User Id: ', session?.user.id);

  // Check auth condition
  if (!inDevEnv && session && testUsers.includes(session.user.id)) {
    // Allow sign in for test users
    return res;
  } else {
    // Not a test, sign out a user redirect to sign in page
    // await supabase.auth.signOut();
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/signin';
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ['/', '/chat']
};
