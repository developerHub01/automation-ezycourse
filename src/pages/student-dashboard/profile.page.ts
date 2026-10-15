import { Page } from "@playwright/test";

export class StudentDashboardProfilePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  goto = async () => await this.page.goto("/student/dashboard/profile/");
}
