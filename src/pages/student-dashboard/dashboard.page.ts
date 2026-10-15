import { Locator, Page } from "@playwright/test";

export class StudentDashboardPage {
  readonly page: Page;
  readonly studentMainContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.studentMainContainer = this.page
      .locator("._student_main_content")
      .first();
  }

  goto = async () => await this.page.goto("/student/dashboard/");
}
