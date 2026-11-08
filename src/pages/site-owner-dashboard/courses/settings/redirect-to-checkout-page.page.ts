import { Locator, Page } from "@playwright/test";
import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";
import { TCourseRedirectToCheckoutPageSetting } from "@/types/courses.types";
import { NotificationBase } from "@/notifications/notification.base";

export class DashboardCoursesRedirectToCheckoutPage extends DashboardCoursesSettingsBase {
  readonly url = (id: number) =>
    `dashboard/courses/${id}/setting/redirect-to-checkout-page/`;

  /****
   *  After checkout page
   */
  readonly form: Locator;
  readonly pageSelector: Locator;
  readonly pageListBox: Locator;
  readonly pageListItem: Locator;

  /****
   *  Form actions
   */
  readonly chooseCustomPageBtn: Locator;
  readonly resetToDefaultBtn: Locator;
  readonly changePageBtn: Locator;
  readonly saveBtn: Locator;

  readonly notificationBase: NotificationBase;

  constructor(page: Page) {
    super(page);

    /****
     *  After checkout page
     */
    this.form = this.main.locator("form").first();

    this.pageSelector = this.form.locator(".ant-select-selector");
    this.pageListBox = this.page.locator(".rc-virtual-list-holder-inner");
    this.pageListItem = this.pageListBox.locator(".ant-select-item-option");

    /****
     *  Form actions
     */
    this.chooseCustomPageBtn = this.form.getByRole("button", {
      name: "Choose custom page",
    });
    this.resetToDefaultBtn = this.form.getByRole("button", {
      name: "Reset to default",
    });
    this.changePageBtn = this.form.getByRole("button", {
      name: "Change page",
    });
    this.saveBtn = this.form.getByRole("button", {
      name: "Save",
    });

    this.notificationBase = new NotificationBase(this.page);
  }

  /****
   *  Navigation
   */
  goto = async (id: number) => await this.page.goto(this.url(id));

  /****
   *  Page selection
   */
  selectPage = async (
    selectedPage: Exclude<TCourseRedirectToCheckoutPageSetting, null>,
  ) => {
    await this.pageSelector.waitFor({
      state: "visible",
    });

    await this.pageSelector.click();

    await this.pageListBox.waitFor({
      state: "visible",
    });

    await this.pageListItem
      .getByText(selectedPage, {
        exact: true,
      })
      .first()
      .click();

    /* "Reset to default" only shows up after the page is saved, so just
     * wait for the dropdown to close here. */
    await this.pageListBox.waitFor({
      state: "hidden",
    });
  };

  /****
   *  Reset configuration
   */
  resetPageToDefault = async () => {
    if (!(await this.resetToDefaultBtn.isVisible())) return;

    await this.resetToDefaultBtn.click();
  };

  /****
   *  Save configuration
   */
  save = async () => {
    await this.saveBtn.click();

    const status = await this.notificationBase.checkStatus();

    return status === "success";
  };

  /****
   *  Custom page configuration
   */
  private configurePage = async (
    actionButton: Locator,
    pageName: TCourseRedirectToCheckoutPageSetting,
  ) => {
    if (!pageName) return;

    /* isVisible() doesn't wait, and the form renders after the heading, so
     * wait for the action button (or fail loudly) instead of silently
     * skipping the configuration. */
    await actionButton.waitFor({ state: "visible", timeout: 15000 });

    await actionButton.click();

    await this.pageSelector.waitFor({
      state: "visible",
    });

    await this.selectPage(pageName);

    const saved = await this.save();

    if (saved) {
      await this.resetToDefaultBtn.waitFor({
        state: "visible",
      });
    }

    return saved;
  };

  /****
   *  Choose custom checkout page
   */
  chooseCustomPage = async (pageName: TCourseRedirectToCheckoutPageSetting) =>
    await this.configurePage(this.chooseCustomPageBtn, pageName);

  /****
   *  Change selected checkout page
   */
  changePage = async (pageName: TCourseRedirectToCheckoutPageSetting) =>
    await this.configurePage(this.changePageBtn, pageName);
}
