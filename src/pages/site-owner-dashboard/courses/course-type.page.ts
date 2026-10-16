import { Locator, Page } from "@playwright/test";

export class DashboardCoursesTypePage {
  readonly page: Page;

  readonly url = "/dashboard/courses/course-type/";

  /***
   * Course type selector page
   */
  readonly courseTypePage: Locator;
  readonly courseTypePageHeading: Locator;
  readonly courseTypePageSingleCourse: Locator;
  readonly courseTypePageBundleCourse: Locator;
  readonly courseTypePageBackBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    /***
     * Course type selector page
     */
    this.courseTypePage = this.page.locator("._courseType_page").first();
    // this.courseTypePageBackBtn = this.courseTypePage.getByRole("link", {
    //   name: "Back",
    //   exact: true,
    // });
    this.courseTypePageBackBtn = this.page.locator("._courseType_page_back");
    this.courseTypePageHeading = this.courseTypePage.getByRole("heading", {
      name: "Select Course Type",
    });
    this.courseTypePageSingleCourse = this.courseTypePage.getByRole("heading", {
      name: "Single course",
    });
    this.courseTypePageBundleCourse = this.courseTypePage.getByRole("heading", {
      name: "Bundle course",
    });
  }

  goto = async () => await this.page.goto("/dashboard/mycourses/");

  // backFromCourseType = async () => {
  //   await this.courseTypePageBackBtn.click();
  //   await this.allCoursesHeading.waitFor({
  //     state: "visible",
  //   });
  // };
}
