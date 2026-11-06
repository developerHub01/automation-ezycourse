import { Locator, Page } from "@playwright/test";
import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";
import { NotificationBase } from "@/notifications/notification.base";
import { ICourseLandingPage } from "@/types/courses.types";

/**
 * Page Object Model for Course Landing Page settings.
 *
 * Handles course details landing page selection, preview functionality,
 * enrollment count visibility, and custom landing page configuration.
 */
export class DashboardCoursesLandingPagePage extends DashboardCoursesSettingsBase {
  /**
   * Course-specific landing page settings URL.
   */
  readonly url = (id: number) =>
    `dashboard/courses/${id}/setting/landing-page/`;

  /****
   * Course Details Landing Page
   */
  readonly detailsPageForm: Locator;
  readonly detailsPageFormUpdateBtn: Locator;
  readonly landingPageLabels: Locator;
  readonly landingPageCheck: Locator;
  readonly landingPagePreview: Locator;
  readonly landingPagePreviewDialogue: Locator;
  readonly landingPagePreviewDialogueImg: Locator;
  readonly landingPagePreviewDialogueClose: Locator;

  /****
   * Enrollment Count Settings
   */
  readonly enrollmentCountForm: Locator;
  readonly enrollmentCountHiddenCheck: Locator;
  readonly enrollmentCountFormUpdateBtn: Locator;

  /****
   * Custom Landing Page Settings
   */
  readonly customLandingPageChangeButton: Locator;
  readonly customLandingPageChooseButton: Locator;
  readonly customLandingPageResetButton: Locator;
  readonly customLandingPageSelector: Locator;
  readonly customLandingPageListbox: Locator;
  readonly customLandingPageListboxItem: Locator;

  /****
   * Shared notification handler.
   */
  readonly notificationBase: NotificationBase;

  constructor(page: Page) {
    super(page);

    this.notificationBase = new NotificationBase(this.page);

    /****
     * Course Details Landing Page
     */
    this.detailsPageForm = this.page.locator("form.ant-form").filter({
      hasText: "Select Course Details Page",
    });

    this.detailsPageFormUpdateBtn = this.detailsPageForm.getByRole("button", {
      name: "update",
    });

    this.landingPageLabels = this.detailsPageForm
      .locator(".ant-radio-group label")
      .filter({
        has: this.page.getByRole("img"),
      });

    this.landingPageCheck = this.landingPageLabels.getByRole("radio");

    this.landingPagePreview = this.landingPageLabels.getByRole("button", {
      name: "preview",
    });

    this.landingPagePreviewDialogue = this.page.getByRole("dialog");

    this.landingPagePreviewDialogueImg =
      this.landingPagePreviewDialogue.getByRole("img", {
        name: "preview",
      });

    this.landingPagePreviewDialogueClose =
      this.landingPagePreviewDialogue.getByRole("button", {
        name: "Close",
      });

    /****
     * Enrollment Count Settings
     */
    this.enrollmentCountForm = this.page.locator("form.ant-form").filter({
      hasText: "Enrollment count",
    });

    this.enrollmentCountHiddenCheck = this.enrollmentCountForm.locator(
      "#enrollment_count_hidden",
    );

    this.enrollmentCountFormUpdateBtn = this.enrollmentCountForm.getByRole(
      "button",
      {
        name: "update",
      },
    );

    /****
     * Custom Landing Page Settings
     */
    this.customLandingPageChangeButton = this.enrollmentCountForm.getByRole(
      "button",
      {
        name: "Change Page",
      },
    );

    this.customLandingPageChooseButton = this.enrollmentCountForm.getByRole(
      "button",
      {
        name: "Choose custom Page",
      },
    );

    this.customLandingPageResetButton = this.enrollmentCountForm.getByRole(
      "button",
      {
        name: "Reset to default",
      },
    );

    this.customLandingPageSelector =
      this.enrollmentCountForm.locator(`.ant-select-selector`);

    this.customLandingPageListbox = this.page
      .locator(`.rc-virtual-list-holder-inner`)
      .first();

    this.customLandingPageListboxItem = this.customLandingPageListbox.locator(
      ".ant-select-item-option",
    );
  }

  /****
   * Navigate to the landing page settings of a specific course.
   */
  goto = async (id: number) => await this.page.goto(this.url(id));

  /****
   * Landing Page Preview
   *
   * Opens the preview dialog for the selected landing page option
   * and waits until the dialog becomes visible.
   */
  previewLandigPage = async (index: number = 0) => {
    await this.landingPagePreview.nth(index).click();

    await this.landingPagePreviewDialogue.waitFor({
      state: "visible",
    });
  };

