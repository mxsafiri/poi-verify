import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          flowType: 'pkce',
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true,
        },
      }
    );

    await supabase.auth.exchangeCodeForSession(code);

    // Get the session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('No session');
    }

    const response = NextResponse.redirect(new URL('/dashboard', request.url));

    // Set auth cookies in the response
    response.cookies.set('sb-access-token', session.access_token, {
      path: '/',
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    response.cookies.set('sb-refresh-token', session.refresh_token!, {
      path: '/',
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url));
  }
}
