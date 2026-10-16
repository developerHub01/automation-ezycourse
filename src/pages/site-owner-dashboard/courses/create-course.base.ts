import { Locator, Page } from "@playwright/test";

export abstract class DashboardCreateCoursesBase {
  abstract readonly url: string;

  readonly page: Page;

  /***
   * course creation layout
   */
  readonly topMenu: Locator;
  readonly backBtn: Locator;
  readonly backToCoursesBtn: Locator;

  /***
   * course form
   */
  readonly form: Locator;
  readonly formHeading: Locator;
  // readonly name: Locator;
  // readonly shortDescription: Locator;
  // readonly description: Locator;
  // readonly category: Locator;
  // readonly image: Locator;
  // readonly video: Locator;
  // readonly accessibilityStatus: Locator;

  constructor(page: Page) {
    this.page = page;

    /***
     * course creation layout
     */
    this.topMenu = this.page.locator("._crtCrse_top").first();
    this.backBtn = this.topMenu.locator("._crtCrse_back").first();
    // this.backToCoursesBtn = this.topMenu
    //   .getByRole("link", {
    //     name: "Back to Courses",
    //     exact: true,
    //   })
    //   .first();
    this.backToCoursesBtn = this.topMenu.locator("._crtCrse_prvw_crse").first();

    /***
     * course form
     */
    this.form = this.page.locator("form").filter({
      has: this.page.getByRole("heading", {
        level: 2,
      }),
    });
    this.formHeading = this.form.getByRole("heading", {
      level: 2,
    });
  }

  goto = async () => await this.page.goto(this.url);

  back = async () => {
    await this.backBtn.click();
  };

  backToCourses = async () => {
    await this.backToCoursesBtn.click();
  };
}
