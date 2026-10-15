import { Locator, Page } from "@playwright/test";

export class AdminDashboardPage {
  readonly page: Page;
  // readonly form: Locator;

  constructor(page: Page) {
    this.page = page;
  }
}
