import { IStudentBasic } from "@/types/student.types";
import { generateStudent } from "@/utils/student.utils";
import { Locator, Page } from "@playwright/test";

type TmessageKey = "createSuccess";

const addStudentAPI = "api/teacher/instactor/createNewUserByAdmin";

export class AdminDashboardUsersStudentPage {
  readonly page: Page;
  readonly addStudentBtn: Locator;
  readonly heading: Locator;

  /****
   *  Modal ========================
   */
  readonly modal: Locator;

  /****
   *  Modal header ========================
   */
  readonly modalHeader: Locator;
  readonly modalTitle: Locator;
  readonly modalStudentCloseX: Locator;

  /****
   *  Modal body ========================
   */
  readonly modalBody: Locator;

  readonly modalStudentFirstName: Locator;
  readonly modalStudentFirstNameLabel: Locator;
  readonly modalStudentFirstNameExplainError: Locator;

  readonly modalStudentLastName: Locator;
  readonly modalStudentLastNameLabel: Locator;
  readonly modalStudentLastNameExplainError: Locator;

  readonly modalStudentEmail: Locator;
  readonly modalStudentEmailLabel: Locator;
  readonly modalStudentEmailExplainError: Locator;

  readonly modalStudentPassword: Locator;
  readonly modalStudentPasswordLabel: Locator;
  readonly modalStudentPasswordExplainError: Locator;

  readonly modalStudentClose: Locator;
  readonly modalStudentAdd: Locator;

  readonly notificationToast: Locator;

  readonly messageMap: Record<TmessageKey, string> = {
    createSuccess: "Created",
  };

  constructor(page: Page) {
    this.page = page;
    this.addStudentBtn = page.getByRole("button", {
      name: "Add Student",
    });

    this.heading = page.getByRole("heading", {
      name: "Students",
    });

    this.modal = page.locator(".ant-modal-content");
    this.modalStudentCloseX = this.modal
      .getByRole("button", {
        name: "Close",
      })
      .first();

    /****
     *  Modal header ========================
     */
    this.modalHeader = this.modal.locator(".ant-modal-header").first();
    this.modalTitle = this.modalHeader.getByText("Add a student", {
      exact: true,
    });

    /****
     *  Modal Body ========================
     */
    this.modalBody = this.modal.locator(".ant-modal-body").first();

    /* first name field */
    this.modalStudentFirstName = this.modalBody.locator("#first_name");
    this.modalStudentFirstNameLabel =
      this.modalBody.locator(`[for="first_name"]`);
    this.modalStudentFirstNameExplainError =
      this.modalBody.locator(`#first_name_help`);

    /* last name field */
    this.modalStudentLastName = this.modalBody.locator("#last_name");
    this.modalStudentLastNameLabel =
      this.modalBody.locator(`[for="last_name"]`);
    this.modalStudentLastNameExplainError =
      this.modalBody.locator(`#last_name_help`);

    /* email field */
    this.modalStudentEmail = this.modalBody.locator("#email");
    this.modalStudentEmailLabel = this.modalBody.locator(`[for="email"]`);
    this.modalStudentEmailExplainError = this.modalBody.locator(`#email_help`);

    /* password field */
    this.modalStudentPassword = this.modalBody.locator("#password");
    this.modalStudentPasswordLabel = this.modalBody.locator(`[for="password"]`);
    this.modalStudentPasswordExplainError =
      this.modalBody.locator(`#password_help`);

    this.modalStudentClose = this.modalBody.getByRole("button", {
      name: "Close",
    });
    this.modalStudentAdd = this.modalBody.getByRole("button", {
      name: "Add",
    });

    /***
     *  Notifiation toast =========================
     */
    this.notificationToast = this.page.locator(".ant-notification-topRight");
  }

  goto = async (): Promise<void> => {
    await this.page.goto("/dashboard/students");
  };
  openAddStudentModal = async (): Promise<void> =>
    await this.addStudentBtn.click();

  closeAddStudentModal = async (): Promise<void> =>
    this.modalStudentClose.click();

  fillStudentForm = async (
    payload?: Partial<IStudentBasic>,
  ): Promise<IStudentBasic> => {
    const data = generateStudent(payload);

    await this.modalStudentFirstName.fill(data.firstName);
    await this.modalStudentLastName.fill(data.lastName);
    await this.modalStudentEmail.fill(data.email);
    await this.modalStudentPassword.fill(data.password);

    return data;
  };

  createStudent = async (
    payload?: Partial<IStudentBasic>,
  ): Promise<IStudentBasic> => {
    const data = await this.fillStudentForm(payload);

    /* add student adding listener */
    const studentAddResponse = this.page.waitForResponse(
      (response) =>
        response.url().endsWith(`/${addStudentAPI}`) &&
        response.request().method() === "POST",
    );

    await this.submitForm();
    await studentAddResponse;

    return data;
  };

  submitForm = async () => await this.modalStudentAdd.click();
}
