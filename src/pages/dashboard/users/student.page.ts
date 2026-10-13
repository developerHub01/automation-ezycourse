import { Locator, Page } from "@playwright/test";

export class AdminDashboardUsersStudentPage {
  readonly page: Page;
  readonly addStudentBtn: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addStudentBtn = page.getByRole("button", {
      name: "Add Student",
    });
    this.heading = page.getByRole("heading", {
      name: "Students",
    });
  }

  async goto(): Promise<void> {
    await this.page.goto("/dashboard/students");
  }
  async openAddStudentModal(): Promise<void> {
    await this.addStudentBtn.click();
  }
}
