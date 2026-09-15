import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/** FE-0 done criteria (plan-frontend.md) and FR-FE-02/03/05/96. */

test("English home is served at / without a redirect", async ({ request }) => {
  const response = await request.get("/", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  const html = await response.text();
  expect(html).toContain('<html lang="en" dir="ltr"');
  expect(html).toMatch(/<h1[^>]*>Kareem Sabry<\/h1>/);
});

test("/en URLs 308-redirect to the unprefixed form", async ({ request }) => {
  for (const [from, to] of [
    ["/en", "/"],
    ["/en/projects", "/projects"],
  ]) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(308);
    expect(new URL(response.headers()["location"], "http://x").pathname).toBe(
      to,
    );
  }
});

test("Arabic renders right-to-left under /ar", async ({ page }) => {
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("كريم صبري");
});

test("unknown URLs return a real 404 page", async ({ request }) => {
  for (const path of ["/does-not-exist", "/ar/does-not-exist"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
    expect(await response.text(), path).toContain("Page not found");
  }
});

test.describe("Arabic-preferring browser", () => {
  test.use({ locale: "ar-EG" });

  test("sees a banner instead of a redirect", async ({ page }) => {
    await page.goto("/");
    expect(new URL(page.url()).pathname).toBe("/");
    const banner = page.locator("aside[lang=ar]");
    await expect(banner).toBeVisible();
    await expect(banner.getByRole("link")).toHaveAttribute("href", "/ar");

    await banner.getByRole("button").click();
    await expect(banner).toBeHidden();
    await page.reload();
    await expect(page.locator("aside[lang=ar]")).toBeHidden();
  });
});

test("language switch keeps the path and remembers the choice", async ({
  page,
  context,
}) => {
  await page.goto("/?ref=test");
  await page.locator("header a[hreflang=ar]").click();
  await expect(page).toHaveURL(/\/ar\?ref=test$/);
  const cookies = await context.cookies();
  expect(cookies.find((c) => c.name === "NEXT_LOCALE")?.value).toBe("ar");

  await page.locator("header a[hreflang=en]").click();
  await expect(page).toHaveURL(/\/\?ref=test$/);
});

test("skip link moves focus to the main content", async ({ page }, info) => {
  test.skip(info.project.name === "mobile", "keyboard flow is desktop-only");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#content")).toBeFocused();
});

for (const path of ["/", "/ar"]) {
  test(`no serious axe violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(serious).toEqual([]);
  });
}
