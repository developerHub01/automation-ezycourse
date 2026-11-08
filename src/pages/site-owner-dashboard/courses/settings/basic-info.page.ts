import { Locator, Page } from "@playwright/test";
import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";
import { NotificationBase } from "@/notifications/notification.base";
import { CourseMediaComponent } from "@/components/course-media.component";
import { CourseTextFieldsComponent } from "@/components/course-text-fields.component";

/**
 * Page Object Model for the course Basic Information settings.
 */
export class DashboardCoursesBasicInfoPage extends DashboardCoursesSettingsBase {
  readonly url = (id: number) => `dashboard/courses/${id}/setting/`;

  readonly form: Locator;
  readonly slug: Locator;

  /* name, short description, description */
  readonly fields: CourseTextFieldsComponent;
  /* course image + video */
  readonly media: CourseMediaComponent;

  readonly notificationBase: NotificationBase;

  constructor(page: Page) {
    super(page);

    this.form = this.main.locator("form").first();
    this.slug = this.form.locator("#course_slug");

    this.fields = new CourseTextFieldsComponent(this.page, this.form);
    this.media = new CourseMediaComponent(this.page, this.form);

    this.notificationBase = new NotificationBase(this.page);
  }

  goto = async (id: number) => await this.page.goto(this.url(id));

  /**
   * Updates only what is provided in the payload.
   * `image` / `video`: true replaces the current file with a gallery one.
   */
  fill = async (payload: {
    name?: string;
    slug?: string;
    shortDescription?: string;
    description?: string;
    image?: boolean;
    video?: boolean;
  }) => {
    await this.fields.fill(payload);

    if (payload.slug) await this.slug.fill(payload.slug);

    await this.media.replace({ image: payload.image, video: payload.video });
  };

  /**
   * Saves the form and reports whether the app confirmed it.
   */
  save = async (): Promise<boolean> => {
    await this.saveBtn.click();
    return (await this.notificationBase.checkStatus()) === "success";
  };
}
