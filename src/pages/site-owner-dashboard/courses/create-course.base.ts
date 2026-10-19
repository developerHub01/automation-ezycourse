import { GalleryModalPage } from "@/pages/modals/gallery-modal.page";
import { Locator, Page } from "@playwright/test";
import { ISingleCourseBasicInfo } from "./create.page";

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

  readonly categoryInput: Locator;
  readonly categoryListBox: Locator;
  readonly categoryList: Locator;

  readonly assetWrapper: Locator;
  readonly imageUploader: Locator;
  readonly imageInput: Locator;
  readonly videoUploader: Locator;
  readonly videoInput: Locator;

  readonly previewType: Locator;
  readonly previewLocators: Record<
    NonNullable<ISingleCourseBasicInfo["previewType"]>,
    Locator
  >;
  readonly publishingStatusLocators: Record<
    NonNullable<ISingleCourseBasicInfo["publishingStatus"]>,
    Locator
  >;

  readonly publishStatus: Locator;

  readonly hideEnrollmentCount: Locator;

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

    /***
     *  Category
     */
    this.categoryInput = this.form
      .locator(".crtSnglCrse_frm1_itm")
      .filter({
        has: this.page.getByText("Category", {
          exact: true,
        }),
      })
      .locator(".ant-form-item .ant-select-selector input");

    this.categoryListBox = this.page
      .locator(".ant-select-dropdown")
      .filter({
        has: this.page.locator(`[role="listbox"]#category_ids_list`),
      })
      .locator(".rc-virtual-list");
    this.categoryList = this.categoryListBox.locator(
      ".rc-virtual-list-holder-inner",
    );

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

    this.previewType = this.form
      .locator("._crtSnglCrse_frm1_itm")
      .filter({
        has: this.page.getByText("Select course preview type", {
          exact: true,
        }),
      })
      .locator("#course_preview_type");
    this.previewLocators = {
      image: this.previewType.getByLabel("Image"),
      video: this.previewType.getByLabel("Video"),
    };

    this.publishStatus = this.form
      .locator("._crtSnglCrse_frm1_itm")
      .filter({
        has: this.page.getByText("Publishing status", {
          exact: true,
        }),
      })
      .locator("#is_published");
    this.publishingStatusLocators = {
      published: this.publishStatus.getByLabel("Published"),
      draft: this.publishStatus.getByLabel("Draft"),
    };

    this.hideEnrollmentCount = this.form
      .locator("._crtSnglCrse_frm1_itm")
      .filter({
        has: this.page.getByText("Enrollment count"),
      })
      .getByLabel("Hide enrollment count");
  }

  goto = async () => await this.page.goto(this.url);

  selectCategory = async (categories: Array<string>) => {
    await this.categoryInput.click();
    await this.categoryListBox.waitFor({
      state: "attached",
    });

    for (const category of categories) {
      const selectionCandidate = this.categoryList
        .getByTitle(category, {
          exact: true,
        })
        .and(this.categoryList.locator('[aria-selected="false"]'));

      try {
        if (!(await selectionCandidate.count())) throw new Error();
        await selectionCandidate.click();
      } catch (error) {
        console.error(error);
        continue;
      }
    }
    await this.categoryInput.blur();
  };

  setImage = async () => {
    await this.imageUploader.click();
    await this.gallery.modal.waitFor({
      state: "visible",
    });
    await this.gallery.selectGalleryTab("Stock Images");
    await this.gallery.selectNthGalleryItem();
    await this.gallery.select();
    await this.gallery.modal.waitFor({
      state: "detached",
    });
  };

  setVideo = async () => {
    await this.videoUploader.click();
    await this.gallery.modal.waitFor({
      state: "visible",
    });
    await this.gallery.selectGalleryTab("Video");
    await this.gallery.selectNthGalleryItem();
    await this.gallery.select();
    await this.gallery.modal.waitFor({
      state: "detached",
    });
  };

  back = async () => {
    await this.backBtn.click();
  };

  backToCourses = async () => {
    await this.backToCoursesBtn.click();
  };
}
