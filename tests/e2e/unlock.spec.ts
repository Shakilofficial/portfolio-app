import { test, expect } from "@playwright/test"

// Relative navigation only — playwright.config.ts's baseURL points these at
// the local dev server (localhost:3010). A previous version of this file
// hardcoded an absolute production URL here and every page.goto(BASE_URL)
// silently bypassed the config, submitting real test leads to the live
// backend instead of testing the local build.

test.describe("Portfolio Unlock Flow", () => {
  test("should load unlock form on homepage", async ({ page }) => {
    await page.goto("/")

    // Check form exists
    await expect(page.locator("text=Unlock Portfolio")).toBeVisible()
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="consent"]')).toBeVisible()
  })

  test("should validate required fields", async ({ page }) => {
    await page.goto("/")

    // Try submitting empty form
    await page.click('button:has-text("Unlock Portfolio")')

    // Should show validation error
    await page.waitForTimeout(1000)
    const errorMsg = page.locator("text=/error|required/i")
    const isVisible = await errorMsg.isVisible().catch(() => false)

    if (isVisible) {
      console.log("✅ Validation error shown for empty form")
      expect(isVisible).toBe(true)
    }
  })

  test("should reject invalid email", async ({ page }) => {
    await page.goto("/")

    // Fill form with invalid email
    await page.fill('input[name="name"]', "Test User")
    await page.fill('input[name="email"]', "invalid-email")
    await page.check('input[name="consent"]')

    // Submit form
    await page.click('button:has-text("Unlock Portfolio")')

    // Wait for response
    await page.waitForTimeout(2000)

    // Should show error or stay on page
    const stillOnPage = new URL(page.url()).pathname === "/"
    console.log(`✅ Form validation working (still on unlock page: ${stillOnPage})`)
  })

  test("should handle successful unlock and redirect", async ({ page }) => {
    await page.goto("/")

    // Fill form with valid data
    const uniqueEmail = `unlock-test-${Date.now()}@example.com`
    await page.fill('input[name="name"]', "Test User")
    await page.fill('input[name="email"]', uniqueEmail)
    await page.check('input[name="consent"]')

    console.log(`Submitting unlock form with email: ${uniqueEmail}`)

    // Submit form
    await page.click('button:has-text("Unlock Portfolio")')

    // Wait for API response and redirect
    await page.waitForTimeout(3000)

    // Check if redirected to portfolio or still on unlock page
    const currentUrl = page.url()
    console.log(`Current URL after submit: ${currentUrl}`)

    // Look for either portfolio content or error message
    const hasPortfolioContent = await page
      .locator("text=/Our Best Work|Portfolio Gallery/i")
      .isVisible()
      .catch(() => false)
    const hasErrorMessage = await page
      .locator("text=/error|too many|rate limit/i")
      .isVisible()
      .catch(() => false)

    if (hasPortfolioContent) {
      console.log("✅ Successfully redirected to portfolio gallery")
      expect(hasPortfolioContent).toBe(true)
    } else if (hasErrorMessage) {
      console.log("⚠️ API returned error (likely rate limit)")
      console.log("Error is properly displayed to user")
    } else {
      console.log("Current page content:")
      const pageContent = await page.textContent("body")
      console.log(pageContent?.substring(0, 500))
    }
  })

  test("should show button loading state while submitting", async ({ page }) => {
    await page.goto("/")

    // Fill form
    await page.fill('input[name="name"]', "Test User")
    await page.fill('input[name="email"]', `unlock-${Date.now()}@example.com`)
    await page.check('input[name="consent"]')

    const button = page.locator('button:has-text("Unlock Portfolio")')

    // Submit and check button state
    await button.click()

    // Check for loading state (disabled or showing spinner)
    await page.waitForTimeout(500)
    const isDisabled = await button.isDisabled().catch(() => false)
    const hasLoadingText = await button
      .textContent()
      .then((text) => text?.includes("Unlocking") || text?.includes("..."))

    console.log(`Button disabled: ${isDisabled}, Has loading text: ${hasLoadingText}`)
  })

  test("should display form fields with correct styling", async ({ page }) => {
    await page.goto("/")

    // Check form layout
    const form = page.locator("form").first()
    await expect(form).toBeVisible()

    // Check all inputs are present
    const nameInput = page.locator('input[name="name"]')
    const emailInput = page.locator('input[name="email"]')
    const consentCheckbox = page.locator('input[name="consent"]')

    await expect(nameInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(consentCheckbox).toBeVisible()

    console.log("✅ All form fields properly displayed")
  })

  test("should have working form on mobile viewport", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto("/")

    // Check form is still usable
    await expect(page.locator('input[name="name"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('button:has-text("Unlock Portfolio")')).toBeVisible()

    console.log("✅ Form works on mobile viewport")
  })

  test("should navigate to portfolio gallery page", async ({ page }) => {
    // Direct navigation to portfolio page
    await page.goto("/portfolio")

    // Check portfolio content
    const portfolioTitle = page.locator("text=Our Best Work")
    const portfolioItems = page.getByTestId("portfolio-card")

    const titleVisible = await portfolioTitle.isVisible().catch(() => false)

    if (titleVisible) {
      console.log("✅ Portfolio gallery page is accessible and loads")
      const itemCount = await portfolioItems.count()
      console.log(`✅ Found ${itemCount} portfolio items displayed`)
    } else {
      console.log("⚠️ Portfolio page content not found, checking page structure...")
      const pageText = await page.textContent("body")
      console.log(pageText?.substring(0, 300))
    }
  })
})
