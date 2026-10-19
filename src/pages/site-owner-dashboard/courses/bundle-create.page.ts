import { Page } from "@playwright/test";
import { DashboardCreateCoursesBase } from "@/pages/site-owner-dashboard/courses/create-course.base";
import { ICourseBasicInfo } from "@/types/courses.types";

export class DashboardCreateBundleCoursesPage extends DashboardCreateCoursesBase {
  readonly url = "/dashboard/bundle-courses/create/";

  constructor(page: Page) {
    super(page);
  }

  goto = async () => await this.page.goto("/dashboard/mycourses/");

  fill = async ({
    name,
    shortDescription,
    description,
    previewType,
    publishingStatus,
    isHideEnrollmentCount,
  }: ICourseBasicInfo) => {
    await this.name.fill(name);
    await this.shortDescription.fill(shortDescription);
    await this.description.fill(description);
    await this.setImage();
    await this.setVideo();

    if (previewType) {
      this[
        previewType === "image" ? "previewTypeImage" : "previewTypeVideo"
      ].click();
    }

    if (publishingStatus) {
      this[
        publishingStatus === "published"
          ? "publishStatusPublish"
          : "publishStatusDraft"
      ].click();
    }

    if (typeof isHideEnrollmentCount == "boolean") {
      if (isHideEnrollmentCount) await this.hideEnrollmentCount.check();
      else await this.hideEnrollmentCount.uncheck();
    }
  };
}
