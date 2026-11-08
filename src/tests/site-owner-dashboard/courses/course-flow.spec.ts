import { expect, test } from "@/fixtures";
import { nanoid } from "nanoid";

/**
 * Course flow: login -> create course -> configure its settings -> delete
 * the course -> logout. Runs for a single course and for a bundle course.
 * Bundle courses have the same settings plus "Progressive mode", which a
 * single course does not have.
 *
 * Starts logged out on purpose, so login and logout are part of the journey
 * instead of relying on the saved site_owner storage state.
 */
test.use({ storageState: { cookies: [], origins: [] } });

const CERTIFICATE_NAME = "certificate2";
const CHECKOUT_REDIRECT_PAGE = "Marketplace";
const AFTER_CHECKOUT_URL = "https://example.com/thank-you";

const tabs = {
  basic: { name: "Basic information", title: "Basic Information" },
  advance: { name: "Advanced information", title: "Advance Information" },
  landing: { name: "Landing page", title: "Landing page setting" },
  afterCheckout: {
    name: "After checkout page",
    title: "After checkout page setting",
  },
  certificate: { name: "Certificate", title: "Certificate settings" },
  accessibility: {
    name: "Course accessibility",
    title: "Course accessibility setting",
  },
  motivation: { name: "Motivation popup", title: "Motivation popup setting" },
  grade: { name: "Grade settings", title: null },
  progressive: { name: "Progressive mode", title: "Enable Progressive mode" },
  redirect: {
    name: "Redirect to checkout page",
    title: "Redirect to checkout page setting",
  },
};

