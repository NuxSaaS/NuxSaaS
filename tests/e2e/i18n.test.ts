import { createPage, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('i18n', async () => {
  await setup({ host: process.env.NUXT_TEST_APP_URL })

  it('should load homepage in different languages', async () => {
    // English
    const enPage = await createPage('/')
    const startBtn = await enPage.$('a:has-text("Get Started")')
    expect(startBtn).toBeTruthy()

    // French
    const frPage = await createPage('/fr')
    const frTitle = await frPage.$('a:has-text("Commencer")')
    expect(frTitle).toBeTruthy()

    // Japanese
    const jaPage = await createPage('/ja')
    const jaTitle = await jaPage.$('a:has-text("始めましょう")')
    expect(jaTitle).toBeTruthy()

    // Chinese
    const zhPage = await createPage('/zh-CN')
    const zhTitle = await zhPage.$('a:has-text("开始使用")')
    expect(zhTitle).toBeTruthy()
  })

  it('should handle language switching', async () => {
    const page = await createPage('/')

    // Switch to French
    await page.click('button[aria-label="Change language"]')
    await page.click('span:has-text("Français")')
    await page.waitForURL('**/fr')
    expect(page.url()).toContain('/fr')
  })

  it('should maintain language preference across pages', async () => {
    // Navigate to signin page
    const page = await createPage('/fr')
    await page.click('a:has-text("Commencer")')
    await page.waitForURL('**/fr/signin')
    expect(page.url()).toContain('/fr/signin')

    // Navigate to signup page
    await page.click('a:has-text("Créez-en un")')
    await page.waitForURL('**/fr/signup')
    expect(page.url()).toContain('/fr/signup')

    // Navigate back to signin page
    await page.click('a:has-text("Connectez-vous ici")')
    await page.waitForURL('**/fr/signin')
    expect(page.url()).toContain('/fr/signin')

    // Navigate to forgot-password page
    await page.click('a:has-text("Mot de passe oublié")')
    await page.waitForURL('**/fr/forgot-password')
    expect(page.url()).toContain('/fr/forgot-password')

    // Navigate back to signin page
    await page.click('a:has-text("Retour à la connexion")')
    await page.waitForURL('**/fr/signin')
    expect(page.url()).toContain('/fr/signin')

    // Navigate back to home page
    await page.click(`span:has-text("${process.env.NUXT_APP_NAME}")`)
    await page.waitForURL('**/fr')
    const isEndsWithFr = page.url().endsWith('/fr')
    expect(isEndsWithFr).toBeTruthy()

    // Navigate to pricing page
    await page.click(`a:has-text("Tarification")`)
    await page.waitForURL('**/fr/pricing')
    expect(page.url()).toContain('/fr/pricing')
  })
})
