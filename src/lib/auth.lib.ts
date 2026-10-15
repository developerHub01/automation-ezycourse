import { LoginPage } from "@/pages/auth/login.page";
import { AuthRole } from "@/types/index.types";
import { expect, Page } from "@playwright/test";

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
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login({
    email,
    password,
  });

  await expect(page.locator("div._menu_user_pic").first()).toBeVisible();

  await page.context().storageState({
    path: `playwright/.auth/${role}.json`,
  });
};
