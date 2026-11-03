import { Page } from "@playwright/test";
import { ICourseAdvanceInfo } from "@/types/courses.types";
import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";

export class DashboardCoursesAdvanceInfoPage extends DashboardCoursesSettingsBase {
  readonly url = (id: number) =>
    `dashboard/courses/${id}/setting/advance-info/`;

  readonly language = this.main.locator("input#course_language");
  readonly videoDuration = this.main.locator("input#video_duration");
  readonly paymentMethodWrapper = this.main
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

  readonly enableCourseLevel = this.main.locator("#enable_course_level");
  readonly courseLevelInput = this.main.locator("#course_level input");

  readonly addCourseAssuranceCheck = this.main.locator(
    "#enable_money_back_guarantee",
  );
  readonly courseAssuranceInput = this.main.locator("input#guarantee_text");

  readonly courseIncludesSection = this.main
    .locator("._crtSnglCrse_frm1_itm")
    .filter({
      hasText: "Course Includes",
    });
  readonly showQuizzesNumberCountCheck =
    this.courseIncludesSection.locator("#hide_quizzes");
  readonly showAssignmentsNumberCountCheck =
    this.courseIncludesSection.locator("#hide_assignments");

  readonly enableCourseIncludesCheck = this.courseIncludesSection.locator(
    "#enable_course_includes",
  );
  readonly courseIncludesDeleteBtns = this.courseIncludesSection
    .getByRole("button")
    .filter({
      has: this.page.getByRole("img", {
        name: "delete",
      }),
    });
  readonly courseIncludesPluseBtns = this.courseIncludesSection
    .getByRole("button")
    .filter({
      has: this.page.getByRole("img", {
        name: "plus",
      }),
    });
  readonly customIncludesInputs = this.courseIncludesSection.locator(
    'input[id^="course_includes_list_"]',
  );

  readonly learningOutcomeSection = this.main
    .locator("._crtSnglCrse_frm1_itm")
    .filter({
      hasText: "Add learning outcomes",
    });
  readonly learningOutcomeCheck = this.learningOutcomeSection.locator(
    "#enable_learning_module",
  );
  readonly learningOutcomeDeleteBtns = this.learningOutcomeSection
    .getByRole("button")
    .filter({
      has: this.page.getByRole("img", {
        name: "delete",
      }),
    });
  readonly learningOutcomePluseBtns = this.learningOutcomeSection
    .getByRole("button")
    .filter({
      has: this.page.getByRole("img", {
        name: "plus",
      }),
    });
  readonly learningOutcomeInputs = this.learningOutcomeSection.locator(
    'input[id^="course_learning_list_"]',
  );

  readonly faqSection = this.main.locator("._crtSnglCrse_frm1_itm").filter({
    hasText: "Add FAQ",
  });
  readonly faqCheck = this.faqSection.locator("#enable_faq");
  readonly faqDeleteBtns = this.faqSection.getByRole("button").filter({
    has: this.page.getByRole("img", {
      name: "delete",
    }),
  });
  readonly faqPluseBtns = this.faqSection.getByRole("button").filter({
    has: this.page.getByRole("img", {
      name: "plus",
    }),
  });
  readonly faqQuestionInputs = this.faqSection.getByPlaceholder("Question");
  readonly faqAnsInputs = this.faqSection.getByPlaceholder("Answer");

  readonly enableCourseReviewCheck = this.main.locator("#enable_course_review");
  readonly enableGiftingCheck = this.main.locator("#enable_gift");

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

  addCourseAssurance = async (assurance: ICourseAdvanceInfo["assurance"]) => {
    if (assurance === undefined) return;

    if (!assurance.check) return await this.addCourseAssuranceCheck.uncheck();

    await this.addCourseAssuranceCheck.check();
    await this.courseAssuranceInput.first().waitFor({
      state: "visible",
    });
    await this.courseAssuranceInput.fill(assurance.value);
  };

  checkShowQuizzesNumberCount = async (
    check: ICourseAdvanceInfo["includes"]["showQuizzesNumberCount"],
  ) => {
    if (check === undefined) return;
    return check
      ? this.showAssignmentsNumberCountCheck.check()
      : this.showAssignmentsNumberCountCheck.uncheck();
  };

