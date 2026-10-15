import { expect, test } from "@/fixtures";

test.describe("update profile", () => {
  test.beforeEach(async ({ studentDashboardPage }) => {});

  test.describe("UI", () => {
    test("Redirecting into dashboard", async ({ studentDashboardPage }) => {
      await expect(
        studentDashboardPage.studentMainContainer,
        "Student dashboard rendering",
      ).toBeVisible();
    });
  });
});
