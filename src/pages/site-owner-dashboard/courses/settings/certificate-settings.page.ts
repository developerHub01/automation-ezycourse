import { Locator, Page } from "@playwright/test";
import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";
import { ICourseCertificationSettings } from "@/types/courses.types";
import { NotificationBase } from "@/notifications/notification.base";

export class DashboardCertificateSettingsPage extends DashboardCoursesSettingsBase {
  readonly url = (id: number) => `dashboard/courses/${id}/setting/certificate/`;

  /****
   *  Form elements
   */
  readonly form: Locator;
  readonly enableCertificationCheck: Locator;
  readonly certificateIdLabel: Locator;

  /****
   *  Certificate selection
   */
  readonly certificateSelector: Locator;
  readonly certificateListBox: Locator;
  readonly certificateListItem: Locator;

  /****
   *  Certificate settings
   */
  readonly allowWithoutCompleting: Locator;
  readonly displayCompletionTime: Locator;

  /****
   *  Form actions
   */
  readonly updateBtn: Locator;

  readonly notificationBase: NotificationBase;

  constructor(page: Page) {
    super(page);

    /****
     *  Form elements
     */
    this.form = this.main.locator("form").first();
    this.enableCertificationCheck = this.form.locator(".ant-checkbox-input");
    this.certificateIdLabel = this.form.locator('label[for="certificate_id"]');

    /****
     *  Certificate selection
     */
    this.certificateSelector = this.form.locator(".ant-select-selector");
    this.certificateListBox = this.page
      .locator(".rc-virtual-list-holder-inner")
      .first();
    this.certificateListItem = this.certificateListBox.locator(
      ".ant-select-item-option",
    );

    /****
     *  Certificate settings
     */
    this.allowWithoutCompleting = this.form.locator("#auto_certification");
    this.displayCompletionTime = this.form.locator(
      "#is_allowed_completion_time",
    );

    /****
     *  Form actions
     */
    this.updateBtn = this.main.getByRole("button", {
      name: "Update",
    });

    this.notificationBase = new NotificationBase(this.page);
  }

  /****
   *  Navigation
   */
  goto = async (id: number) => await this.page.goto(this.url(id));

  /****
   *  Certification toggle
   */
  changeCertificationCheck = async (
    check: ICourseCertificationSettings["enable"],
  ) => {
    if (check) await this.enableCertificationCheck.check();
    else await this.enableCertificationCheck.uncheck();

    await this.certificateIdLabel.waitFor({
      state: check ? "visible" : "hidden",
    });
  };

  /****
   *  Certificate selection
   */
  changeCertificate = async (
    certificateName: Extract<
      ICourseCertificationSettings,
      { enable: true }
    >["certificate"],
  ) => {
    await this.certificateSelector.click();

    await this.certificateListBox.waitFor({
      state: "visible",
    });

    await this.certificateListItem
      .getByText(certificateName, {
        exact: true,
      })
      .first()
      .click();
  };

  /****
   *  Certification switches
   */
  handleSwitch = async ({
    allowWithoutCompletion,
    displayCompletionTime,
  }: Partial<
    Extract<ICourseCertificationSettings, { enable: true }>["switchs"]
  >) => {
    if (allowWithoutCompletion !== undefined) {
      if (allowWithoutCompletion) await this.allowWithoutCompleting.check();
      else await this.allowWithoutCompleting.uncheck();
    }

    if (displayCompletionTime !== undefined) {
      if (displayCompletionTime) await this.displayCompletionTime.check();
      else await this.displayCompletionTime.uncheck();
    }
  };

  /****
   *  Fill certification settings
   */
  fill = async (payload: ICourseCertificationSettings) => {
    await this.changeCertificationCheck(payload.enable);

    if (!payload.enable) return;

    const { certificate, switchs } = payload;

    await this.changeCertificate(certificate);
    await this.handleSwitch(switchs);
  };

  /****
   *  Update certification settings
   */
  update = async () => {
    await this.updateBtn.click();

    const status = await this.notificationBase.checkStatus();

    return status === "success";
  };
}
