import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    if (code) {
      const cookieStore = cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name) {
              return cookieStore.get(name)?.value;
            },
            set(name, value, options) {
              try {
                cookieStore.set(name, value, options);
              } catch (error) {
                // Handle cookie error silently
              }
            },
            remove(name, options) {
              try {
                cookieStore.delete(name, options);
              } catch (error) {
                // Handle cookie error silently
              }
            },
          },
        }
      );

      await supabase.auth.exchangeCodeForSession(code);
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url));
  }
}
