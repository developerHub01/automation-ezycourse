import { Page } from "@playwright/test";
import { ICourseAdvanceInfo } from "@/types/courses.types";
import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";

export class DashboardCoursesAdvanceInfoPage extends DashboardCoursesSettingsBase {
  readonly url = (id: number) =>
    `dashboard/courses/${id}/setting/advance-info/`;

  /****
   * Basic course information
   */
  readonly language = this.main.locator("input#course_language");
  readonly videoDuration = this.main.locator("input#video_duration");

  /****
   * Payment methods
   */
  readonly paymentMethodWrapper = this.main
    .locator("._crtSnglCrse_frm1")
    .filter({
      has: this.page.getByText("Select payment methods"),
    });
  readonly paymentMethodSelector = this.paymentMethodWrapper.locator(
    ".ant-select-selector",
  );
  readonly paymentMethodSelectorInput = this.paymentMethodSelector.locator(
    'input[type="search"]',
  );
  readonly paymentSelectedItem = this.paymentMethodSelector.locator(
    ".ant-select-selection-item",
  );
  readonly paymentMethodList = this.page
    .locator(".rc-virtual-list-holder-inner")
    .first();
  readonly paymentMethodListItem =
    this.paymentMethodList.locator(".ant-select-item");

  /****
   * Course level
   */
  readonly enableCourseLevel = this.main.locator("#enable_course_level");
  readonly courseLevelInput = this.main.locator("#course_level input");

  /****
   * Course assurance
   */
  readonly addCourseAssuranceCheck = this.main.locator(
    "#enable_money_back_guarantee",
  );
  readonly courseAssuranceInput = this.main.locator("input#guarantee_text");

  /****
   * Course includes
   */
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

  /****
   * Learning outcomes
   */
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

  /****
   * FAQ
   */
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

  /****
   * Course review and gifting
   */
  readonly enableCourseReviewCheck = this.main.locator("#enable_course_review");
  readonly enableGiftingCheck = this.main.locator("#enable_gift");

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the advance information settings of a course.
   */
  goto = async (id: number) => await this.page.goto(this.url(id));

  /**
   * Check whether a payment method is currently selected.
   */
  isPaymentSelected = async (title: string) =>
    Boolean(
      await this.paymentMethodListItem
        .getByText(title)
        .and(this.page.locator('[aria-selected="true"]'))
        .count(),
    );

  /**
   * Update only the settings provided in the payload.
   * Settings omitted from the payload remain unchanged.
   */
  fill = async (payload: Partial<ICourseAdvanceInfo>) => {
    if (payload.language) await this.language.fill(payload.language);

    if (payload.duration !== undefined)
      await this.videoDuration.fill(String(payload.duration));

    if (payload.paymentMethods)
      await this.selectMethods(payload.paymentMethods);

    if (payload.level) await this.selectLevel(payload.level);

    if (payload.assurance) await this.addCourseAssurance(payload.assurance);

    if (payload.includes) {
      await this.checkShowQuizzesNumberCount(
        payload.includes.showQuizzesNumberCount,
      );
      await this.checkShowAssignmentsNumberCount(
        payload.includes.showAssignmentsNumberCount,
      );

      if (payload.includes.addCustomCourseIncludes)
        await this.addCourseIncludes(payload.includes.addCustomCourseIncludes);
    }

    if (payload.learningOutcomes)
      await this.addLearningOutcome(payload.learningOutcomes);

    if (payload.faq) await this.addFaq(payload.faq);

    if (payload.enableCourseReview !== undefined)
      await this.checkEnableCourseReview(payload.enableCourseReview);

    if (payload.enableGifting !== undefined)
      await this.checkEnableGifting(payload.enableGifting);
  };

  /**
   * Remove all currently selected payment methods.
   */
  clearAllPaymentMethods = async () => {
    while (await this.paymentSelectedItem.count()) {
      await this.paymentSelectedItem
        .first()
        .locator(".ant-select-selection-item-remove")
        .click();
    }
  };

