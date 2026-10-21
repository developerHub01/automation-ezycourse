import { Locator, Page } from "@playwright/test";

export class DropdownComponent {
  readonly page: Page;
  readonly dropdownMenu: Locator;
  readonly dropdownMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dropdownMenu = this.page
      .locator(".ant-dropdown:visible")
      .getByRole("menu");
    this.dropdownMenuItem = this.dropdownMenu.getByRole("menuitem");
  }

  selectAction = async (actionName: string): Promise<void> => {
    await this.dropdownMenu.waitFor({
      state: "visible",
    });

    await this.dropdownMenuItem
      .filter({
        hasText: actionName,
      })
      .click();

    await this.dropdownMenu.waitFor({
      state: "hidden",
    });
  };
}
