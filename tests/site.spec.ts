import { test, expect } from '@playwright/test'

test('accueil : positionnement B2B, CTA revendeur visible, pas de slider ni vidéo', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('tartes alpines')
    await expect(page.getByRole('link', { name: 'Devenir revendeur' }).first()).toBeVisible()
  await expect(page.locator('video, [class*=carousel], [class*=slider]')).toHaveCount(0)
})

test('une tarte est accessible en 2 clics et mène à la demande revendeur préremplie', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Voir tous les produits/ }).click()
  await page.getByRole('link', { name: /Tarte myrtille/ }).first().click()
  await expect(page.getByRole('heading', { level: 1, name: /Tarte myrtille/ })).toBeVisible()
  await page.getByRole('link', { name: 'Demander les tarifs pro' }).click()
  await expect(page).toHaveURL(/\/professionnels\?tarte=tarte-myrtille/)
  await expect(page.getByLabel(/^Tartes qui vous intéressent/)).toHaveValue('Tarte myrtille')
})

test('anciennes URLs B2C redirigées vers la page revendeur', async ({ page }) => {
  await page.goto('/commander')
  await expect(page).toHaveURL(/\/professionnels$/)
  await page.goto('/evenements')
  await expect(page).toHaveURL(/\/professionnels$/)
})

test('lien d’évitement et focus visible au clavier', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Aller au contenu' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()
})

test('formulaire de contact : erreurs serveur accessibles puis confirmation', async ({ page }) => {
  await page.goto('/contact')
  // Contourne la validation navigateur pour exercer la validation serveur
  await page.locator('form').evaluate((f) => f.setAttribute('novalidate', ''))
  await page.getByRole('button', { name: 'Envoyer' }).click()
  await expect(page.locator('[role=alert]:not(#__next-route-announcer__)')).toContainText('attention')
  await expect(page.locator('[aria-invalid="true"]').first()).toBeVisible()

  await page.getByLabel(/^Numéro de SIRET/).fill('73282932000074')
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
  expect(sm).toContain('/creations/tartes-alpines')
  await page.goto('/creations/tarte-myrtille')
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', /\/creations\/tarte-myrtille$/)
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents()
  expect(ld.join('')).toContain('"@type":"Product"')
  expect(ld.join('')).toContain('BreadcrumbList')
})

test('404 personnalisée', async ({ page }) => {
  const res = await page.goto('/nimporte-quoi')
  expect(res?.status()).toBe(404)
  await expect(page.getByRole('link', { name: 'Retourner aux tartes' })).toBeVisible()
})

test('menu mobile : se referme après un clic sur un lien', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'menu visible uniquement sur mobile')
  await page.goto('/')
  await page.getByText('Menu', { exact: true }).click()
  await expect(page.locator('details')).toHaveJSProperty('open', true)
  await page.getByRole('link', { name: 'La maison' }).last().click()
  await expect(page).toHaveURL(/\/maison$/)
  await expect(page.locator('details')).toHaveJSProperty('open', false)
})

test('page maison : carrousel de photos de l’atelier navigable', async ({ page }) => {
  await page.goto('/maison')
  const carousel = page.locator('[aria-roledescription=carrousel]')
  await expect(carousel.getByRole('group')).toHaveCount(4)
  await carousel.getByRole('button', { name: 'Photo suivante' }).click()
  await expect(carousel.locator('[aria-current=true]')).toHaveAttribute('aria-label', 'Aller à la photo 2')
})

test('devenir revendeur : SIRET obligatoire et contrôlé', async ({ page }) => {
  await page.goto('/professionnels')
  await page.locator('form').evaluate((f) => f.setAttribute('novalidate', ''))
  await page.getByLabel(/^Numéro de SIRET/).fill('12345678901234')
  await page.getByRole('button', { name: 'Envoyer ma demande' }).click()
  await expect(page.getByRole('alert').filter({ hasText: 'attention' })).toContainText('SIRET')
  await expect(page.getByLabel(/^Numéro de SIRET/)).toHaveAttribute('aria-invalid', 'true')
})