  /**
   * Select the requested payment methods after clearing existing selections.
   * Ignore requested methods that are not available in the dropdown.
   */
  selectMethods = async (methods: ICourseAdvanceInfo["paymentMethods"]) => {
    await this.clearAllPaymentMethods();

    await this.paymentMethodSelector.click();
    await this.paymentMethodList.waitFor({
      state: "visible",
    });

    if (!Array.isArray(methods)) {
      await this.paymentMethodListItem.getByText(methods).click();
    } else {
      const allExistingMethods =
        await this.paymentMethodListItem.allInnerTexts();

      const listedMethods = Array.from(
        new Set(methods).intersection(new Set(allExistingMethods)),
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

  /**
   * Enable or disable course level and select the requested level.
   */
  selectLevel = async (level: ICourseAdvanceInfo["level"]) => {
    if (!level) return await this.enableCourseLevel.uncheck();

    await this.enableCourseLevel.check();
    await this.courseLevelInput.first().waitFor({
      state: "visible",
    });
    await this.courseLevelInput
      .and(this.page.locator(`[value="${level.toUpperCase()}"]`))
      .check();
  };

  /**
   * Enable or disable course assurance and update its description.
   */
  addCourseAssurance = async (assurance: ICourseAdvanceInfo["assurance"]) => {
    if (!assurance) return;

    if (!assurance.check) return await this.addCourseAssuranceCheck.uncheck();

    await this.addCourseAssuranceCheck.check();
    await this.courseAssuranceInput.waitFor({
      state: "visible",
    });
    await this.courseAssuranceInput.fill(assurance.value);
  };

  /**
   * Show or hide the number of quizzes displayed in course information.
   */
  checkShowQuizzesNumberCount = async (
    check: ICourseAdvanceInfo["includes"]["showQuizzesNumberCount"] | undefined,
  ) => {
    if (check === undefined) return;

    return check
      ? this.showQuizzesNumberCountCheck.check()
      : this.showQuizzesNumberCountCheck.uncheck();
  };

  /**
   * Show or hide the number of assignments displayed in course information.
   */
  checkShowAssignmentsNumberCount = async (
    check:
      ICourseAdvanceInfo["includes"]["showAssignmentsNumberCount"] | undefined,
  ) => {
    if (check === undefined) return;

    return check
      ? this.showAssignmentsNumberCountCheck.check()
      : this.showAssignmentsNumberCountCheck.uncheck();
  };

  /**
   * Remove all existing custom course include fields.
   */
  clearCustomCourseIncludes = async () => {
    while (await this.courseIncludesDeleteBtns.count()) {
      await this.courseIncludesDeleteBtns.first().click();
    }
  };

  /**
   * Enable or disable custom course includes.
   * Clear existing fields when enabling so the supplied fields replace them.
   */
  checkEnableCourseIncludes = async (
    payload: ICourseAdvanceInfo["includes"]["addCustomCourseIncludes"],
  ) => {
    if (!payload) return;

    payload.check
      ? await this.enableCourseIncludesCheck.check()
      : await this.enableCourseIncludesCheck.uncheck();

    if (!payload.check) return;

    await this.clearCustomCourseIncludes();
  };

  /**
   * Add the supplied custom course include fields.
   */
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

  /**
   * Update custom course includes.
   */
  addCourseIncludes = async (
    payload: ICourseAdvanceInfo["includes"]["addCustomCourseIncludes"],
  ) => {
    if (!payload) return;

    await this.checkEnableCourseIncludes(payload);
    await this.addCourseIncludesFields(payload);
  };

  /**
   * Remove all existing learning outcome fields.
   */
  clearLearningOutcome = async () => {
    while (await this.learningOutcomeDeleteBtns.count()) {
      await this.learningOutcomeDeleteBtns.first().click();
    }
  };

  /**
   * Enable or disable learning outcomes.
   * Clear existing fields when enabling so the supplied fields replace them.
   */
  checkEnableLearningOutcome = async (
    payload: ICourseAdvanceInfo["learningOutcomes"],
  ) => {
    if (!payload) return;

    payload.check
      ? await this.learningOutcomeCheck.check()
      : await this.learningOutcomeCheck.uncheck();

    if (!payload.check) return;

    await this.clearLearningOutcome();
  };

  /**
   * Add the supplied learning outcome fields.
   */
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

  /**
   * Update learning outcomes.
   */
  addLearningOutcome = async (
    payload: ICourseAdvanceInfo["learningOutcomes"],
  ) => {
    if (!payload) return;

    await this.checkEnableLearningOutcome(payload);
    await this.addLearningOutcomeFields(payload);
  };

  /**
   * Remove all existing FAQ entries.
   */
  clearFaq = async () => {
    while (await this.faqDeleteBtns.count()) {
      await this.faqDeleteBtns.first().click();
    }
  };

  /**
   * Enable or disable FAQ.
   * Clear existing entries when enabling so the supplied entries replace them.
   */
  checkFaq = async (payload: ICourseAdvanceInfo["faq"]) => {
    if (!payload) return;

    payload.check ? await this.faqCheck.check() : await this.faqCheck.uncheck();

    if (!payload.check) return;

    await this.clearFaq();
  };

  /**
   * Add the supplied FAQ questions and answers.
   */
  addFaqFields = async (payload: ICourseAdvanceInfo["faq"]) => {
    if (!payload?.check) return;

    for (const [index, field] of payload.fields.entries()) {
      await this.faqQuestionInputs.last().fill(field.question);
      await this.faqAnsInputs.last().fill(field.answer);

      if (index === payload.fields.length - 1) continue;

      await this.faqPluseBtns.last().click();
    }
  };

  /**
   * Update FAQ entries.
   */
  addFaq = async (payload: ICourseAdvanceInfo["faq"]) => {
    if (!payload) return;

    await this.checkFaq(payload);
    await this.addFaqFields(payload);
  };

  /**
   * Enable or disable course reviews.
   */
  checkEnableCourseReview = async (
    check: ICourseAdvanceInfo["enableCourseReview"] | undefined,
  ) => {
    if (check === undefined) return;

    return check
      ? this.enableCourseReviewCheck.check()
      : this.enableCourseReviewCheck.uncheck();
  };

  /**
   * Enable or disable course gifting.
   */
  checkEnableGifting = async (
    check: ICourseAdvanceInfo["enableGifting"] | undefined,
  ) => {
    if (check === undefined) return;

    return check
      ? this.enableGiftingCheck.check()
      : this.enableGiftingCheck.uncheck();
  };
}
