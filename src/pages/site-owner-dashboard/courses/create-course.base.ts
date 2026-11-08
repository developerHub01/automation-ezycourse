import { CourseMediaComponent } from "@/components/course-media.component";
import { CourseTextFieldsComponent } from "@/components/course-text-fields.component";
import { ISingleCourseBasicInfo } from "@/types/courses.types";
import { Locator, Page } from "@playwright/test";

export abstract class DashboardCreateCoursesBase {
  abstract readonly url: string;

  readonly page: Page;

  readonly media: CourseMediaComponent;
  readonly fields: CourseTextFieldsComponent;

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

  /**
   * category
   */
  readonly categoryInput: Locator;
  readonly categoryListBox: Locator;
  readonly categoryList: Locator;

  /**
   * sub category
   */
  readonly subCategoryInput: Locator;
  readonly subCategoryListBox: Locator;
  readonly subCategoryList: Locator;

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
    this.fields = new CourseTextFieldsComponent(this.page, this.form);
    this.name = this.fields.name;
    this.shortDescription = this.fields.shortDescription;
    this.description = this.fields.description;

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

    /***
     *  sub category
     */
    this.subCategoryInput = this.form
      .locator(".crtSnglCrse_frm1_itm")
      .filter({
        has: this.page.getByText("Sub Category", {
          exact: true,
        }),
      })
      .locator(".ant-form-item .ant-select-selector input");

    this.subCategoryListBox = this.page
      .locator(".ant-select-dropdown")
      .filter({
        has: this.page.locator(`[role="listbox"]#sub_category_ids_list`),
      })
      .locator(".rc-virtual-list");
    this.subCategoryList = this.subCategoryListBox.locator(
      ".rc-virtual-list-holder-inner",
    );

    /**
     *  Assets uploader
     * **/
    this.media = new CourseMediaComponent(
      this.page,
      this.form.locator("._crtSnglCrse_frm1_itm:has(#image)"),
    );

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

  protected sanitizeCategory = (
    category: ISingleCourseBasicInfo["category"],
  ) => (Array.isArray(category) ? category : category ? [category] : []);

  goto = async () => await this.page.goto(this.url);

  private selectOption = async ({
    optionInput,
    optionListBox,
    optionList,
    options,
  }: {
    optionInput: Locator;
    optionListBox: Locator;
    optionList: Locator;
    options: Array<string>;
  }): Promise<void> => {
    if (!options.length) return;

    await optionInput.waitFor({
      state: "attached",
    });

    await optionInput.click();
    await optionListBox.waitFor({
      state: "attached",
    });

    for (const option of options) {
      const optionCandidate = optionList
        .getByTitle(option, {
          exact: true,
        })
        .and(optionList.locator('[aria-selected="false"]'));

      try {
        if (!(await optionCandidate.count())) throw new Error();
        await optionCandidate.click();
      } catch (error) {
        // console.error(error);
        continue;
      }
    }
    await optionInput.blur();
  };

  selectCategory = async (categories: Array<string>) =>
    await this.selectOption({
      optionInput: this.categoryInput,
      optionListBox: this.categoryListBox,
      optionList: this.categoryList,
      options: categories,
    });

  selectSubCategory = async (subs: Array<string>) =>
    await this.selectOption({
      optionInput: this.subCategoryInput,
      optionListBox: this.subCategoryListBox,
      optionList: this.subCategoryList,
      options: subs,
    });

  setImage = async () => await this.media.setImage();

  setVideo = async () => await this.media.setVideo();

  /**
   * Submits the create form and returns the id of the new course, taken
   * from the edit URL the app redirects to.
   */
  create = async (): Promise<number> => {
    await this.createBtn.click();
    await this.page.waitForURL(/\/dashboard\/courses\/\d+\//);

    return Number(this.page.url().match(/\/dashboard\/courses\/(\d+)\//)![1]);
  };

  back = async () => {
    await this.backBtn.click();
  };

  backToCourses = async () => {
    await this.backToCoursesBtn.click();
  };
}
