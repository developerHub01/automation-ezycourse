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
    await expect(
      studentPage.addStudentBtn,
      "Add student button visible",
    ).toBeVisible();
    await studentPage.openAddStudentModal();
  });

  test.describe("functional", () => {
    test("create new student", async ({ studentPage }) => {
      await studentPage.createStudent();
    });
    test("create new student with existing mail", async ({ studentPage }) => {
      const existingEmail = "shakil102043@gmail.com";

      const candidateMail = [
        existingEmail,
        existingEmail.toLowerCase(),
        existingEmail.toUpperCase(),
      ];

      for (let email of candidateMail) {
        await studentPage.createStudent({
          email,
        });

        await expect(
          studentPage.modalStudentEmailExplainError,
          `Email error explainer visible for ${email}`,
        ).toBeVisible();
        await expect(
          studentPage.modalStudentEmailExplainError,
          `Email already exit error for ${email}`,
        ).toHaveText("Email is already in use");
      }
    });
  });

  test.describe("UI", () => {
    test("add student UI", async ({ studentPage }) => {
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

    test("add student validation message UI", async ({ studentPage }) => {
      await studentPage.fillStudentForm({
        firstName: "11",
        lastName: "11",
        email: "@asdfsdf",
        password: "12345",
      });

      console.log(
        await studentPage.modalStudentPasswordExplainError.textContent(),
      );
      // await new Promise(() => setTimeout(() => {}, 1000));

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
            field: "modalStudentPasswordExplainError",
            label: "Password explain error",
          },
        ],
      });

      await expect(studentPage.modalStudentFirstNameExplainError).toHaveText(
        "The input can only contain letters, dots and hyphens.",
      );
      await expect(studentPage.modalStudentLastNameExplainError).toHaveText(
        "The input can only contain letters, hyphens, parentheses, and underscores.",
      );
      await expect(studentPage.modalStudentPasswordExplainError).toHaveText(
        "Password should be at least 6 characters.",
      );
      await studentPage.submitForm();
    });
  });
});
