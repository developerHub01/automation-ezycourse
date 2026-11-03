import { Page } from "@playwright/test";
import { ICourseAdvanceInfo } from "@/types/courses.types";
import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";

export class DashboardCoursesAdvanceInfoPage extends DashboardCoursesSettingsBase {
  readonly url = (id: number) =>
    `dashboard/courses/${id}/setting/advance-info/`;

  readonly language = this.page.locator("input#course_language");
  readonly videoDuration = this.page.locator("input#video_duration");
  readonly paymentMethodWrapper = this.page
    .locator("._crtSnglCrse_frm1")
    .filter({
      has: this.page.getByText("Select payment methods"),
    });
  readonly paymentMethodSelector = this.paymentMethodWrapper.locator(
    ".ant-select-selector",
  );
  readonly paymentMethodSelectorInput =
    this.paymentMethodSelector.locator(`input[type="search"]`);
  readonly paymentSelectedItem = this.paymentMethodSelector.locator(
    ".ant-select-selection-item",
  );
  readonly paymentMethodList = this.page
    .locator(".rc-virtual-list-holder-inner")
    .first();
  readonly paymentMethodListItem =
    this.paymentMethodList.locator(".ant-select-item");

  readonly enableCourseLevel = this.page.locator("#enable_course_level");
  readonly courseLevelInput = this.page.locator("#course_level input");

  constructor(page: Page) {
    super(page);
  }

  goto = async (id: number) => await this.page.goto(this.url(id));

  isPaymentSelected = async (title: string) =>
    Boolean(
      await this.paymentMethodListItem
        .getByText(title)
        .and(this.page.locator(`[aria-selected="true"]`))
        .count(),
    );

  fill = async ({}: Partial<ICourseAdvanceInfo>) => {};

  clearAllPaymentMethods = async () => {
    while (await this.paymentSelectedItem.count()) {
      await this.paymentSelectedItem
        .first()
        .locator(".ant-select-selection-item-remove")
        .click();
    }
  };

  selectMethods = async (methods: ICourseAdvanceInfo["paymentMethods"]) => {
    await this.clearAllPaymentMethods();

    await this.paymentMethodSelector.click();
    await this.paymentMethodList.waitFor({
      state: "visible",
    });

    if (!Array.isArray(methods)) {
      const methodLocator = this.paymentMethodListItem.getByText(methods);
      await methodLocator.click();
    } else {
      const allExistingMethods =
        await this.paymentMethodListItem.allInnerTexts();

      /**
       * {a, b, c, d}
       * {X, Y, Z, c, a}
       * ================
       * {X, Y, Z, c, a} - {a, b, c, d}
       * {X, Y, Z}
       * ================
       * {X, Y, Z, c, a} - {X, Y, Z}
       * {c, a}
       */
      const listedMethods = Array.from(
        new Set(methods).difference(
          new Set(methods).difference(new Set(allExistingMethods)),
        ),
      );

      for (const method of listedMethods) {
        const methodLocator = this.paymentMethodListItem.getByText(method);
        if (
          (await this.isPaymentSelected(method)) ||
          !(await methodLocator.count())
        )
          continue;

        await methodLocator.click();
      }
    }

    await this.paymentMethodSelectorInput.blur();
  };

  selectLevel = async (level: ICourseAdvanceInfo["level"]) => {
    if (!level) return await this.enableCourseLevel.uncheck();
    await this.enableCourseLevel.check();
    await this.courseLevelInput.first().waitFor({
      state: "visible",
    });
    await this.courseLevelInput
      .and(this.page.locator(`[value="${level?.toUpperCase()}"]`))
      .check();
  };
}
