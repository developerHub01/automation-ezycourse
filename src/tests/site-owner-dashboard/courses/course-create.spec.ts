import { expect, test } from "@/fixtures";

test.describe("Course create", () => {
  test.beforeEach(async ({ dashboardCreateCoursesPage }) => {
    await dashboardCreateCoursesPage.goto();
    await dashboardCreateCoursesPage.formHeading.waitFor({
      state: "visible",
    });
  });

  test.describe("Functional", () => {
    test("create single course wrapper", async ({
      dashboardCreateCoursesPage: createCoursePage,
    }) => {
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

    test("create N single course wrapper", async ({
      dashboardCreateCoursesPage: createCoursePage,
    }) => {
      const N = 10;
      await expect(createCoursePage.formHeading).toBeVisible();

      for (let i = 0; i < N; i++) {
        await createCoursePage.fill({
          name: `Dummy name ${i + 1}`,
          shortDescription: `dummy short description ${i + 1}`,
          description: `dummy description ${i + 1}`,
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
        await createCoursePage.goto();
      }
    });
  });

  test.describe("UI", () => {});
});
