import { Page } from "@playwright/test";
import { DashboardCreateCoursesBase } from "@/pages/site-owner-dashboard/courses/create-course.base";
import { IBundleCourseBasicInfo } from "@/types/courses.types";

export class DashboardCreateBundleCoursesPage extends DashboardCreateCoursesBase {
  readonly url = "/dashboard/bundle-courses/create/";

  constructor(page: Page) {
    super(page);
  }

  goto = async () => await this.page.goto(this.url);

  fill = async ({
    name,
    shortDescription,
    description,
    category,
    previewType,
    publishingStatus,
    isHideEnrollmentCount,
  }: IBundleCourseBasicInfo) => {
    const sanitizedCategory = this.sanitizeCategory(category);
    await this.name.fill(name);
    await this.shortDescription.fill(shortDescription);
    await this.description.fill(description);

    if (category) await this.selectCategory(sanitizedCategory);

    await this.setImage();
    await this.setVideo();

    if (previewType) await this.previewLocators[previewType].check();

    if (publishingStatus)
      await this.publishingStatusLocators[publishingStatus].check();

    if (typeof isHideEnrollmentCount === "boolean") {
      if (isHideEnrollmentCount) await this.hideEnrollmentCount.check();
      else await this.hideEnrollmentCount.uncheck();
    }
  };
}
