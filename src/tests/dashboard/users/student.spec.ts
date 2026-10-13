import { expect, test } from "@/fixtures";

test.describe("dashboard student page", () => {
  test.beforeEach(async ({ studentPage }) => {
    await expect(
      studentPage.heading,
      "Student page heading should be visible",
    ).toBeVisible();
  });

  test("create new student", async ({ studentPage }) => {
    await studentPage.openAddStudentModal();
    await studentPage.createStudent();
  });
});
