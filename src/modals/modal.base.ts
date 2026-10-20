import { Locator, Page } from "@playwright/test";

export class ModalBase {
  readonly page: Page;
  readonly modal: Locator;
  readonly closeX: Locator;

  readonly header: Locator;
  readonly title: Locator;
  readonly body: Locator;

  constructor(page: Page) {
    this.page = page;

    this.modal = this.page
      .locator(".ant-modal-root .ant-modal-content")
      .first();

    this.closeX = this.modal
      .getByRole("button", {
        name: "Close",
      })
      .filter({
        has: this.page.locator("span.ant-modal-close-x"),
      });

    this.header = this.modal.locator(".ant-modal-header");
    this.title = this.header.locator(".ant-modal-title");
    
    this.body = this.modal.locator(".ant-modal-body");
  }

  close = async () => await this.closeX.click();
}
