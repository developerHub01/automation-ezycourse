import { Locator, Page } from "@playwright/test";
import { DashboardCreateCoursesBase } from "@/pages/site-owner-dashboard/courses/create-course.base";

export class DashboardCreateCoursesPage extends DashboardCreateCoursesBase {
  readonly url = "/dashboard/courses/create/";

  constructor(page: Page) {
    super(page);
  }
}