  /****
   * Closes the landing page preview dialog if it is available.
   */
  closePreviewPage = async () => {
    if (!(await this.landingPagePreviewDialogueClose.count())) return;

    await this.landingPagePreviewDialogueClose.click();

    await this.landingPagePreviewDialogueClose.waitFor({
      state: "hidden",
    });
  };

  /****
   * Selects a landing page option from the available course details pages.
   */
  selectLandingPage = async (index: number = 0) => {
    await this.landingPageLabels.nth(index).check();
  };

  /****
   * Update Form
   *
   * Clicks the supplied update button and observes whether it becomes
   * disabled while processing and whether the page reloads afterward.
   */
  update = async (loc: Locator) => {
    await loc.click();
    await this.page.waitForLoadState("load");
    await loc.waitFor({
      state: "visible",
    });

    await this.page.waitForFunction(
      (button) => (button as HTMLButtonElement).disabled === false,
      await loc.elementHandle(),
    );
  };

  /****
   * Selects a course details landing page option and saves the changes.
   */
  selectLandingPageAndSave = async (index: number = 0) => {
    await this.selectLandingPage(index);

    await this.update(this.detailsPageFormUpdateBtn);
  };

  /****
   * Enrollment Count Visibility
   *
   * Controls whether the enrollment count is hidden or displayed
   * on the course landing page.
   */
  checkHideEnrollmentCount = async (check: boolean) => {
    if (check) await this.enrollmentCountHiddenCheck.check();
    else await this.enrollmentCountHiddenCheck.uncheck();
  };

  /****
   * Custom Landing Page Selection
   *
   * Opens the custom landing page selector and selects the requested
   * page from the available landing page options.
   */
  selectCustomLandingPage = async (name: string) => {
    console.log("selectCustomLandingPage ===========");
    if (await this.customLandingPageChooseButton.count())
      await this.customLandingPageChooseButton.click();
    else if (await this.customLandingPageChangeButton.count())
      await this.customLandingPageChangeButton.click();
    else return;

    await this.customLandingPageSelector.waitFor({
      state: "visible",
    });

    if (!(await this.customLandingPageListbox.count())) {
      await this.customLandingPageSelector.click();
      await this.customLandingPageListbox.waitFor({
        state: "visible",
      });
    }

    const selectableItem = this.customLandingPageListboxItem.getByText(name);

    if (!(await selectableItem.count())) return;

    await selectableItem.click();
  };

  /****
   * Resets the custom landing page configuration to its default.
   */
  resetCustomLandingPage = async () => {
    if (!(await this.customLandingPageResetButton.count())) return;

    await this.customLandingPageResetButton.click();
    await this.customLandingPageResetButton.waitFor({
      state: "detached",
    });
  };

  /****
   * Custom Landing Page Configuration
   *
   * Selects the specified custom landing page when a page name is provided.
   * Resets the configuration to its default when the payload is empty.
   * Skips the operation when the payload is explicitly "undefined".
   */
  setCustomLandingPage = async (
    payload?: ICourseLandingPage["customLandingPage"],
  ) => {
    if (payload === "undefined") return;

    if (payload) return await this.selectCustomLandingPage(payload);

    await this.resetCustomLandingPage();
  };

  enrollmentAndCustomLandingPageSave = async (
    payload: Partial<
      Pick<ICourseLandingPage, "hideEnrollmentCount" | "customLandingPage">
    >,
  ) => {
    if ("hideEnrollmentCount" in payload)
      await this.checkHideEnrollmentCount(payload.hideEnrollmentCount!);

    if ("customLandingPage" in payload)
      await this.setCustomLandingPage(payload.customLandingPage!);

    await this.update(this.enrollmentCountFormUpdateBtn);
  };

  /****
   * Fills the supplied course landing page settings.
   *
   * Updates only the properties provided in the payload.
   */
  fill = async (payload: Partial<ICourseLandingPage>) => {
    if ("preview" in payload)
      await this.selectLandingPageAndSave(payload.preview);

    if (
      !("hideEnrollmentCount" in payload) &&
      !("customLandingPage" in payload)
    )
      return;

    await this.enrollmentAndCustomLandingPageSave({
      customLandingPage: payload.customLandingPage,
      hideEnrollmentCount: payload.hideEnrollmentCount,
    });
  };
}
