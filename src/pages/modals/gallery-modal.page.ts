import { Locator, Page } from "@playwright/test";

export class GalleryModalPage {
  readonly page: Page;

  readonly modal: Locator;
  readonly closeBtn: Locator;
  readonly selectBtn: Locator;

  /* left side */
  readonly galleryLeftMenu: Locator;
  readonly galleryLeftMenuItem: Locator;

  readonly galleryRightMain: Locator;
  readonly galleryLoadedIndicator: Locator;
  readonly galleryItems: Locator;

  constructor(page: Page) {
    this.page = page;

    this.modal = this.page.locator(`[role="dialog"]`).filter({
      has: this.page.getByText("Upload From Gallery", {
        exact: true,
      }),
    });

    this.closeBtn = this.modal.getByRole("button", {
      name: "Close",
    });
    this.selectBtn = this.modal.getByRole("button", {
      name: "Select",
    });

    this.galleryLeftMenu = this.modal
      .locator("._mdl_glry_lft_side_main")
      .first();

    this.galleryLeftMenuItem = this.galleryLeftMenu.locator(
      "._mdl_glry_lft_side_li",
    );

    this.galleryRightMain = this.modal.locator("._mdl_glry_main_r8").first();
    this.galleryLoadedIndicator = this.galleryRightMain.locator(
      "._modal_upload_gallery_inner .row",
    );
    this.galleryItems = this.galleryLoadedIndicator
      .locator("._mdl_glry_crd")
      .filter({
        hasNot: this.galleryLoadedIndicator.getByText("Click to upload"),
      });
  }

  close = async () => await this.closeBtn.click();

  selectGalleryTab = async (itemText: "Image" | "Stock Images" | "Video") => {
    await this.galleryLeftMenuItem
      .filter({
        hasText: itemText,
      })
      .click();
    await this.galleryLoadedIndicator.waitFor({
      state: "visible",
    });
  };

  selectNthGalleryItem = async (n: number = 0) => {
    await this.galleryItems.nth(n).click();
  };

  select = async () => {
    await this.selectBtn.click();
  };
}
