import { Locator, Page } from "@playwright/test";

export class DashboardMyCoursesPage {
  readonly page: Page;

  readonly url = "/dashboard/mycourses/";

  /****
   * All courses
   */
  readonly allCoursesHeading: Locator;
  readonly addCourseButton: Locator;

  constructor(page: Page) {
    this.page = page;

    /***
     * All courses page
     */
    this.allCoursesHeading = this.page.getByRole("heading", {
      name: "All Courses",
      exact: true,
      level: 1,
    });
    this.addCourseButton = this.page.getByRole("button", {
      name: "Add Course",
      exact: true,
    });
  }

  goto = async () => {
    await this.page.goto(this.url);
  };
}
