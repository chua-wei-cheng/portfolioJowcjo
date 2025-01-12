import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("Session:", session);
  console.log("Is Admin:", session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);

  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin2') && !isAdmin) {
    console.log("Redirecting to /login...");
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}
