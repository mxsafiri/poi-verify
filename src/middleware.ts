import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Public routes
  if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup') {
    if (session) {
      // If user is already logged in, redirect based on their role
      const { data: verifierData } = await supabase
        .from('verifiers')
        .select('is_verifier')
        .eq('user_id', session.user.id)
        .single();

      if (verifierData?.is_verifier) {
        return NextResponse.redirect(new URL('/verifier', req.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
    return res;
  }

  // Protected routes
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Verifier-only routes
  if (req.nextUrl.pathname.startsWith('/verifier')) {
    const { data: verifierData } = await supabase
      .from('verifiers')
      .select('is_verifier')
      .eq('user_id', session.user.id)
      .single();

    if (!verifierData?.is_verifier) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Project owner routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    const { data: verifierData } = await supabase
      .from('verifiers')
      .select('is_verifier')
      .eq('user_id', session.user.id)
      .single();

    if (verifierData?.is_verifier) {
      return NextResponse.redirect(new URL('/verifier', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/verifier/:path*', '/login', '/signup'],
};
