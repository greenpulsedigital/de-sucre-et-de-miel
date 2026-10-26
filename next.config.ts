import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

// CSP appliquée au site public uniquement (l'admin Payload exige des scripts inline dynamiques).
const csp = [
  "default-src 'self'",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

const baseHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: { globalNotFound: true },
  // Vercel : la base et les photos générées au build doivent être embarquées dans les fonctions.
  ...(process.env.VERCEL ? { outputFileTracingIncludes: { '/**': ['./payload.db', './media/**/*'] } } : {}),
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90],
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/images/**' }],
  },
  async redirects() {
    return [
      { source: '/commander', destination: '/professionnels', permanent: true },
      { source: '/evenements', destination: '/professionnels', permanent: true },
      { source: '/actualites/:path*', destination: '/', permanent: true },
    ]
  },
  async headers() {
    return [
      { source: '/:path*', headers: [...baseHeaders, ...(process.env.SITE_NOINDEX ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] : [])] },
      ...(isProd
        ? [
            {
              source: '/((?!admin|api).*)',
              headers: [
                { key: 'Content-Security-Policy', value: csp },
                { key: 'X-Frame-Options', value: 'DENY' },
              ],
            },
          ]
        : []),
    ]
  },
}

export default withPayload(nextConfig)
