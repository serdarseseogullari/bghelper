import { test, expect } from "@playwright/test"

test.describe("Game Shelf", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should display the game shelf", async ({ page }) => {
    // Check if games are visible
    await expect(page.locator("text=ito").first()).toBeVisible()
    await expect(page.locator("text=A Fake Artist")).toBeVisible()
    await expect(page.locator("text=Wavelength")).toBeVisible()
  })

  test("should show coming soon for unavailable games", async ({ page }) => {
    await expect(page.locator("text=Coming Soon")).toBeVisible()
  })

  test("should navigate to ito game", async ({ page }) => {
    await page.click('text="ito"')
    await expect(page.locator("text=Generate Category")).toBeVisible()
  })

  test("should navigate to Fake Artist game", async ({ page }) => {
    await page.click('text="A Fake Artist"')
    await expect(page.locator("text=Generate")).toBeVisible()
  })

  test("should have 3D shelf effects", async ({ page }) => {
    // Check for perspective styles
    const shelf = page.locator(".relative.bg-gradient-to-b")
    await expect(shelf).toBeVisible()
  })

  test("should show hover effects on game boxes", async ({ page }) => {
    const itoBox = page.locator('text="ito"')
    
    // Hover over the game box
    await itoBox.hover()
    
    // The box should still be visible (hover doesn't break layout)
    await expect(itoBox).toBeVisible()
  })

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Games should still be visible
    await expect(page.locator("text=ito").first()).toBeVisible()
    await expect(page.locator("text=A Fake Artist")).toBeVisible()
  })

  test("should display random wall color", async ({ page }) => {
    // Reload page and check if shelf container has a background color
    await page.reload()
    
    const container = page.locator(".min-h-screen").first()
    const classList = await container.getAttribute("class")
    
    // Should have one of the wall color classes
    expect(classList).toMatch(/bg-(stone|neutral|amber|rose|orange)/)
  })
})
