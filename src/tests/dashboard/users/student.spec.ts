import { expect, test } from "@/fixtures";
import { AdminDashboardUsersStudentPage } from "@/pages/dashboard/users/student.page";
import { Locator } from "@playwright/test";

type TBulkVisiblityPayload = Array<{
  field: keyof InstanceType<typeof AdminDashboardUsersStudentPage>;
  label: string;
}>;

const checkVisibility = async ({
  page,
  payload,
}: {
  payload: TBulkVisiblityPayload;
  page: AdminDashboardUsersStudentPage;
}) => {
  for (const { field, label } of payload)
    await expect(page[field] as Locator, `${label} visible`).toBeVisible();
};

test.describe("Add student modal", () => {
  test.beforeEach(async ({ studentPage }) => {
    await expect(
      studentPage.heading,
      "Student page heading should be visible",
    ).toBeVisible();
  });

  test.describe("functional", () => {
    test("create new student", async ({ studentPage }) => {
      await studentPage.openAddStudentModal();
      await studentPage.createStudent();
    });
  });

  test.describe("UI", () => {
    test("add student UI", async ({ studentPage }) => {
      await expect(
        studentPage.addStudentBtn,
        "Add student button visible",
      ).toBeVisible();
      await studentPage.openAddStudentModal();

      await checkVisibility({
        page: studentPage,
        payload: [
          {
            field: "modalTitle",
            label: "heading",
          },
          {
            field: "modalStudentFirstName",
            label: "First name",
          },
          {
            field: "modalStudentLastName",
            label: "Last name",
          },
          {
            field: "modalStudentEmail",
            label: "Email",
          },
          {
            field: "modalStudentPassword",
            label: "Password",
          },
          {
            field: "modalStudentClose",
            label: "Close",
          },
          {
            field: "modalStudentAdd",
            label: "Add",
          },
          {
            field: "modalStudentCloseX",
            label: "Close X",
          },
        ],
      });
    });

    test("add student error message UI", async ({ studentPage }) => {
      await expect(
        studentPage.addStudentBtn,
        "Add student button visible",
      ).toBeVisible();
      await studentPage.openAddStudentModal();
      await studentPage.fillStudentForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
      await studentPage.submitForm();

      await checkVisibility({
        page: studentPage,
        payload: [
          {
            field: "modalStudentFirstNameExplainError",
            label: "First name explain error",
          },
          {
            field: "modalStudentLastNameExplainError",
            label: "Last name explain error",
          },
          {
            field: "modalStudentEmailExplainError",
            label: "Email explain error",
          },
          {
            field: "modalStudentPasswordExplainError",
            label: "Password explain error",
          },
        ],
      });
    });
  });
});
