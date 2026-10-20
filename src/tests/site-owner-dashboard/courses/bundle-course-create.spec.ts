import { expect, test } from "@/fixtures";

test.describe("Bundle course create", () => {
  test.beforeEach(async ({ dashboardCreateBundleCoursesPage }) => {
    await dashboardCreateBundleCoursesPage.goto();
    await dashboardCreateBundleCoursesPage.formHeading.waitFor({
      state: "visible",
    });
  });

  test.describe("Functional", () => {
    test("create bundle course wrapper", async ({
      dashboardCreateBundleCoursesPage: createCoursePage,
    }) => {
      await expect(createCoursePage.formHeading).toBeVisible();

      await createCoursePage.fill({
        name: "Dummy bundle name",
        shortDescription: "dummy short description",
        description: "dummy description",
        category: ["automation1", "automation2"],
        previewType: "video",
        isHideEnrollmentCount: false,
      });

      await createCoursePage.createBtn.click();
    });
  });

  test.describe("UI", () => {});
});