  checkShowAssignmentsNumberCount = async (
    check: ICourseAdvanceInfo["includes"]["showAssignmentsNumberCount"],
  ) => {
    if (check === undefined) return;
    return check
      ? this.showAssignmentsNumberCountCheck.check()
      : this.showAssignmentsNumberCountCheck.uncheck();
  };

  clearCustomCourseIncludes = async () => {
    while (await this.courseIncludesDeleteBtns.count()) {
      await this.courseIncludesDeleteBtns.first().click();
    }
  };

  checkEnableCourseIncludes = async (
    payload: ICourseAdvanceInfo["includes"]["addCustomCourseIncludes"],
  ) => {
    if (payload === undefined) return;

    payload.check
      ? await this.enableCourseIncludesCheck.check()
      : await this.enableCourseIncludesCheck.uncheck();

    if (!payload.check) return;
    await this.clearCustomCourseIncludes();
  };

  addCourseIncludesFields = async (
    payload: ICourseAdvanceInfo["includes"]["addCustomCourseIncludes"],
  ) => {
    if (!payload?.check) return;

    for (const [index, field] of payload.fields.entries()) {
      await this.customIncludesInputs.last().fill(field);
      if (index === payload.fields.length - 1) continue;
      await this.courseIncludesPluseBtns.last().click();
    }
  };

  addCourseIncludes = async (
    payload: ICourseAdvanceInfo["includes"]["addCustomCourseIncludes"],
  ) => {
    await this.checkEnableCourseIncludes(payload);
    await this.addCourseIncludesFields(payload);
  };

  checkEnableLearningOutcome = async (
    payload: ICourseAdvanceInfo["learningOutcomes"],
  ) => {
    if (payload === undefined) return;

    payload.check
      ? await this.learningOutcomeCheck.check()
      : await this.learningOutcomeCheck.uncheck();

    if (!payload.check) return;
    await this.clearCustomCourseIncludes();
  };

  clearLearningOutcome = async () => {
    while (await this.learningOutcomeDeleteBtns.count()) {
      await this.learningOutcomeDeleteBtns.first().click();
    }
  };

  addLearningOutcomeFields = async (
    payload: ICourseAdvanceInfo["learningOutcomes"],
  ) => {
    if (!payload?.check) return;

    for (const [index, field] of payload.fields.entries()) {
      await this.learningOutcomeInputs.last().fill(field);
      if (index === payload.fields.length - 1) continue;
      await this.learningOutcomePluseBtns.last().click();
    }
  };

  addLearningOutcome = async (
    payload: ICourseAdvanceInfo["learningOutcomes"],
  ) => {
    await this.checkEnableLearningOutcome(payload);
    await this.addLearningOutcomeFields(payload);
  };

  clearFaq = async () => {
    while (await this.faqDeleteBtns.count()) {
      await this.faqDeleteBtns.first().click();
    }
  };

  checkFaq = async (payload: ICourseAdvanceInfo["faq"]) => {
    if (payload === undefined) return;

    payload.check ? await this.faqCheck.check() : await this.faqCheck.uncheck();

    if (!payload.check) return;
    await this.clearFaq();
  };

  addFaqFields = async (payload: ICourseAdvanceInfo["faq"]) => {
    if (!payload?.check) return;

    for (const [index, field] of payload.fields.entries()) {
      await this.faqQuestionInputs.last().fill(field.question);
      await this.faqAnsInputs.last().fill(field.answer);
      if (index === payload.fields.length - 1) continue;
      await this.faqPluseBtns.last().click();
    }
  };

  addFaq = async (payload: ICourseAdvanceInfo["faq"]) => {
    await this.checkFaq(payload);
    await this.addFaqFields(payload);
  };

  checkEnableCourseReview = async (
    check: ICourseAdvanceInfo["enableCourseReview"],
  ) => {
    if (check === undefined) return;
    return check
      ? this.enableCourseReviewCheck.check()
      : this.enableCourseReviewCheck.uncheck();
  };

  checkEnableGifting = async (check: ICourseAdvanceInfo["enableGifting"]) => {
    if (check === undefined) return;
    return check
      ? this.enableGiftingCheck.check()
      : this.enableGiftingCheck.uncheck();
  };
}
