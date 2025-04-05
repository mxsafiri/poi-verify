/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://omclgnycoktwuuiuultx.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tY2xnbnljb2t0d3V1aXV1bHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NjY3MTEsImV4cCI6MjA1OTM0MjcxMX0._P4z7ezWofbrpeNRlZlQ4Yb5sSdvHEON9vI0AFlcnmg'
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      dns: false,
      tls: false,
    };
    return config;
  },
}

module.exports = nextConfig
