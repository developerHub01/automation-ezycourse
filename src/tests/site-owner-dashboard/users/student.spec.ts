import { expect, test } from "@/fixtures";
import { AdminDashboardUsersStudentPage } from "@/pages/site-owner-dashboard/users/student.page";
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
  test.beforeEach(async ({ adminStudentPage }) => {
    await expect(
      adminStudentPage.heading,
      "Student page heading should be visible",
    ).toBeVisible();
    await expect(
      adminStudentPage.addStudentBtn,
      "Add student button visible",
    ).toBeVisible();
    await adminStudentPage.openAddStudentModal();
  });

  test.describe("functional", () => {
    test("create new student", async ({ adminStudentPage }) => {
      await adminStudentPage.createStudent();
      await expect(
        adminStudentPage.notificationToast,
        "Student created successfully",
      ).toHaveText(adminStudentPage.messageMap["createSuccess"]);
    });
    test("create new student with existing mail", async ({
      adminStudentPage,
    }) => {
      const existingEmail = "shakil102043@gmail.com";

      const candidateMail = [
        existingEmail,
        existingEmail.toLowerCase(),
        existingEmail.toUpperCase(),
      ];

      for (let email of candidateMail) {
        await adminStudentPage.createStudent({
          email,
        });

        await expect(
          adminStudentPage.modalStudentEmailExplainError,
          `Email error explainer visible for ${email}`,
        ).toBeVisible();
        await expect(
          adminStudentPage.modalStudentEmailExplainError,
          `Email already exit error for ${email}`,
        ).toHaveText("Email is already in use");
      }
    });
  });

  test.describe("UI", () => {
    test("add student UI", async ({ adminStudentPage }) => {
      await checkVisibility({
        page: adminStudentPage,
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

    test("add student error message UI", async ({ adminStudentPage }) => {
      await adminStudentPage.fillStudentForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
      await adminStudentPage.submitForm();

      await checkVisibility({
        page: adminStudentPage,
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

    test("add student validation message UI", async ({ adminStudentPage }) => {
      await adminStudentPage.fillStudentForm({
        firstName: "11",
        lastName: "11",
        email: "@asdfsdf",
        password: "12345",
      });

      await checkVisibility({
        page: adminStudentPage,
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

      await expect(
        adminStudentPage.modalStudentFirstNameExplainError,
      ).toHaveText("The input can only contain letters, dots and hyphens.");
      await expect(
        adminStudentPage.modalStudentLastNameExplainError,
      ).toHaveText(
        "The input can only contain letters, hyphens, parentheses, and underscores.",
      );
      await expect(
        adminStudentPage.modalStudentPasswordExplainError,
      ).toHaveText("Password should be at least 6 characters.");
      await adminStudentPage.submitForm();
    });
  });
});
