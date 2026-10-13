import { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly form: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly signInBtn: Locator;
  readonly forgotPasswordBtn: Locator;
  readonly signUpBtn: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly errorToast: Locator;
  readonly loginAPI = "api/student/auth/login";

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator(`[aria-describedby="ezy-section"] form`);
    this.email = this.form.locator(`#email`);
    this.password = this.form.locator(`#password`);

    this.signInBtn = this.form.getByRole("button", {
      name: "Sign In",
    });
    this.forgotPasswordBtn = this.form.getByRole("link", {
      name: "Forgot password?",
    });
    this.signUpBtn = this.form.getByRole("link", {
      name: "Don't have an account?",
    });

    this.emailError = this.form.locator(`#_r_2b_-form-item-message`);
    this.passwordError = this.form.locator(`#_r_2c_-form-item-message`);

    this.errorToast = this.page.locator(
      `[aria-label="Notifications alt+T"] ol li`,
    );
  }

  goto = async (): Promise<void> => {
    await this.page.goto("/login");
  };

  fillForm = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> => {
    await this.email.fill(email);
    await this.password.fill(password);
  };

  login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> => {
    await this.fillForm({
      email,
      password,
    });
    const responseListener = this.page.waitForResponse(
      (response) =>
        response.url().endsWith(`/${this.loginAPI}`) &&
        response.request().method() === "POST",
    );
    await this.signInBtn.click();
    await responseListener;
  };

  enterInPasswordField = async (): Promise<void> =>
    await this.password.press("Enter");
}
