import Image from 'next/image'
import type { Media } from '@/payload-types'

type Props = {
  media: Media | null | undefined
  size?: 'card' | 'wide' | 'original'
  sizes: string
  priority?: boolean
  className?: string
  fit?: 'cover' | 'contain'
  quality?: number
  fallbackLabel?: string
}

/** Photo optimisée (AVIF/WebP via next/image). Sans image : aplat texturé, jamais de photo stock. */
export function Photo({ media, size = 'card', sizes, priority, className = '', fit = 'cover', quality, fallbackLabel }: Props) {
  if (!media?.url) {
    return (
      <div
        role="img"
        aria-label={fallbackLabel || 'Photographie à venir'}
        className={`h-full w-full bg-[radial-gradient(circle_at_30%_20%,#e7d3a8,#c9a878_55%,#8a6a4a)] ${className}`}
      />
    )
  }
  const variant = size === 'original' ? null : media.sizes?.[size]
  const src = variant?.url || media.url
  const width = variant?.width || media.width || 1600
  const height = variant?.height || media.height || 1067
  return (
    <Image
      src={src}
      alt={media.alt}
      width={width}
      height={height}
      sizes={sizes}
      quality={quality}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={`h-full w-full ${fit === 'contain' ? 'object-contain p-4' : 'object-cover'} ${className}`}
    />
  )
}
