import { Locator, Page, expect } from "@playwright/test";

/**
 * Page Object Model for logging out from the dashboard header menu.
 */
export class LogoutPage {
  readonly page: Page;
  readonly profileMenuTrigger: Locator;
  readonly logoutItem: Locator;
  readonly logoutAPI = "api/student/auth/logout";

  constructor(page: Page) {
    this.page = page;

    /* Header avatar, shared by the owner/admin and student layouts. The
     * student page has a second profile picture in its profile card. */
    this.profileMenuTrigger = this.page.locator("div._menu_user_pic").first();

    /* Owner/admin: a list item. Student: an <a> without href. */
    this.logoutItem = this.page
      .getByRole("listitem", {
        name: "Logout",
      })
      .or(
        this.page.locator("a._menu_usr_drpdwn_lnk").filter({
          hasText: "Logout",
        }),
      )
      .first();
  }

  openProfileMenu = async () => {
    await this.profileMenuTrigger.click();
    await this.logoutItem.waitFor({
      state: "visible",
    });
  };

  /**
   * Opens the profile menu, clicks "Logout" and waits for the logout API.
   * Goes to the dashboard first when not already inside the app.
   * Returns false when nobody is logged in (nothing to log out of).
   */
  logout = async (): Promise<boolean> => {
    if (!/\/dashboard/.test(this.page.url()))
      await this.page.goto("/dashboard/").catch(() => {});

    if (!(await this.isLoggedIn())) return false;

    await this.openProfileMenu();

    const responseListener = this.page.waitForResponse(
      (response) =>
        response.url().endsWith(`/${this.logoutAPI}`) &&
        response.request().method() === "POST",
    );
    await this.logoutItem.click();
    await responseListener;

    return true;
  };

  /**
   * The profile menu only exists for a logged-in user. A logged-out visit
   * is redirected away from the dashboard instead.
   */
  isLoggedIn = async (): Promise<boolean> => {
    try {
      await this.profileMenuTrigger.waitFor({
        state: "visible",
        timeout: 15000,
      });
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Asserts the session is gone: the app leaves the dashboard and a direct
   * visit to the dashboard no longer opens it.
   */
  expectLoggedOut = async (): Promise<void> => {
    await expect(this.page).not.toHaveURL(/\/dashboard\/?$/);

    /* A logged-out visit gets redirected away mid-navigation, which Chrome
     * reports as ERR_ABORTED, so the abort itself is expected here. */
    await this.page.goto("/dashboard/").catch(() => {});
    await expect(this.page).not.toHaveURL(/\/dashboard\/?$/);
  };
}