for (const kind of ["single", "bundle"] as const) {
  test(`Course flow (${kind}): create, configure, delete`, async ({
    loginPage,
    logoutPage,
    adminPage,
    dashboardCreateCoursesPage: createSinglePage,
    dashboardCreateBundleCoursesPage: createBundlePage,
    dashboardMyCoursesPage: myCoursesPage,
    dashboardCoursesSettingsBase: settings,
    dashboardCoursesBasicInfoPage: basicInfo,
    dashboardCoursesAdvanceInfoPage: advanceInfo,
    dashboardCoursesLandingPagePage: landing,
    dashboardCoursesAfterCheckoutPage: afterCheckout,
    dashboardCertificateSettingsPage: certificate,
    dashboardCoursesAccessibilitySettingPage: accessibility,
    dashboardCoursesMotivationPopupPage: motivation,
    dashboardCoursesGradeSettingsPage: grade,
    dashboardCoursesProgressiveModePage: progressive,
    dashboardCoursesRedirectToCheckoutPage: redirect,
  }) => {
    test.setTimeout(10 * 60 * 1000);

    const uid = nanoid(6);
    let courseId = 0;

    await test.step("Login", async () => {
      await loginPage.login({
        email: process.env.SITE_OWNER_EMAIL!,
        password: process.env.SITE_OWNER_PASSWORD!,
      });
      await adminPage.expectLoaded();
    });

    await test.step("Create course", async () => {
      const basicPayload = {
        name: `Flow ${kind} ${uid}`,
        shortDescription: `Flow short description ${uid}`,
        description: `Flow description ${uid}`,
        category: ["automation1", "automation2"],
        previewType: "video" as const,
        isHideEnrollmentCount: false,
      };

      if (kind === "single") {
        await createSinglePage.goto();
        await createSinglePage.formHeading.waitFor({ state: "visible" });
        await createSinglePage.fill({
          ...basicPayload,
          subCategory: ["sub1", "sub-cat1"],
          access: "private",
          motivationalPopup: true,
          publishingStatus: "draft",
          enableLimitEnrollment: true,
          enrollmentLimit: 99,
        });
        courseId = await createSinglePage.create();
      } else {
        await createBundlePage.goto();
        await createBundlePage.formHeading.waitFor({ state: "visible" });
        await createBundlePage.fill({
          ...basicPayload,
          publishingStatus: "draft",
        });
        courseId = await createBundlePage.create();
      }

      expect(courseId).toBeGreaterThan(0);
    });

    await test.step("Open course settings", async () => {
      await settings.open(courseId);
    });

    await test.step("Basic information", async () => {
      await settings.gotoTab(tabs.basic);

      await basicInfo.fill({
        name: `Flow ${kind} ${uid} (edited)`,
        shortDescription: `Edited short description ${uid}`,
        description: `Edited description ${uid}`,
        image: true,
        video: true,
      });
      expect(await basicInfo.save()).toBeTruthy();

      await basicInfo.reload();
      await expect(basicInfo.fields.name).toHaveValue(
        `Flow ${kind} ${uid} (edited)`,
      );
      await expect(basicInfo.fields.shortDescription).toHaveValue(
        `Edited short description ${uid}`,
      );
      /* The delete icon only shows while a file is selected */
      await expect(basicInfo.media.imageDeleteBtn).toBeVisible();
      await expect(basicInfo.media.videoDeleteBtn).toBeVisible();
    });

    await test.step("Advanced information", async () => {
      await settings.gotoTab(tabs.advance);

      await advanceInfo.fill({
        language: "English",
        duration: 90,
        level: "intermediate",
        assurance: { check: true, value: "30-day money-back guarantee" },
        includes: {
          showQuizzesNumberCount: true,
          showAssignmentsNumberCount: false,
          addCustomCourseIncludes: {
            check: true,
            fields: ["Course resources", "Certificate"],
          },
        },
        learningOutcomes: {
          check: true,
          fields: ["Build real projects", "Understand the fundamentals"],
        },
        faq: {
          check: true,
          fields: [
            { question: "Is there a refund?", answer: "Yes, within 30 days." },
            { question: "Is it self-paced?", answer: "Yes." },
          ],
        },
        enableCourseReview: true,
        enableGifting: true,
      });
      expect(await advanceInfo.save()).toBeTruthy();

      await advanceInfo.reload();
      await expect(advanceInfo.language).toHaveValue("English");
      await expect(advanceInfo.videoDuration).toHaveValue("90");
      await expect(advanceInfo.courseAssuranceInput).toHaveValue(
        "30-day money-back guarantee",
      );
      await expect(advanceInfo.customIncludesInputs).toHaveCount(2);
      await expect(advanceInfo.enableCourseReviewCheck).toBeChecked();
      await expect(advanceInfo.enableGiftingCheck).toBeChecked();
    });

    await test.step("Course accessibility", async () => {
      await settings.gotoTab(tabs.accessibility);

      /* Publishing first: landing page settings need a published course.
       * Presell is plan dependent, so it is intentionally left untouched. */
      await accessibility.fill({ access: "public", publish: "published" });
      expect(await accessibility.save()).toBeTruthy();
    });

    await test.step("Landing page", async () => {
      await settings.gotoTab(tabs.landing);

      await landing.fill({
        preview: 0,
        hideEnrollmentCount: true,
        customLandingPage: null,
      });

      await expect(landing.landingPageCheck.nth(0)).toBeChecked();
      await expect(landing.enrollmentCountHiddenCheck).toBeChecked();
    });

    await test.step("After checkout page", async () => {
      await settings.gotoTab(tabs.afterCheckout);

      await afterCheckout.fill({
        type: "external",
        nameOrURL: AFTER_CHECKOUT_URL,
      });
      expect(await afterCheckout.save()).toBeTruthy();

      await afterCheckout.reload();
      await afterCheckout.selectPageTypeTab("external");
      await expect(afterCheckout.urlInput).toHaveValue(AFTER_CHECKOUT_URL);
    });

    await test.step("Certificate", async () => {
      await settings.gotoTab(tabs.certificate);

      await certificate.fill({
        enable: true,
        certificate: CERTIFICATE_NAME,
        switchs: { allowWithoutCompletion: true, displayCompletionTime: true },
      });
      expect(await certificate.update()).toBeTruthy();
    });

    await test.step("Motivation popup", async () => {
      await settings.gotoTab(tabs.motivation);

      await motivation.fill({ enable: true });
      expect(await motivation.update()).toBeTruthy();

      await motivation.reload();
      await expect(motivation.enableMotivationalPopupCheck).toBeChecked();
    });

    await test.step("Grade settings", async () => {
      await settings.gotoTab(tabs.grade);

      await grade.fill({
        enable: true,
        thresholds: [
          { max: 49, grade: "F" },
          { max: 79, grade: "B" },
          { max: 100, grade: "A" },
        ],
      });
      expect(await grade.save()).toBeTruthy();

      await grade.reload();
      await expect(grade.enableGradingCheck).toBeChecked();
      await expect(grade.thresholdRows).toHaveCount(3);
    });

    /* Progressive mode only exists for bundle courses */
    if (kind === "bundle")
      await test.step("Progressive mode", async () => {
        await settings.gotoTab(tabs.progressive);

        await progressive.fill({ enable: true });
        expect(await progressive.save()).toBeTruthy();

        await progressive.reload();
        await expect(progressive.enableProgressiveModeCheck).toBeChecked();
      });

    await test.step("Redirect to checkout page", async () => {
      await settings.gotoTab(tabs.redirect);

      expect(
        await redirect.chooseCustomPage(CHECKOUT_REDIRECT_PAGE),
      ).toBeTruthy();
      await expect(redirect.changePageBtn).toBeVisible();
    });

    await test.step("Delete course", async () => {
      await myCoursesPage.goto();
      expect(await myCoursesPage.delete(courseId)).toBeTruthy();
    });

    await test.step("Logout", async () => {
      await logoutPage.logout();
      await logoutPage.expectLoggedOut();
    });
  });
}
