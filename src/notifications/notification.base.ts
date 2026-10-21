import { Locator, Page } from "@playwright/test";

type TNotificationStatus = "check-circle";

export class NotificationBase {
  readonly page: Page;
  readonly notification: Locator;
  readonly content: Locator;
  readonly message: Locator;
  readonly description: Locator;
  readonly icon: Locator;
  readonly closeX: Locator;

  private readonly statusLabelMap: Record<TNotificationStatus, string> = {
    "check-circle": "success",
  };

  constructor(page: Page) {
    this.page = page;

    this.notification = this.page.locator(".ant-notification-notice").first();
    this.content = this.notification.getByRole("alert").first();
    this.message = this.content.locator(".ant-notification-notice-message");
    this.description = this.content.locator(
      ".ant-notification-notice-description",
    );
    this.icon = this.content.getByRole("img").first();

    this.closeX = this.notification
      .locator(".ant-notification-notice-close")
      .first();
  }

  close = async () => await this.closeX.click();

  checkStatus = async () => {
    await this.notification.waitFor({
      state: "attached",
    });

    const ariaLable = (await this.icon.getAttribute(
      `aria-label`,
    )) as TNotificationStatus;
    if (!ariaLable) return null;

    return this.statusLabelMap[ariaLable];
  };
}
