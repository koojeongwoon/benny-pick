// @vitest-environment node
import { describe, test, expect, vi } from "vitest";
import { setup, createPage } from "@nuxt/test-utils/e2e";

describe("User Story 1 & 2: Benefit Lookup Flow", async () => {
  vi.setConfig({ testTimeout: 30000 });
  await setup({
    server: false, // Use existing server
    browser: true,
    rootDir: ".",
  });

  test("Complete Flow: Landing -> Chat -> Result", async () => {
    const page = await createPage();
    const baseURL = "http://localhost:3000";

    // 1. Landing Page
    await page.goto(baseURL + "/", { waitUntil: "networkidle" });
    expect(await page.textContent("h1")).toContain("놓치고 있는 정부 지원금");

    // Click CTA
    await page.click('button:has-text("내 숨은 돈 조회하기")');

    // 2. Chat Page
    await page.waitForURL("**/chat");
    expect(await page.url()).toContain("/chat");

    // Wait for initial message
    await page.waitForSelector(".bg-white.text-gray-800"); // Assistant bubble

    // Type query
    await page.fill('input[type="text"]', "28살 서울 월세");
    await page.keyboard.press("Enter");

    // Wait for user message to appear (confirm send)
    await page.waitForSelector(".bg-primary.text-white", { state: "visible" });

    // Wait for response
    // The response should contain "청년월세 특별지원"
    // Wait for response bubble (AI message + Action message)
    await page.waitForFunction(
      () => {
        // Note: If you encounter "Property 'toBeVisible' does not exist", use await locator.waitFor({ state: 'visible' }) instead.
        return document.querySelectorAll(".bg-white.text-gray-800").length >= 3;
      },
      null,
      { timeout: 20000 }
    );

    const assistantMsgs = page.locator(".bg-white.text-gray-800");

    // Check the AI response (2nd message, index 1)
    const aiMsg = await assistantMsgs.nth(1).textContent();
    console.log("AI Response:", aiMsg);
    expect(aiMsg).toContain("청년");

    // Verify "View Report" button
    const viewReportBtn = page.locator('button:has-text("결과 리포트 보기")');
    await viewReportBtn.waitFor({ state: "visible" });

    // 3. Result Page
    await viewReportBtn.click();
    await page.waitForURL("**/result");

    // Verify Result Content
    expect(await page.textContent("h1")).toContain("Benny Pick");
    expect(await page.textContent("h3")).toContain("맞춤 혜택 리스트");

    // Verify Card
    expect(await page.textContent("body")).toContain("청년월세 특별지원");

    // Verify Amount (should be formatted)
    const amount = await page.textContent(".text-3xl.font-bold.text-gray-900");
    expect(amount).toMatch(/[0-9,]+원/);
  });
});
