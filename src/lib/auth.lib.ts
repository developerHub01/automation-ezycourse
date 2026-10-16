import { LoginPage } from "@/pages/auth/login.page";
import { AuthRole } from "@/types/index.types";
import { expect, Page } from "@playwright/test";
import { access, mkdir } from "node:fs/promises";
import path from "node:path";

const authDir = path.resolve(`playwright/.auth`);

export const authenticate = async ({
  page,
  role,
  credentials: { email, password },
}: {
  page: Page;
  role: AuthRole;
  credentials: {
    email: string;
    password: string;
  };
}) => {
  await mkdir(authDir, {
    recursive: true,
  });

  const authFile = path.resolve(authDir, `${role}.json`);

  try {
    await access(authFile);

    const browser = page.context().browser();
    if (!browser) throw new Error("Browser is unavailable");

    const context = await browser.newContext({
      storageState: authFile,
    });

    try {
      const validationPage = await context.newPage();
      await validationPage.goto("/dashboard");

      await expect(
        validationPage.locator("div._menu_user_pic").first(),
      ).toBeVisible({
        timeout: 5_000,
      });

      return;
    } finally {
      await context.close();
    }
  } catch (error) {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login({
      email,
      password,
    });

    await expect(page.locator("div._menu_user_pic").first()).toBeVisible();

    await page.context().storageState({
      path: authFile,
    });
  }
};
