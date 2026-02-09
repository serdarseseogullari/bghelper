import { test, expect } from "@playwright/test"

test.describe("Fake Artist Generator - Back Button", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    // Navigate to Fake Artist game first
    await page.click('text="A Fake Artist"')
    await expect(page.locator('h1:has-text("A FAKE ARTIST")')).toBeVisible()
  })

  test("back button should be clickable and return to shelf", async ({ page }) => {
    // Check if back button is visible
    const backButton = page.locator('button:has-text("Back")')
    await expect(backButton).toBeVisible()
    
    // Click the back button
    await backButton.click()
    
    // Should return to game shelf
    await expect(page.locator('text=ito').first()).toBeVisible()
    await expect(page.locator('text=A Fake Artist')).toBeVisible()
  })

  test("back button should work on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check if back button is visible (it shows just icon on mobile)
    const backButton = page.locator('button').first()
    await expect(backButton).toBeVisible()
    
    // Click the back button
    await backButton.click()
    
    // Should return to game shelf
    await expect(page.locator('text=ito').first()).toBeVisible()
  })

  test("title should have correct font size on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    const title = page.locator('h1')
    await expect(title).toBeVisible()
    
    // Check computed font size
    const fontSize = await title.evaluate(el => {
      return window.getComputedStyle(el).fontSize
    })
    
    expect(fontSize).toBe("48px")
  })

  test("title should have correct font size on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    
    const title = page.locator('h1')
    await expect(title).toBeVisible()
    
    // Check computed font size
    const fontSize = await title.evaluate(el => {
      return window.getComputedStyle(el).fontSize
    })
    
    expect(fontSize).toBe("64px")
  })
})
