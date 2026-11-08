import { Locator, Page } from "@playwright/test";
import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";
import { NotificationBase } from "@/notifications/notification.base";

/**
 * Page Object Model for the course Motivation popup setting.
 */
export class DashboardCoursesMotivationPopupPage extends DashboardCoursesSettingsBase {
  readonly url = (id: number) => `dashboard/courses/${id}/setting/motivation/`;

  readonly form: Locator;
  readonly enableMotivationalPopupCheck: Locator;
  readonly updateBtn: Locator;

  readonly notificationBase: NotificationBase;

  constructor(page: Page) {
    super(page);

    this.form = this.main.locator("form").first();
    this.enableMotivationalPopupCheck = this.form.locator("#motiv_popup");
    this.updateBtn = this.form.getByRole("button", {
      name: "Update",
    });

    this.notificationBase = new NotificationBase(this.page);
  }

  goto = async (id: number) => await this.page.goto(this.url(id));

  fill = async ({ enable }: { enable: boolean }) => {
    await this.enableMotivationalPopupCheck.waitFor({
      state: "visible",
    });
    await this.page.waitForLoadState("networkidle");

    await this.enableMotivationalPopupCheck.setChecked(enable);
  };

  /**
   * Updates the setting and reports whether the app confirmed it.
   */
  update = async (): Promise<boolean> => {
    await this.updateBtn.click();
    return (await this.notificationBase.checkStatus()) === "success";
  };
}
