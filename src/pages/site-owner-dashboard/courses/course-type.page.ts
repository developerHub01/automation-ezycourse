import { Locator, Page } from "@playwright/test";

export class DashboardCoursesTypePage {
  readonly page: Page;

  readonly url = "/dashboard/courses/course-type/";

  /***
   * Course type selector page
   */
  readonly mainHeading: Locator;
  readonly typeSingleCourse: Locator;
  readonly typeBundleCourse: Locator;
  readonly backBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    /***
     * Course type selector page
     */
    this.backBtn = this.page.locator("._courseType_page_back");
    this.mainHeading = this.page.getByRole("heading", {
      name: "Select Course Type",
    });
    this.typeSingleCourse = this.page.getByRole("heading", {
      name: "Single course",
    });
    this.typeBundleCourse = this.page.getByRole("heading", {
      name: "Bundle course",
    });
  }

  goto = async () => await this.page.goto(this.url);
}
