import { expect, test } from "@/fixtures";
import { Locator } from "@playwright/test";

test.describe("Course type", () => {
  test.beforeEach(async ({ dashboardCoursesTypePage }) => {
    await dashboardCoursesTypePage.goto();
    await dashboardCoursesTypePage.mainHeading.waitFor({
      state: "visible",
    });
  });

  test.describe("UI", () => {
    test("All UI element exist", async ({ dashboardCoursesTypePage }) => {
      await Promise.all(
        [
          {
            locator: dashboardCoursesTypePage.mainHeading,
            message: "Heading",
          },
          {
            locator: dashboardCoursesTypePage.backBtn,
            message: "Back button",
          },
          {
            locator: dashboardCoursesTypePage.typeSingleCourse,
            message: "Single course button",
          },
          {
            locator: dashboardCoursesTypePage.typeBundleCourse,
            message: "bundle course button",
          },
        ].map(({ locator, message }) =>
          expect(locator, `${message} visible`).toBeVisible(),
        ),
      );
    });

    test("All navigation button working", async ({
      dashboardMyCoursesPage: allCoursesPage,
      dashboardCoursesTypePage: courseTypePage,
      dashboardCreateCoursesPage: courseCreatePage,
    }) => {
      /* course type page back button */
      await expect(
        courseTypePage.backBtn,
        "course type page back button visible",
      ).toBeVisible();
      await courseTypePage.backBtn.click();
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
          selector: courseTypePage.typeSingleCourse,
          heading: "Create single course",
        },
        {
          type: "bundle",
          selector: courseTypePage.typeBundleCourse,
          heading: "Create bundle course",
        },
      ];

      for (let { type, selector, heading } of courseTypeNavigationMap) {
        await courseTypePage.goto();
        await expect(courseTypePage.mainHeading).toBeVisible();

        /* select type button */
        await selector.click();
        await expect(
          courseCreatePage.formHeading,
          `Course type ${type} course button working`,
        ).toContainText(heading);
      }

      expect("All navigation buttons working");
    });
  });
});
