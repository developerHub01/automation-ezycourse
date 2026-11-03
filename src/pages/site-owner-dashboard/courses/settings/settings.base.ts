import { Locator, Page } from "@playwright/test";

export class DashboardCoursesSettingsBase {
  readonly url = (id: number) => `dashboard/courses/${id}/setting/`;
  readonly page: Page;

  readonly main: Locator;
  readonly sidebar: Locator;
  readonly sidebarItems: Locator;

  readonly formWrapper: Locator;
  readonly mainHeading: Locator;
  readonly saveBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.main = this.page.locator("._main_content").first();

    this.sidebar = this.main.locator("._crtCrse_sidebr").first();
    this.sidebarItems = this.sidebar
      .locator("._crtCrse_sidebr_main ._crtCrsSdbr_stng_ul")
      .getByRole("listitem");

    this.formWrapper = this.main.locator("._crtCrse_intro_all").first();
    this.mainHeading = this.main
      .getByRole("heading", {
        level: 2,
      })
      .first();
    this.saveBtn = this.main.getByRole("button", {
      name: "Save",
    });
  }

  goto = async (courseId: number) => await this.page.goto(this.url(courseId));

  getTabLinkByName = (tab: string) =>
    this.sidebarItems
      .filter({
        has: this.page.getByText(tab),
      })
      .getByRole("link");

  gotoTab = async ({ name, title }: { name: string; title: string | null }) => {
    await this.getTabLinkByName(name).click();
    if (!title) {
      await this.mainHeading.waitFor({
        state: "detached",
      });
      return;
    }
    await this.mainHeading
      .filter({
        hasText: title,
      })
      .waitFor({
        state: "visible",
      });
  };
}
