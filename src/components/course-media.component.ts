import { Locator, Page } from "@playwright/test";
import { GalleryModalPage } from "@/pages/modals/gallery-modal.page";

/**
 * Course image + video uploaders. The same markup is used by the create form
 * and by the Basic Information settings, so both pages share this component.
 *
 * @param root the element that contains the uploaders and the hidden
 *             `#image` / `#video` inputs.
 */
export class CourseMediaComponent {
  readonly page: Page;
  readonly gallery: GalleryModalPage;

  readonly imageUploader: Locator;
  readonly videoUploader: Locator;
  readonly imageInput: Locator;
  readonly videoInput: Locator;
  readonly imageDeleteBtn: Locator;
  readonly videoDeleteBtn: Locator;

  constructor(page: Page, root: Locator) {
    this.page = page;
    this.gallery = new GalleryModalPage(page);

    const uploaders = root.locator("._1popUp_upld");
    this.imageUploader = uploaders.nth(0);
    this.videoUploader = uploaders.nth(1);

    this.imageInput = root.locator("#image").first();
    this.videoInput = root.locator("#video").first();

    /* Shown on an uploader only while a file is selected. Use these (not the
     * hidden inputs) to tell whether a file is set: #video stays empty. */
    this.imageDeleteBtn = this.imageUploader.locator("._popup_img_dlt");
    this.videoDeleteBtn = this.videoUploader.locator("._popup_img_dlt");
  }

  private pickFromGallery = async (
    uploader: Locator,
    tab: "Stock Images" | "Video",
  ) => {
    await uploader.click();
    await this.gallery.modal.waitFor({ state: "visible" });
    await this.gallery.selectGalleryTab(tab);
    await this.gallery.selectNthGalleryItem();
    await this.gallery.select();
    await this.gallery.modal.waitFor({ state: "detached" });
  };

  setImage = async () =>
    await this.pickFromGallery(this.imageUploader, "Stock Images");

  setVideo = async () => await this.pickFromGallery(this.videoUploader, "Video");

  /**
   * Removes the selected file (if any) so that a new one can be picked.
   */
  removeImage = async () => {
    if (!(await this.imageDeleteBtn.isVisible())) return;

    await this.imageDeleteBtn.click();
    await this.imageDeleteBtn.waitFor({ state: "hidden" });
  };

  removeVideo = async () => {
    if (!(await this.videoDeleteBtn.isVisible())) return;

    await this.videoDeleteBtn.click();
    await this.videoDeleteBtn.waitFor({ state: "hidden" });
  };

  /**
   * Replaces the current image/video with a new one from the gallery.
   */
  replace = async ({ image, video }: { image?: boolean; video?: boolean }) => {
    if (image) {
      await this.removeImage();
      await this.setImage();
    }
    if (video) {
      await this.removeVideo();
      await this.setVideo();
    }
  };
}
