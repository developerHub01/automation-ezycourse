import { expect, test } from "@/fixtures";

test.describe("dashboard student page", () => {
  test("create new student", async ({ studentPage }) => {
    await expect(
      studentPage.heading,
      "Student page heading found",
    ).toBeVisible();
    await studentPage.openAddStudentModal();
  });
});
