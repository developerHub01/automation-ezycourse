import { expect, test } from "@/fixtures";
import { Locator } from "@playwright/test";

test.describe("All courses", () => {
  test.beforeEach(async ({ dashboardMyCoursesPage }) => {
    await dashboardMyCoursesPage.goto();
    await dashboardMyCoursesPage.allCoursesHeading.waitFor({
      state: "visible",
    });
  });

  test.describe("Functional", () => {
    test("create single course wrapper", async ({
      dashboardMyCoursesPage: myCoursesPage,
      dashboardCoursesTypePage: courseTypePage,
      dashboardCreateCoursesPage: createCoursePage,
    }) => {
      await myCoursesPage.addCourseButton.click();

      await expect(courseTypePage.courseTypePageHeading).toBeVisible();
      await courseTypePage.courseTypePageSingleCourse.click();
      await expect(createCoursePage.formHeading).toBeVisible();

      await createCoursePage.fill({
        name: "Dummy name",
        shortDescription: "dummy short description",
        description: "dummy description",
        category: ["automation1", "automation2"],
        subCategory: ["sub1", "sub-cat1"],
        access: "private",
        previewType: "video",
        isHideEnrollmentCount: false,
        motivationalPopup: true,
        publishingStatus: "draft",
        enableLimitEnrollment: true,
        enrollmentLimit: 99,
      });

      await createCoursePage.createBtn.click();
    });
  });

  test.describe("UI", () => {
    test("All navigation button working", async ({
      dashboardMyCoursesPage: allCoursesPage,
      dashboardCoursesTypePage: courseTypePage,
      dashboardCreateCoursesPage: courseCreatePage,
      page,
    }) => {
      /* add course button */
      await allCoursesPage.addCourseButton.click();
      await expect(
        courseTypePage.courseTypePageHeading,
        "Add course button working",
      ).toBeVisible();

      /* course type page back button */
      await expect(
        courseTypePage.courseTypePageBackBtn,
        "course type page back button visible",
      ).toBeVisible();
      await courseTypePage.courseTypePageBackBtn.click();
      await expect(
        allCoursesPage.allCoursesHeading,
        "Course type back button working",
      ).toBeVisible();

      /***
       * Inside courses type create course page
       */
      const courseTypeNavigationMap: Array<{
        type: "single" | "bundle";
        selector: Locator;
        heading: string;
      }> = [
        {
          type: "single",
          selector: courseTypePage.courseTypePageSingleCourse,
          heading: "Create single course",
        },
        {
          type: "bundle",
          selector: courseTypePage.courseTypePageBundleCourse,
          heading: "Create bundle course",
        },
      ];

      for (let { type, selector, heading } of courseTypeNavigationMap) {
        await allCoursesPage.addCourseButton.click();

        await expect(courseTypePage.courseTypePageHeading).toBeVisible();

        /* select type button */
        await selector.click();
        await expect(
          courseCreatePage.formHeading,
          `Course type ${type} course button working`,
        ).toContainText(heading);

        /* create page back button */
        await courseCreatePage.backBtn.click();
        await expect(
          courseTypePage.courseTypePageHeading,
          `${type} back button working`,
        ).toBeVisible();

        /* back to course creation page */
        await page.goForward();

        await expect(courseCreatePage.topMenu).toBeVisible();
        await expect(courseCreatePage.backToCoursesBtn).toBeVisible();

        /* create page back button */
        await courseCreatePage.backToCoursesBtn.click();

        await expect(
          allCoursesPage.allCoursesHeading,
          `${type} back to courses button working`,
        ).toBeVisible();
      }

      expect("All navigation buttons working");
    });
  });
});
