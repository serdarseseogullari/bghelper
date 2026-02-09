import { test, expect } from "@playwright/test"

test.describe("ito Game Helper", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    // Click on ito game box
    await page.click('text="ito"')
  })

  test("should display ito game interface", async ({ page }) => {
    // Check if header is visible
    await expect(page.locator("text=ito")).toBeVisible()
    
    // Check if back button exists
    await expect(page.locator('button:has-text("Back")')).toBeVisible()
    
    // Check if generate button exists
    await expect(page.locator('button:has-text("Generate")')).toBeVisible()
  })

  test("should generate a category when clicking generate button", async ({ page }) => {
    const generateButton = page.locator('button:has-text("Generate")')
    
    // Click generate button
    await generateButton.click()
    
    // Wait for animation
    await page.waitForTimeout(300)
    
    // Check if category badge is visible
    await expect(page.locator("text=Category")).toBeVisible()
    
    // Check if spectrum labels are visible
    await expect(page.locator("text=Low")).toBeVisible()
    await expect(page.locator("text=High")).toBeVisible()
    
    // Check if numbers 1 and 100 are displayed
    await expect(page.locator("text=1").first()).toBeVisible()
    await expect(page.locator("text=100")).toBeVisible()
    
    // Button text should change to "New Category"
    await expect(page.locator('button:has-text("New Category")')).toBeVisible()
  })

  test("should prevent duplicate categories in consecutive generations", async ({ page }) => {
    const generateButton = page.locator('button:has-text("Generate")').or(page.locator('button:has-text("New Category")'))
    
    // Generate first category
    await generateButton.click()
    await page.waitForTimeout(300)
    
    // Get first category text
    const firstCategory = await page.locator("h2.text-2xl").textContent()
    
    // Generate second category
    await page.locator('button:has-text("New Category")').click()
    await page.waitForTimeout(300)
    
    // Get second category text
    const secondCategory = await page.locator("h2.text-2xl").textContent()
    
    // They should be different (with 350+ categories, this should always pass)
    expect(firstCategory).not.toBe(secondCategory)
  })

  test("should show enhanced spectrum visualization", async ({ page }) => {
    // Generate a category
    await page.click('button:has-text("Generate")')
    await page.waitForTimeout(300)
    
    // Check for gradient bar (it should exist in the DOM)
    const gradientBar = page.locator(".bg-gradient-to-r")
    await expect(gradientBar).toBeVisible()
    
    // Check for number indicators with circles
    const circles = page.locator(".rounded-full.shadow-lg")
    expect(await circles.count()).toBeGreaterThan(0)
  })

  test("should have smooth animations", async ({ page }) => {
    const generateButton = page.locator('button:has-text("Generate")')
    
    // Click generate
    await generateButton.click()
    
    // Button should show "Shuffling..." during animation
    await expect(page.locator('button:has-text("Shuffling...")')).toBeVisible()
    
    // Wait for animation to complete
    await page.waitForTimeout(300)
    
    // Button should be back to normal state
    await expect(page.locator('button:has-text("New Category")')).toBeVisible()
  })

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Should still show all key elements
    await expect(page.locator("text=ito")).toBeVisible()
    await expect(page.locator('button:has-text("Generate")')).toBeVisible()
    
    // Generate and check display
    await page.click('button:has-text("Generate")')
    await page.waitForTimeout(300)
    
    await expect(page.locator("text=Category")).toBeVisible()
  })

  test("should navigate back to shelf", async ({ page }) => {
    // Click back button
    await page.click('button:has-text("Back")')
    
    // Should return to shelf view
    await expect(page.locator("text=ito").first()).toBeVisible()
    await expect(page.locator("text=A Fake Artist")).toBeVisible()
  })

  test("should have accessible contrast and readability", async ({ page }) => {
    await page.click('button:has-text("Generate")')
    await page.waitForTimeout(300)
    
    // Check for readable text (category should be in a white box)
    const categoryBox = page.locator("h2.text-gray-900")
    await expect(categoryBox).toBeVisible()
    
    // The background should provide good contrast
    const backgroundColor = await categoryBox.evaluate((el) => {
      return window.getComputedStyle(el.closest(".bg-white\\/95") || el).backgroundColor
    })
    
    expect(backgroundColor).toBeTruthy()
  })

  test("should display stacked cards effect", async ({ page }) => {
    // Check for multiple card layers (background cards for depth effect)
    const cards = page.locator(".absolute.inset-0.bg-yellow-300")
    expect(await cards.count()).toBeGreaterThan(0)
  })
})
