import { expect, test } from "@playwright/test"

// Runs against whatever vizualgraphics feed NEXT_PUBLIC_API_URL points at.

test.describe("Portfolio gallery", () => {
  test("renders published items with loading images", async ({ page }) => {
    await page.goto("/portfolio")
    const grid = page.getByTestId("portfolio-grid")
    await expect(grid).toBeVisible()
    const cards = page.getByTestId("portfolio-card")
    expect(await cards.count()).toBeGreaterThan(0)

    // Every card ends up either with a loaded cover or the placeholder —
    // never a broken image (missing files fall back via onError).
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      await card.scrollIntoViewIfNeeded()
      await expect
        .poll(async () => {
          if (await card.getByTestId("card-placeholder").count()) return 1
          const img = card.locator("img").first()
          if (!(await img.count())) return 0
          return img.evaluate((el: HTMLImageElement) => (el.complete ? el.naturalWidth : 0))
        })
        .toBeGreaterThan(0)
    }
  })

  test("dialog opens, navigates, closes and syncs ?item=", async ({ page }) => {
    await page.goto("/portfolio")
    const cards = page.getByTestId("portfolio-card")
    const first = cards.first()
    const slug = await first.getAttribute("data-slug")
    await first.click()

    const dialog = page.getByTestId("portfolio-dialog")
    await expect(dialog).toBeVisible()
    await expect(page).toHaveURL(new RegExp(`\\?item=${slug}`))

    if ((await cards.count()) > 1) {
      await dialog.getByRole("button", { name: "Next project" }).click()
      const second = await cards.nth(1).getAttribute("data-slug")
      await expect(page).toHaveURL(new RegExp(`\\?item=${second}`))
      await page.keyboard.press("ArrowLeft")
      await expect(page).toHaveURL(new RegExp(`\\?item=${slug}`))
    }

    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
    await expect(page).not.toHaveURL(/item=/)
  })

  test("deep link opens the item and shows its images", async ({ page, request }) => {
    const feedUrl = `${process.env.E2E_API_URL ?? "http://localhost:3000"}/api/portfolio/items`
    const feed = await (await request.get(feedUrl)).json()
    const withImages = feed.data.find((item: { imageUrls: string[] }) => item.imageUrls.length > 1)
    test.skip(!withImages, "no published item with more than one image")

    await page.goto(`/portfolio?item=${withImages.slug}`)
    const dialog = page.getByTestId("portfolio-dialog")
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole("heading", { name: withImages.title })).toBeVisible()

    const stage = dialog.locator("img").first()
    await expect
      .poll(() => stage.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth))
      .toBeGreaterThan(0)

    // Thumbnail strip switches to the next image.
    await dialog.getByRole("tab", { name: "Media 2" }).click()
    await expect
      .poll(() => stage.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth))
      .toBeGreaterThan(0)
  })

  test("unknown ?item= falls back to the gallery", async ({ page }) => {
    await page.goto("/portfolio?item=does-not-exist")
    await expect(page.getByTestId("portfolio-grid")).toBeVisible()
    await expect(page.getByTestId("portfolio-dialog")).toBeHidden()
    await expect(page).not.toHaveURL(/item=/)
  })

  test("legacy /portfolio/<slug> redirects to the dialog deep link", async ({ page }) => {
    await page.goto("/portfolio")
    const slug = await page.getByTestId("portfolio-card").first().getAttribute("data-slug")
    await page.goto(`/portfolio/${slug}`)
    await expect(page).toHaveURL(new RegExp(`/portfolio\\?item=${slug}`))
    await expect(page.getByTestId("portfolio-dialog")).toBeVisible()
  })
})
