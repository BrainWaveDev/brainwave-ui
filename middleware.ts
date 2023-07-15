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
  // Redirect URL
  const redirectUrl = req.nextUrl.clone();
  redirectUrl.pathname = '/signin';

  // TODO: Remove this
  console.log('session', session);

  if (inDevEnv) {
    if (session) return res;
    else return NextResponse.redirect(redirectUrl);
  } else {
    if (session && testUsers.includes(session.user.id)) return res;
    else return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ['/((?!|terms-of-service|_next/static|_next/image|favicon.ico).*)']
};
