import { Page, expect } from "@playwright/test";

export class AdminDashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  expectLoaded = async () => {
    /* URL first, so the assertion retries until the redirect completes */
    await expect(this.page).toHaveURL(/\/dashboard\/?$/);
    await expect(this.page).toHaveTitle("Dashboard | Admin");
  };
}
