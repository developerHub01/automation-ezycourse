import { GalleryModalPage } from "@/pages/modals/gallery-modal.page";
import { Locator, Page } from "@playwright/test";

export interface ICourseBasicInfo {
  name: string;
  shortDescription: string;
  description: string;
  image?: string;
  video?: string;
}

export abstract class DashboardCreateCoursesBase {
  abstract readonly url: string;

  readonly page: Page;

  readonly gallery: GalleryModalPage;

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
  readonly name: Locator;
  readonly shortDescription: Locator;
  readonly description: Locator;
  // readonly category: Locator;
  readonly assetWrapper: Locator;
  readonly imageUploader: Locator;
  readonly imageInput: Locator;
  readonly videoUploader: Locator;
  readonly videoInput: Locator;
  // readonly accessibilityStatus: Locator;

  readonly createBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.gallery = new GalleryModalPage(page);

    /***
     * course creation layout
     */
    this.topMenu = this.page.locator("._crtCrse_top").first();
    this.backBtn = this.topMenu.locator("._crtCrse_back").first();
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
    this.name = this.form.locator("#title");
    this.shortDescription = this.form.locator("#short_description");
    this.description = this.form
      .locator(`._crtSnglCrse_frm1_itm [contenteditable="true"]`)
      .first();

    /**
     *  Assets uploader
     * **/
    this.assetWrapper = this.form.locator("._crtSnglCrse_frm1_itm:has(#image)");

    this.imageUploader = this.assetWrapper.locator("._1popUp_upld").nth(0);
    this.videoUploader = this.assetWrapper.locator("._1popUp_upld").nth(1);

    this.imageInput = this.assetWrapper.locator(`#image`).first();
    this.videoInput = this.assetWrapper.locator(`#video`).first();

    this.createBtn = this.form.locator('button[type="submit"]').filter({
      hasText: "Create",
    });
  }

  goto = async () => await this.page.goto(this.url);

  fill = async ({
    name,
    shortDescription,
    description,
    image,
    video,
  }: ICourseBasicInfo) => {
    await this.name.fill(name);
    await this.shortDescription.fill(shortDescription);
    await this.description.fill(description);
    await this.setImage(image);
    await this.setVideo(video);
  };

  fillHiddenInput = async ({
    locator,
    value,
  }: {
    locator: Locator;
    value: string;
  }) => {
    await locator.evaluate((node: HTMLInputElement, inpValue: string) => {
      node.value = inpValue;
      node.dispatchEvent(
        new Event("input", {
          bubbles: true,
        }),
      );
      node.dispatchEvent(
        new Event("change", {
          bubbles: true,
        }),
      );
    }, value);
  };

  setImage = async (
    imagePath: string = "https://images.unsplash.com/photo-1792058308865-6f4e27281054",
  ) =>
    await this.fillHiddenInput({
      locator: this.imageInput,
      value: imagePath,
    });

  setVideo = async (
    videoPath: string = "https://www.pexels.com/download/video/1208094/",
  ) =>
    await this.fillHiddenInput({
      locator: this.videoInput,
      value: videoPath,
    });

  back = async () => {
    await this.backBtn.click();
  };

  backToCourses = async () => {
    await this.backToCoursesBtn.click();
  };
}
