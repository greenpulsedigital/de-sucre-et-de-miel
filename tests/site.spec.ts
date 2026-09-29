import { test, expect } from '@playwright/test'

test('accueil : positionnement, CTA Commander visible, pas de slider ni vidéo', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('De Sucre & de Miel')
  await expect(page.getByText('Pâtisserie artisanale dans la Drôme').first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'Commander' }).first()).toBeVisible()
  await expect(page.locator('video, [class*=carousel], [class*=slider]')).toHaveCount(0)
})

test('un produit est accessible en 2 clics depuis l’accueil', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Voir toutes les créations/ }).click()
  await page.getByRole('link', { name: /Tarte aux fruits de saison/ }).first().click()
  await expect(page.getByRole('heading', { level: 1, name: /Tarte aux fruits/ })).toBeVisible()
  await page.getByRole('link', { name: 'Demander ce produit' }).click()
  await expect(page).toHaveURL(/\/commander\?creation=tarte-aux-fruits-de-saison/)
  await expect(page.getByLabel(/^Création/)).toHaveValue('tarte-aux-fruits-de-saison')
})

test('lien d’évitement et focus visible au clavier', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Aller au contenu' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()
})

test('formulaire de commande : erreurs serveur accessibles puis confirmation', async ({ page }) => {
  await page.goto('/contact')
  // Contourne la validation navigateur pour exercer la validation serveur
  await page.locator('form').evaluate((f) => f.setAttribute('novalidate', ''))
  await page.getByRole('button', { name: 'Envoyer' }).click()
  await expect(page.locator('[role=alert]:not(#__next-route-announcer__)')).toContainText('attention')
  await expect(page.locator('[aria-invalid="true"]').first()).toBeVisible()

  await page.getByLabel(/^Prénom/).fill('Camille')
  await page.getByLabel(/^Nom/).fill('Test')
  await page.getByLabel(/^Email/).fill('camille@example.org')
  await page.getByLabel(/^Message/).fill('Bonjour, ceci est un test automatisé.')
  await page.getByRole('button', { name: 'Envoyer' }).click()
  await expect(page.getByRole('status')).toContainText('Message envoyé')
})

test('robots, sitemap et métadonnées', async ({ page, request }) => {
  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain('Sitemap:')
  const sm = await (await request.get('/sitemap.xml')).text()
  expect(sm).toContain('/creations/tartes')
  await page.goto('/creations/tarte-aux-fruits-de-saison')
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', /\/creations\/tarte-aux-fruits-de-saison$/)
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents()
  expect(ld.join('')).toContain('"@type":"Product"')
  expect(ld.join('')).toContain('BreadcrumbList')
})

test('404 personnalisée', async ({ page }) => {
  const res = await page.goto('/nimporte-quoi')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('link', { name: 'Retourner aux créations' })).toBeVisible()
})
