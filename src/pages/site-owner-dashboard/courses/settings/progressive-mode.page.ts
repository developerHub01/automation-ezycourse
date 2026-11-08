import { Locator, Page } from "@playwright/test";
import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";
import { NotificationBase } from "@/notifications/notification.base";

/**
 * Page Object Model for the Progressive mode setting.
 * Progressive mode only exists for bundle courses.
 */
export class DashboardCoursesProgressiveModePage extends DashboardCoursesSettingsBase {
  readonly url = (id: number) =>
    `dashboard/courses/${id}/setting/progressive-mode/`;

  readonly form: Locator;
  readonly enableProgressiveModeCheck: Locator;

  readonly notificationBase: NotificationBase;

  constructor(page: Page) {
    super(page);

    this.form = this.main.locator("form").first();
    this.enableProgressiveModeCheck = this.form.getByRole("checkbox");

    this.notificationBase = new NotificationBase(this.page);
  }

  goto = async (id: number) => await this.page.goto(this.url(id));

  fill = async ({ enable }: { enable: boolean }) => {
    await this.enableProgressiveModeCheck.waitFor({
      state: "visible",
    });
    await this.page.waitForLoadState("networkidle");

    await this.enableProgressiveModeCheck.setChecked(enable);
  };

  /**
   * Saves the form and reports whether the app confirmed it.
   */
  save = async (): Promise<boolean> => {
    await this.saveBtn.click();
    return (await this.notificationBase.checkStatus()) === "success";
  };
}
