import { Locator, Page } from "@playwright/test";
import { TCourseAccessibilitySetting } from "@/types/courses.types";
import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";
import { NotificationBase } from "@/notifications/notification.base";

export class DashboardCoursesAccessibilitySettingPage extends DashboardCoursesSettingsBase {
  /*
   * URL for the accessibility settings of a specific course.
   */
  readonly url = (id: number) =>
    `dashboard/courses/${id}/setting/accessibility/`;

  /*
   * Locators for the course accessibility options.
   */
  readonly form: Locator;
  readonly courseVisibilityLabel: Locator;
  readonly courseIsPublishedLabel: Locator;
  readonly presellStatusSwitch: Locator;
  readonly coursePresellOptionLabel: Locator;

  /*
   * Save button and notification handler.
   */
  readonly saveBtn: Locator;
  readonly notificationBase: NotificationBase;

  constructor(page: Page) {
    super(page);

    this.form = this.main.locator("form");
    this.courseVisibilityLabel = this.form.locator("#course_visibility label");
    this.courseIsPublishedLabel = this.form.locator("#is_published label");
    this.presellStatusSwitch = this.form.locator("#presell_status");
    this.coursePresellOptionLabel = this.form.locator(
      "#presell_charge_option label",
    );

    this.saveBtn = this.main.getByRole("button", {
      name: "Save",
    });

    this.notificationBase = new NotificationBase(this.page);
  }

  /*
   * Opens the accessibility settings for the given course.
   */
  goto = async (id: number) => await this.page.goto(this.url(id));

  /*
   * Selects the requested visibility option if available.
   */
  changeVisibility = async (value: TCourseAccessibilitySetting["access"]) => {
    const target = this.courseVisibilityLabel.getByText(value).first();
    if (!(await target.count())) return;
    await target.check();
  };

  /*
   * Selects the requested publishing status if available.
   */
  changePublishStatus = async (
    value: TCourseAccessibilitySetting["publish"],
  ) => {
    const target = this.courseIsPublishedLabel.getByText(value).first();
    if (!(await target.count())) return;
    await target.check();
  };

  /*
   * Updates the presell status and charge option.
   */
  changePresellSetting = async ({
    enable,
    chargeOption,
  }: TCourseAccessibilitySetting["presell"]) => {
    if (enable) await this.presellStatusSwitch.check();
    else return await this.presellStatusSwitch.uncheck();

    if (await this.coursePresellOptionLabel.first().isDisabled()) return;

    const target = this.coursePresellOptionLabel.getByText(chargeOption);
    if (!(await target.count())) return;

    await target.check();
  };

  /*
   * Saves the form.
   */
  save = async () => {
    await this.saveBtn.click();
    return (await this.notificationBase.checkStatus()) === "success";
  };

  /*
   * Applies the provided accessibility settings.
   */
  fill = async (payload: Partial<TCourseAccessibilitySetting>) => {
    if (payload.access) await this.changeVisibility(payload.access);
    if (payload.publish) await this.changePublishStatus(payload.publish);
    if (payload.presell) await this.changePresellSetting(payload.presell);
  };
}
