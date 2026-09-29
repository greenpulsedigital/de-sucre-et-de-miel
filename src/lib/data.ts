import { cache } from 'react'
import type { Article, Category, Media, Product, SiteSetting, Testimonial } from '@/payload-types'
import { getClient } from './payload'
import { isAvailable } from './availability'

export const getSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 2 })
})

export const getCategories = cache(async (): Promise<Category[]> => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'categories',
    where: { published: { equals: true } },
    sort: 'order',
    limit: 50,
    depth: 1,
  })
  return res.docs
})

export const getProducts = cache(async (opts: { featured?: boolean; categoryId?: number } = {}): Promise<Product[]> => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'products',
    where: {
      published: { equals: true },
      ...(opts.featured ? { featured: { equals: true } } : {}),
      ...(opts.categoryId ? { category: { equals: opts.categoryId } } : {}),
    },
    sort: 'order',
    limit: 200,
    depth: 2,
  })
  return res.docs.filter((p) => isAvailable(p))
})

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
    depth: 2,
  })
  return res.docs[0] ?? null
})

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const cats = await getCategories()
  return cats.find((c) => c.slug === slug) ?? null
})

export const getArticles = cache(async (limit = 20): Promise<Article[]> => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'articles',
    where: { published: { equals: true } },
    sort: '-publishedAt',
    limit,
    depth: 1,
  })
  return res.docs
})

export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug }, published: { equals: true } },
    limit: 1,
    depth: 1,
  })
  return res.docs[0] ?? null
})

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const payload = await getClient()
  const res = await payload.find({
    collection: 'testimonials',
    where: { published: { equals: true } },
    limit: 12,
  })
  return res.docs
})

export const media = (m: number | Media | null | undefined): Media | null =>
  m && typeof m === 'object' ? m : null

export const category = (c: number | Category | null | undefined): Category | null =>
  c && typeof c === 'object' ? c : null
