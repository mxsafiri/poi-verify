import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set(name, value);
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          request.cookies.delete(name);
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.delete(name);
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Public routes
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') {
    if (session) {
      // If user is already logged in, redirect based on their role
      const { data: verifierData } = await supabase
        .from('verifiers')
        .select('is_verifier')
        .eq('user_id', session.user.id)
        .single();

      if (verifierData?.is_verifier) {
        return NextResponse.redirect(new URL('/verifier', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return response;
  }

  // Protected routes
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verifier-only routes
  if (request.nextUrl.pathname.startsWith('/verifier')) {
    const { data: verifierData } = await supabase
      .from('verifiers')
      .select('is_verifier')
      .eq('user_id', session.user.id)
      .single();

    if (!verifierData?.is_verifier) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Project owner routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const { data: verifierData } = await supabase
      .from('verifiers')
      .select('is_verifier')
      .eq('user_id', session.user.id)
      .single();

    if (verifierData?.is_verifier) {
      return NextResponse.redirect(new URL('/verifier', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/verifier/:path*', '/login', '/signup', '/auth/callback'],
};
