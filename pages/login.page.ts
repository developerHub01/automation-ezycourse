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

  async goto(): Promise<void> {
    await this.page.goto("/login");
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.signInBtn.click();
  }
}
