import { Page } from "@playwright/test";
import { DashboardCreateCoursesBase } from "@/pages/site-owner-dashboard/courses/create-course.base";

export class DashboardCreateBundleCoursesPage extends DashboardCreateCoursesBase {
  readonly url = "/dashboard/bundle-courses/create/";

  constructor(page: Page) {
    super(page);
  }

  goto = async () => await this.page.goto("/dashboard/mycourses/");
}
