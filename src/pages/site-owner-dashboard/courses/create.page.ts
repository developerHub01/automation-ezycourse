import { Locator, Page } from "@playwright/test";
import { DashboardCreateCoursesBase } from "@/pages/site-owner-dashboard/courses/create-course.base";
import {
  ISingleCourseBasicInfo,
  TCourseAccessability,
} from "@/types/courses.types";

export class DashboardCreateCoursesPage extends DashboardCreateCoursesBase {
  readonly url = "/dashboard/courses/create/";

  readonly accessibilityStatus: Locator;
  readonly accessLocators: Record<TCourseAccessability, Locator>;
  readonly motivationalPopup: Locator;
  readonly limitCourseEnrollmentWrapper: Locator;
  readonly limitCourseEnrollment: Locator;
  readonly limitCourseMaxEnrollment: Locator;

  constructor(page: Page) {
    super(page);

    this.accessibilityStatus = this.form
      .locator("._crtSnglCrse_frm1_itm")
      .filter({
        has: this.page.getByText("Accessibility status", {
          exact: true,
        }),
      })
      .locator("#course_visibility");

    this.accessLocators = {
      public: this.accessibilityStatus.getByLabel("Public"),
      private: this.accessibilityStatus.getByLabel("Private course"),
      hidden: this.accessibilityStatus.getByLabel("Hidden course"),
      restricted: this.accessibilityStatus.getByLabel("Restriced course"),
    };

    this.motivationalPopup = this.form
      .locator("div")
      .filter({
        has: this.page.getByRole("heading", {
          name: "Motivational popup",
        }),
      })
      .getByLabel("Enable motivational popup");

    this.limitCourseEnrollmentWrapper = this.form.locator("div").filter({
      has: this.page.getByRole("heading", {
        name: "Limit course enrollments",
      }),
    });
    this.limitCourseEnrollment = this.limitCourseEnrollmentWrapper.getByLabel(
      "Enable limit enrollments",
    );
    this.limitCourseMaxEnrollment = this.limitCourseEnrollmentWrapper.locator(
      "input#max_enrollments",
    );
  }


  fill = async ({
    name,
    shortDescription,
    description,
    category,
    subCategory,
    previewType,
    publishingStatus,
    isHideEnrollmentCount,
    access,
    motivationalPopup,
    enableLimitEnrollment,
    enrollmentLimit,
  }: ISingleCourseBasicInfo) => {
    const sanitizedCategory = this.sanitizeCategory(category);
    const sanitizedSubCategory = this.sanitizeCategory(subCategory);
    await this.name.fill(name);
    await this.shortDescription.fill(shortDescription);
    await this.description.fill(description);

    if (category) await this.selectCategory(sanitizedCategory);
    if (subCategory) await this.selectSubCategory(sanitizedSubCategory);

    await this.setImage();
    await this.setVideo();

    if (previewType) await this.previewLocators[previewType].check();

    if (publishingStatus)
      await this.publishingStatusLocators[publishingStatus].check();

    if (typeof isHideEnrollmentCount === "boolean") {
      if (isHideEnrollmentCount) await this.hideEnrollmentCount.check();
      else await this.hideEnrollmentCount.uncheck();
    }

    if (access) await this.accessLocators[access].check();

    if (typeof motivationalPopup === "boolean")
      await this.motivationalPopup.check();

    if (enableLimitEnrollment) {
      await this.limitCourseEnrollment.check();
      await this.limitCourseMaxEnrollment.waitFor({
        state: "visible",
      });
      if (enrollmentLimit)
        await this.limitCourseMaxEnrollment.fill(enrollmentLimit.toString());
    }
  };
}
