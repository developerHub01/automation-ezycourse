import { Locator, Page } from "@playwright/test";
import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";
import { ICourseAfterCheckoutPage } from "@/types/courses.types";
import { NotificationBase } from "@/notifications/notification.base";

export class DashboardCoursesAfterCheckoutPage extends DashboardCoursesSettingsBase {
  readonly url = (id: number) =>
    `dashboard/courses/${id}/setting/after-checkout-page/`;

  /****
   *  After checkout page
   */
  readonly form: Locator;
  readonly afterCheckoutPageLinkLoc: Locator;

  /****
   *  Page type selection
   */
  readonly pageTypeTab: Locator;

  /****
   *  Internal page selection
   */
  readonly pageSelector: Locator;
  readonly pageListBox: Locator;
  readonly pageListItem: Locator;

  /****
   *  External page configuration
   */
  readonly urlInput: Locator;

  /****
   *  Form actions
   */
  readonly resetToDefaultBtn: Locator;
  readonly saveBtn: Locator;

  readonly notificationBase: NotificationBase;

  constructor(page: Page) {
    super(page);

    /****
     *  After checkout page
     */
    this.form = this.main.locator("form").first();
    this.afterCheckoutPageLinkLoc = this.main.locator("._cmntylnk a");

    /****
     *  Page type selection
     */
    this.pageTypeTab = this.main.getByRole("tab");

    /****
     *  Internal page selection
     */
    this.pageSelector = this.form.locator(".ant-select-selector");
    this.pageListBox = this.page.locator(".rc-virtual-list-holder-inner");
    this.pageListItem = this.pageListBox.locator(".ant-select-item-option");

    /****
     *  External page configuration
     */
    this.urlInput = this.form.getByPlaceholder("Enter URL");

    /****
     *  Form actions
     */
    this.resetToDefaultBtn = this.form.getByRole("button", {
      name: "Reset to default",
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
   *  Page type selection
   */
  selectPageTypeTab = async (type: ICourseAfterCheckoutPage["type"]) => {
    const tab = this.pageTypeTab.filter({
      hasText: type,
    });

    await tab.click();

    await this.page.waitForFunction(
      (element) => element.getAttribute("aria-selected") === "true",
      await tab.elementHandle(),
    );

    await (type === "internal" ? this.pageSelector : this.urlInput).waitFor({
      state: "visible",
    });
  };

  /****
   *  Internal / External page configuration
   */
  selectPage = async (nameOrURL: ICourseAfterCheckoutPage["nameOrURL"]) => {
    if (await this.pageSelector.isVisible()) {
      await this.pageSelector.click();

      await this.pageListBox.waitFor({
        state: "visible",
      });

      await this.pageListItem
        .getByText(nameOrURL, {
          exact: true,
        })
        .first()
        .click();
    } else await this.urlInput.fill(nameOrURL);

    await this.resetToDefaultBtn.waitFor({
      state: "attached",
    });
  };

  /****
   *  Reset configuration
   */
  resetPageToDefault = async () => await this.resetToDefaultBtn.click();

  /****
   *  Save configuration
   */
  save = async () => {
    await this.saveBtn.click();

    const status = await this.notificationBase.checkStatus();
    return status === "success";
  };

  /****
   *  Fill after checkout page configuration
   */
  fill = async ({ type, nameOrURL }: ICourseAfterCheckoutPage) => {
    await this.selectPageTypeTab(type);
    await this.selectPage(nameOrURL);
  };
}
