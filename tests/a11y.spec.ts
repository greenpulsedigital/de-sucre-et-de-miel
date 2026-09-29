import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const PAGES = ['/', '/creations', '/creations/tartes', '/creations/tarte-aux-fruits-de-saison', '/maison', '/evenements', '/professionnels', '/actualites', '/commander', '/contact', '/mentions-legales', '/confidentialite', '/page-inexistante']

for (const path of PAGES) {
  test(`axe WCAG 2.1 AA — ${path}`, async ({ page }) => {
    await page.goto(path)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`)).toEqual([])
  })
}
