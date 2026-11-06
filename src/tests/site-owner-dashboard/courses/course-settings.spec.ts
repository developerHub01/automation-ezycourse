import { expect, test } from "@/fixtures";
import { ICourseLandingPage } from "@/types/courses.types";

const courseId = 50452;

const sidebarItemList: Array<{
  name: string;
  title: string | null;
}> = [
  {
    name: "Basic information",
    title: "Basic Information",
  },
  {
    name: "Advanced information",
    title: "Advance Information",
  },
  {
    name: "Landing page",
    title: "Landing page setting",
  },
  {
    name: "After checkout page",
    title: "After checkout page setting",
  },
  {
    name: "Certificate",
    title: "Certificate settings",
  },
  {
    name: "Course accessibility",
    title: "Course accessibility setting",
  },
  {
    name: "Motivation popup",
    title: "Motivation popup setting",
  },
  {
    name: "Grade settings",
    title: null,
  },
  {
    name: "Redirect to checkout page",
    title: "Redirect to checkout page setting",
  },
];

test.describe("Course settings", () => {
  test.beforeEach(async ({ dashboardCoursesSettingsBase }) => {
    await dashboardCoursesSettingsBase.goto(courseId);
    await dashboardCoursesSettingsBase.mainHeading.waitFor({
      state: "visible",
    });
  });

  /****
   * Advanced information settings
   */
  test.describe("Advanced information", () => {
    test.beforeEach(async ({ dashboardCoursesAdvanceInfoPage }) => {
      await dashboardCoursesAdvanceInfoPage.gotoTab(sidebarItemList[1]);
    });

    test.describe("Functional", () => {
      /**
       * Verify that basic advance information fields can be updated.
       */
      test("Update language and video duration", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.fill({
          language: "English",
          duration: 120,
        });

        await advanceinfoPage.saveBtn.click();

        await expect(advanceinfoPage.language).toHaveValue("English");
        await expect(advanceinfoPage.videoDuration).toHaveValue("120");
      });

      /**
       * Verify that selected payment methods can be updated.
       */
      test("Update payment methods", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.fill({
          paymentMethods: ["fastspring", "manual", "mercadopago"],
        });

        await expect(advanceinfoPage.paymentSelectedItem).not.toHaveCount(0);
      });

      /**
       * Verify that course level can be enabled and a level can be selected.
       */
      test("Enable course level and select a level", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.selectLevel("advanced");

        await expect(advanceinfoPage.enableCourseLevel).toBeChecked();
        await expect(
          advanceinfoPage.courseLevelInput.and(
            advanceinfoPage.page.locator('[value="ADVANCED"]'),
          ),
        ).toBeChecked();
      });

      /**
       * Verify that course level can be disabled.
       */
      test("Disable course level", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.selectLevel(undefined);

        await expect(advanceinfoPage.enableCourseLevel).not.toBeChecked();
      });

      /**
       * Verify that course assurance can be enabled and its text updated.
       */
      test("Enable course assurance and update its text", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.addCourseAssurance({
          check: true,
          value: "30-day money-back guarantee",
        });

        await expect(advanceinfoPage.addCourseAssuranceCheck).toBeChecked();
        await expect(advanceinfoPage.courseAssuranceInput).toHaveValue(
          "30-day money-back guarantee",
        );
      });

      /**
       * Verify that course assurance can be disabled.
       */
      test("Disable course assurance", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.addCourseAssurance({
          check: false,
        });

        await expect(advanceinfoPage.addCourseAssuranceCheck).not.toBeChecked();
      });

      /**
       * Verify that quiz and assignment counts can be toggled independently.
       */
      test("Update quiz and assignment count visibility", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.fill({
          includes: {
            showQuizzesNumberCount: false,
            showAssignmentsNumberCount: true,
          },
        });

        await expect(
          advanceinfoPage.showQuizzesNumberCountCheck,
        ).not.toBeChecked();
        await expect(
          advanceinfoPage.showAssignmentsNumberCountCheck,
        ).toBeChecked();
      });

      /**
       * Verify that custom course includes can be added.
       */
      test("Add custom course includes", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.addCourseIncludes({
          check: true,
          fields: ["Course material", "Lifetime access", "Certificate"],
        });

        await expect(advanceinfoPage.enableCourseIncludesCheck).toBeChecked();
        await expect(advanceinfoPage.customIncludesInputs).toHaveCount(3);
        await expect(advanceinfoPage.customIncludesInputs.nth(0)).toHaveValue(
          "Course material",
        );
        await expect(advanceinfoPage.customIncludesInputs.nth(1)).toHaveValue(
          "Lifetime access",
        );
        await expect(advanceinfoPage.customIncludesInputs.nth(2)).toHaveValue(
          "Certificate",
        );
      });

      /**
       * Verify that custom course includes can be disabled.
       */
      test("Disable custom course includes", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.addCourseIncludes({
          check: false,
        });

        await expect(
          advanceinfoPage.enableCourseIncludesCheck,
        ).not.toBeChecked();
      });

      /**
       * Verify that existing custom course includes are replaced when updated.
       */
      test("Replace existing custom course includes", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.addCourseIncludes({
          check: true,
          fields: ["Updated include 1", "Updated include 2"],
        });

        await expect(advanceinfoPage.customIncludesInputs).toHaveCount(2);
        await expect(advanceinfoPage.customIncludesInputs.nth(0)).toHaveValue(
          "Updated include 1",
        );
        await expect(advanceinfoPage.customIncludesInputs.nth(1)).toHaveValue(
          "Updated include 2",
        );
      });

      /**
       * Verify that learning outcomes can be added.
       */
      test("Add learning outcomes", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.addLearningOutcome({
          check: true,
          fields: [
            "Understand the fundamentals",
            "Apply the concepts",
            "Build practical projects",
          ],
        });

        await expect(advanceinfoPage.learningOutcomeCheck).toBeChecked();
        await expect(advanceinfoPage.learningOutcomeInputs).toHaveCount(3);
        await expect(advanceinfoPage.learningOutcomeInputs.nth(0)).toHaveValue(
          "Understand the fundamentals",
        );
        await expect(advanceinfoPage.learningOutcomeInputs.nth(1)).toHaveValue(
          "Apply the concepts",
        );
        await expect(advanceinfoPage.learningOutcomeInputs.nth(2)).toHaveValue(
          "Build practical projects",
        );
      });

      /**
       * Verify that learning outcomes can be disabled.
       */
      test("Disable learning outcomes", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.addLearningOutcome({
          check: false,
        });

        await expect(advanceinfoPage.learningOutcomeCheck).not.toBeChecked();
      });

      /**
       * Verify that existing learning outcomes are replaced when updated.
       */
      test("Replace existing learning outcomes", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.addLearningOutcome({
          check: true,
          fields: ["Updated outcome 1", "Updated outcome 2"],
        });

        await expect(advanceinfoPage.learningOutcomeInputs).toHaveCount(2);
        await expect(advanceinfoPage.learningOutcomeInputs.nth(0)).toHaveValue(
          "Updated outcome 1",
        );
        await expect(advanceinfoPage.learningOutcomeInputs.nth(1)).toHaveValue(
          "Updated outcome 2",
        );
      });

      /**
       * Verify that FAQ questions and answers can be added.
       */
      test("Add FAQ entries", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.addFaq({
          check: true,
          fields: [
            {
              question: "What is included?",
              answer: "All course materials are included.",
            },
            {
              question: "Will I get a certificate?",
              answer: "Yes, a certificate is provided.",
            },
            {
              question: "Can I access the course later?",
              answer: "Yes, access is available for a lifetime.",
            },
          ],
        });

        await expect(advanceinfoPage.faqCheck).toBeChecked();
        await expect(advanceinfoPage.faqQuestionInputs).toHaveCount(3);
        await expect(advanceinfoPage.faqAnsInputs).toHaveCount(3);

        await expect(advanceinfoPage.faqQuestionInputs.nth(0)).toHaveValue(
          "What is included?",
        );
        await expect(advanceinfoPage.faqAnsInputs.nth(0)).toHaveValue(
          "All course materials are included.",
        );

        await expect(advanceinfoPage.faqQuestionInputs.nth(1)).toHaveValue(
          "Will I get a certificate?",
        );
        await expect(advanceinfoPage.faqAnsInputs.nth(1)).toHaveValue(
          "Yes, a certificate is provided.",
        );

        await expect(advanceinfoPage.faqQuestionInputs.nth(2)).toHaveValue(
          "Can I access the course later?",
        );
        await expect(advanceinfoPage.faqAnsInputs.nth(2)).toHaveValue(
          "Yes, access is available for a lifetime.",
        );
      });

      /**
       * Verify that FAQ can be disabled.
       */
      test("Disable FAQ", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.addFaq({
          check: false,
        });

        await expect(advanceinfoPage.faqCheck).not.toBeChecked();
      });

      /**
       * Verify that existing FAQ entries are replaced when updated.
       */
      test("Replace existing FAQ entries", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.addFaq({
          check: true,
          fields: [
            {
              question: "Updated question 1",
              answer: "Updated answer 1",
            },
            {
              question: "Updated question 2",
              answer: "Updated answer 2",
            },
          ],
        });

        await expect(advanceinfoPage.faqQuestionInputs).toHaveCount(2);
        await expect(advanceinfoPage.faqAnsInputs).toHaveCount(2);

        await expect(advanceinfoPage.faqQuestionInputs.nth(0)).toHaveValue(
          "Updated question 1",
        );
        await expect(advanceinfoPage.faqAnsInputs.nth(0)).toHaveValue(
          "Updated answer 1",
        );
        await expect(advanceinfoPage.faqQuestionInputs.nth(1)).toHaveValue(
          "Updated question 2",
        );
        await expect(advanceinfoPage.faqAnsInputs.nth(1)).toHaveValue(
          "Updated answer 2",
        );
      });

      /**
       * Verify that course reviews can be enabled and disabled.
       */
      test("Update course review setting", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.fill({
          enableCourseReview: true,
        });

        await expect(advanceinfoPage.enableCourseReviewCheck).toBeChecked();

        await advanceinfoPage.fill({
          enableCourseReview: false,
        });

        await expect(advanceinfoPage.enableCourseReviewCheck).not.toBeChecked();
      });

      /**
       * Verify that course gifting can be enabled and disabled.
       */
      test("Update course gifting setting", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.fill({
          enableGifting: true,
        });

        await expect(advanceinfoPage.enableGiftingCheck).toBeChecked();

        await advanceinfoPage.fill({
          enableGifting: false,
        });

        await expect(advanceinfoPage.enableGiftingCheck).not.toBeChecked();
      });

      /**
       * Verify that updating one setting does not modify other settings.
       */
      test("Update a single setting without changing other settings", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        const previousLanguage = await advanceinfoPage.language.inputValue();
        const previousDuration =
          await advanceinfoPage.videoDuration.inputValue();
        const previousReviewState =
          await advanceinfoPage.enableCourseReviewCheck.isChecked();
        const previousGiftingState =
          await advanceinfoPage.enableGiftingCheck.isChecked();

        await advanceinfoPage.fill({
          enableGifting: !previousGiftingState,
        });

        await expect(advanceinfoPage.language).toHaveValue(previousLanguage);
        await expect(advanceinfoPage.videoDuration).toHaveValue(
          previousDuration,
        );
        await expect(advanceinfoPage.enableCourseReviewCheck).toHaveJSProperty(
          "checked",
          previousReviewState,
        );
        await expect(advanceinfoPage.enableGiftingCheck).toHaveJSProperty(
          "checked",
          !previousGiftingState,
        );
      });

      /**
       * Verify that multiple advance information settings can be updated together.
       */
      test("Update multiple advance information settings", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.fill({
          language: "English",
          duration: 90,
          assurance: {
            check: true,
            value: "30-day money-back guarantee",
          },
          includes: {
            showQuizzesNumberCount: true,
            showAssignmentsNumberCount: false,
            addCustomCourseIncludes: {
              check: true,
              fields: ["Course resources", "Certificate"],
            },
          },
          enableCourseReview: true,
          enableGifting: true,
        });

        await expect(advanceinfoPage.language).toHaveValue("English");
        await expect(advanceinfoPage.videoDuration).toHaveValue("90");
        await expect(advanceinfoPage.addCourseAssuranceCheck).toBeChecked();
        await expect(advanceinfoPage.courseAssuranceInput).toHaveValue(
          "30-day money-back guarantee",
        );
        await expect(advanceinfoPage.showQuizzesNumberCountCheck).toBeChecked();
        await expect(
          advanceinfoPage.showAssignmentsNumberCountCheck,
        ).not.toBeChecked();
        await expect(advanceinfoPage.customIncludesInputs).toHaveCount(2);
        await expect(advanceinfoPage.enableCourseReviewCheck).toBeChecked();
        await expect(advanceinfoPage.enableGiftingCheck).toBeChecked();
      });
    });

    test.describe("UI", () => {
      /**
       * Verify that the advanced information settings page is displayed.
       */
      test("Display advanced information settings", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await expect(advanceinfoPage.mainHeading).toContainText(
          "Advance Information",
          {
            ignoreCase: true,
          },
        );

        await expect(advanceinfoPage.language).toBeVisible();
        await expect(advanceinfoPage.videoDuration).toBeVisible();
        await expect(advanceinfoPage.paymentMethodSelector).toBeVisible();
        await expect(advanceinfoPage.enableCourseLevel).toBeVisible();
        await expect(advanceinfoPage.addCourseAssuranceCheck).toBeVisible();
        await expect(advanceinfoPage.enableCourseIncludesCheck).toBeVisible();
        await expect(advanceinfoPage.learningOutcomeCheck).toBeVisible();
        await expect(advanceinfoPage.faqCheck).toBeVisible();
        await expect(advanceinfoPage.enableCourseReviewCheck).toBeVisible();
        await expect(advanceinfoPage.enableGiftingCheck).toBeVisible();
      });

      /**
       * Verify that payment method dropdown opens and displays options.
       */
      test("Payment method dropdown interaction", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.paymentMethodSelector.click();

        await expect(advanceinfoPage.paymentMethodList).toBeVisible();
        await expect(
          advanceinfoPage.paymentMethodListItem.first(),
        ).toBeVisible();
      });

      /**
       * Verify that the course level input becomes available when enabled.
       */
      test("Course level input visibility", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.enableCourseLevel.check();

        await expect(advanceinfoPage.courseLevelInput.first()).toBeVisible();
      });

      /**
       * Verify that the assurance text input becomes available when enabled.
       */
      test("Course assurance input visibility", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.addCourseAssuranceCheck.check();

        await expect(advanceinfoPage.courseAssuranceInput).toBeVisible();
      });

      /**
       * Verify that custom course include inputs become available when enabled.
       */
      test("Custom course includes input visibility", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.enableCourseIncludesCheck.check();

        await expect(
          advanceinfoPage.customIncludesInputs.first(),
        ).toBeVisible();
      });

      /**
       * Verify that learning outcome inputs become available when enabled.
       */
      test("Learning outcome input visibility", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.learningOutcomeCheck.check();

        await expect(
          advanceinfoPage.learningOutcomeInputs.first(),
        ).toBeVisible();
      });

      /**
       * Verify that FAQ inputs become available when enabled.
       */
      test("FAQ input visibility", async ({
        dashboardCoursesAdvanceInfoPage: advanceinfoPage,
      }) => {
        await advanceinfoPage.faqCheck.check();

        await expect(advanceinfoPage.faqQuestionInputs.first()).toBeVisible();
        await expect(advanceinfoPage.faqAnsInputs.first()).toBeVisible();
      });
    });
  });

  /****
   * Landing page settings
   */
  test.describe("Landing Page", () => {
    test.beforeEach(
      async ({ dashboardCoursesLandingPagePage: landingPage }) => {
        await landingPage.gotoTab(sidebarItemList[2]);
      },
    );

    /****
     * Functional
     */
    test.describe("Functional", () => {
      test("Update course details landing page", async ({
        dashboardCoursesLandingPagePage: landingPage,
      }) => {
        const payload: Partial<ICourseLandingPage> = {
          preview: 1,
        };

        await landingPage.fill(payload);

        await expect(
          landingPage.landingPageCheck.nth(payload.preview!),
        ).toBeChecked();
      });

      test("Update enrollment count visibility", async ({
        dashboardCoursesLandingPagePage: landingPage,
      }) => {
        await landingPage.fill({
          hideEnrollmentCount: true,
        });
        await expect(landingPage.enrollmentCountHiddenCheck).toBeChecked();
      });

      test("Update custom landing page", async ({
        dashboardCoursesLandingPagePage: landingPage,
      }) => {
        await landingPage.fill({
          customLandingPage: "Creator",
        });

        await expect(landingPage.customLandingPageResetButton).toBeVisible();
      });

      test("Reset custom landing page to default", async ({
        dashboardCoursesLandingPagePage: landingPage,
      }) => {
        const payload: Partial<ICourseLandingPage> = {
          customLandingPage: null,
        };

        await landingPage.fill(payload);

        await expect(landingPage.customLandingPageChooseButton).toBeVisible();
      });

      test("Update all landing page settings together", async ({
        dashboardCoursesLandingPagePage: landingPage,
      }) => {
        const payload: Partial<ICourseLandingPage> = {
          preview: 0,
          hideEnrollmentCount: true,
          customLandingPage: null,
        };

        await landingPage.fill(payload);

        await expect(
          landingPage.landingPageCheck.nth(payload.preview!),
        ).toBeChecked();

        await expect(landingPage.enrollmentCountHiddenCheck).toBeChecked();

        await expect(landingPage.customLandingPageResetButton).toBeVisible();
      });
    });

    /****
     * UI
     */
    test.describe("UI", () => {
      test("Verify course details landing page options", async ({
        dashboardCoursesLandingPagePage: landingPage,
      }) => {
        await expect(landingPage.detailsPageForm).toBeVisible();

        await expect(landingPage.landingPageLabels.first()).toBeVisible();

        await expect(landingPage.landingPageCheck.first()).toBeVisible();

        await expect(landingPage.landingPagePreview.first()).toBeVisible();

        await expect(landingPage.detailsPageFormUpdateBtn).toBeVisible();
      });

      test("Verify landing page preview dialog", async ({
        dashboardCoursesLandingPagePage: landingPage,
      }) => {
        await landingPage.previewLandigPage();

        await expect(landingPage.landingPagePreviewDialogue).toBeVisible();

        await expect(landingPage.landingPagePreviewDialogueImg).toBeVisible();

        await expect(landingPage.landingPagePreviewDialogueClose).toBeVisible();

        await landingPage.closePreviewPage();
      });

      test("Verify enrollment count settings controls", async ({
        dashboardCoursesLandingPagePage: landingPage,
      }) => {
        await expect(landingPage.enrollmentCountForm).toBeVisible();

        await expect(landingPage.enrollmentCountHiddenCheck).toBeVisible();

        await expect(landingPage.enrollmentCountFormUpdateBtn).toBeVisible();
      });

      test("Verify custom landing page controls", async ({
        dashboardCoursesLandingPagePage: landingPage,
      }) => {
        if (await landingPage.customLandingPageChooseButton.isVisible()) {
          await expect(landingPage.customLandingPageChooseButton).toBeVisible();
        } else {
          await expect(landingPage.customLandingPageChangeButton).toBeVisible();
          await expect(landingPage.customLandingPageResetButton).toBeVisible();
        }
      });
    });
  });

  /****
   * After checkout page
   */
  test.describe("After checkout page", () => {
    test.beforeEach(
      async ({
        dashboardCoursesLandingPagePage: landingPage,
        dashboardCoursesAfterCheckoutPage: afterPage,
      }) => {
        await landingPage.gotoTab(sidebarItemList[3]);

        await afterPage.afterCheckoutPageLinkLoc.waitFor({
          state: "attached",
        });
      },
    );

    test.describe("Functional", () => {
      test("should switch between internal and external page types", async ({
        dashboardCoursesAfterCheckoutPage: afterPage,
      }) => {
        await afterPage.selectPageTypeTab("internal");

        await expect(afterPage.pageSelector).toBeVisible();

        await afterPage.selectPageTypeTab("external");

        await expect(afterPage.urlInput).toBeVisible();
      });

      test("should select and save an internal after-checkout page", async ({
        dashboardCoursesAfterCheckoutPage: afterPage,
      }) => {
        const pageIndexInList = 2;
        await afterPage.selectPageTypeTab("internal");

        await afterPage.pageSelector.click();

        await afterPage.pageListBox.waitFor({
          state: "visible",
        });

        const pageName = await afterPage.pageListItem
          .nth(pageIndexInList)
          .innerText();

        await afterPage.selectPage(pageName);

        expect(await afterPage.save()).toBeTruthy();

        await afterPage.page.reload();

        await afterPage.selectPageTypeTab("internal");

        await expect(afterPage.pageSelector).toContainText(pageName);
      });

      test("should save an external after-checkout URL", async ({
        dashboardCoursesAfterCheckoutPage: afterPage,
      }) => {
        const externalURL = "https://example.com/thank-you";

        await afterPage.fill({
          type: "external",
          nameOrURL: externalURL,
        });

        expect(await afterPage.save()).toBeTruthy();

        await afterPage.page.reload();

        await afterPage.selectPageTypeTab("external");

        await expect(afterPage.urlInput).toHaveValue(externalURL);
      });

      test("should reset the after-checkout page configuration to default", async ({
        dashboardCoursesAfterCheckoutPage: afterPage,
      }) => {
        await afterPage.fill({
          type: "external",
          nameOrURL: "https://example.com/thank-you",
        });

        expect(await afterPage.save()).toBeTruthy();

        await afterPage.resetPageToDefault();

        expect(await afterPage.save()).toBeTruthy();
      });
    });

    test.describe("UI", () => {
      test("should display both page type tabs", async ({
        dashboardCoursesAfterCheckoutPage: afterPage,
      }) => {
        await expect(afterPage.pageTypeTab).toHaveCount(2);
      });

      test("should display the internal page selector", async ({
        dashboardCoursesAfterCheckoutPage: afterPage,
      }) => {
        await afterPage.selectPageTypeTab("internal");

        await expect(afterPage.pageSelector).toBeVisible();
      });

      test("should display the external URL input", async ({
        dashboardCoursesAfterCheckoutPage: afterPage,
      }) => {
        await afterPage.selectPageTypeTab("external");

        await expect(afterPage.urlInput).toBeVisible();
      });

      test("should display the Save and Reset to default buttons", async ({
        dashboardCoursesAfterCheckoutPage: afterPage,
      }) => {
        await afterPage.selectPageTypeTab("internal");

        await expect(afterPage.saveBtn).toBeVisible();
        await expect(afterPage.resetToDefaultBtn).toBeVisible();
      });
    });
  });

  /****
   * Course settings sidebar navigation
   */
  test.describe("Sidebar navigation", () => {
    /**
     * Verify that each sidebar item navigates to its corresponding settings page.
     */
    test("Sidebar navigation working", async ({
      dashboardCoursesSettingsBase: settingPage,
    }) => {
      for (const tab of sidebarItemList) {
        await settingPage.gotoTab(tab);

        if (!tab.title) {
          await expect(settingPage.mainHeading).toHaveCount(0);
          continue;
        }

        await expect(settingPage.mainHeading).toContainText(tab.title, {
          ignoreCase: true,
        });
      }
    });
  });
});
