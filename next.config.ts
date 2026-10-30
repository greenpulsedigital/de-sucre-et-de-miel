import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'
// Même règle que NOINDEX (src/lib/site.ts) : les prévisualisations Vercel ne sont jamais indexées.
const noindex = Boolean(process.env.SITE_NOINDEX) || process.env.VERCEL_ENV === 'preview'
const plausible = Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN)

// CSP appliquée au site public uniquement (l'admin Payload exige des scripts inline dynamiques).
const csp = [
  "default-src 'self'",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${plausible ? ' https://plausible.io' : ''}`,
  "font-src 'self'",
  `connect-src 'self'${plausible ? ' https://plausible.io' : ''}`,
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
      // Domaine canonique sans www (complète la redirection configurée côté hébergeur).
      { source: '/:path*', has: [{ type: 'host', value: 'www.desucreetdemiel.fr' }], destination: 'https://desucreetdemiel.fr/:path*', permanent: true },
    ]
  },
  async headers() {
    return [
      { source: '/:path*', headers: [...baseHeaders, ...(noindex ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] : [])] },
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
