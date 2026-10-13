import { IStudentBasic } from "@/types/student.types";
import { generateStudent } from "@/utils/student.utils";
import { Locator, Page } from "@playwright/test";

const addStudentAPI = "api/teacher/instactor/createNewUserByAdmin";

export class AdminDashboardUsersStudentPage {
  readonly page: Page;
  readonly addStudentBtn: Locator;
  readonly heading: Locator;
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly modalStudentFirstName: Locator;
  readonly modalStudentLastName: Locator;
  readonly modalStudentEmail: Locator;
  readonly modalStudentPassword: Locator;

  readonly modalStudentClose: Locator;
  readonly modalStudentAdd: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addStudentBtn = page.getByRole("button", {
      name: "Add Student",
    });
    this.heading = page.getByRole("heading", {
      name: "Students",
    });

    this.modal = page.locator(".ant-modal-content");
    this.modalTitle = this.modal.getByText("Add a student", {
      exact: true,
    });

    this.modalStudentFirstName = this.modal.locator("#first_name");
    this.modalStudentLastName = this.modal.locator("#last_name");
    this.modalStudentEmail = this.modal.locator("#email");
    this.modalStudentPassword = this.modal.locator("#password");

    this.modalStudentClose = this.modal.getByRole("button", {
      name: "Close",
    });
    this.modalStudentAdd = this.modal.getByRole("button", {
      name: "Add",
    });
  }

  goto = async (): Promise<void> => {
    await this.page.goto("/dashboard/students");
  };
  openAddStudentModal = async (): Promise<void> =>
    await this.addStudentBtn.click();

  closeAddStudentModal = async (): Promise<void> =>
    this.modalStudentClose.click();

  createStudent = async (payload?: IStudentBasic): Promise<IStudentBasic> => {
    const data = generateStudent(payload);

    await this.modalStudentFirstName.fill(data.firstName);
    await this.modalStudentLastName.fill(data.lastName);
    await this.modalStudentEmail.fill(data.email);
    await this.modalStudentPassword.fill(data.password);

    /* add student adding listener */
    const studentAddResponse = this.page.waitForResponse(
      (response) =>
        response.url().endsWith(`/${addStudentAPI}`) &&
        response.request().method() === "POST",
    );

    await this.modalStudentAdd.click();
    await studentAddResponse;

    return data;
  };
}
