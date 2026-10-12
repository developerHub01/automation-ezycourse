import { expect, test } from "@/fixtures";

const URL_REGEX_MAP = {
  dashboard: /\/dashboard\/?$/,
  forgotPassword: /\/forgot-password\/?$/,
  signUp: /\/signup\/?$/,
};

test.describe("Successful login", () => {
  test("Login with valid owner/admin credentials", async ({ loginPage }) => {
    await loginPage.goto();

    await loginPage.login({
      email: process.env.SITE_OWNER_EMAIL!,
      password: process.env.SITE_OWNER_PASSWORD!,
    });

    /* First checking URL so that it force to retry untill it match or timeout */
    await expect(loginPage.page).toHaveURL(URL_REGEX_MAP.dashboard);
    await expect(loginPage.page).toHaveTitle("Dashboard | Admin");
  });

  test("Login with valid student credentials", async ({ loginPage }) => {
    await loginPage.goto();

    await loginPage.login({
      email: process.env.BASE_STUDENT_EMAIL!,
      password: process.env.BASE_STUDENT_PASSWORD!,
    });

    await expect(loginPage.page).toHaveURL(URL_REGEX_MAP.dashboard);
    await expect(loginPage.page).toHaveTitle("Dashboard");
  });

  test("Submit login using Enter", async ({ loginPage }) => {
    await loginPage.goto();

    await loginPage.fillForm({
      email: process.env.BASE_STUDENT_EMAIL!,
      password: process.env.BASE_STUDENT_PASSWORD!,
    });

    await loginPage.enterInPasswordField();

    await expect(loginPage.page).toHaveURL(URL_REGEX_MAP.dashboard);
    await expect(loginPage.page).toHaveTitle("Dashboard");
  });
});

test.describe("Failed login", () => {
  test("Invalid password shows an error", async ({ loginPage }) => {
    await loginPage.goto();
    const loginPageURL = loginPage.page.url();

    await loginPage.login({
      email: process.env.SITE_OWNER_EMAIL!,
      password: "wrong_password",
    });

    await expect(loginPage.errorToast).toContainText("Invalid credentials");
    await expect(loginPage.page).toHaveURL(loginPageURL);
  });
});

test.describe("UI testing", () => {
  test("Field type and required validation", async ({ loginPage }) => {
    await loginPage.goto();
    const loginPageURL = loginPage.page.url();

    await loginPage.email.fill("example@gmail.com");
    await loginPage.signInBtn.click();
    await loginPage.email.clear();

    expect(loginPage.emailError, "Invalid email address").toBeVisible();
    expect(loginPage.passwordError, "Password is required").toBeVisible();

    await expect(loginPage.page).toHaveURL(loginPageURL);
  });

  test("Forgot password redirection", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.forgotPasswordBtn.click();

    await expect(loginPage.page).toHaveURL(URL_REGEX_MAP.forgotPassword);
  });

  test("Don't have an account redirection", async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.signUpBtn.click();

    await expect(loginPage.page).toHaveURL(URL_REGEX_MAP.signUp);
  });

  test("Test rate limiting", async ({ loginPage }) => {
    await loginPage.goto();

    for (let i = 0; i < 10; i++) {
      await loginPage.login({
        email: "wrong_email@gmail.com",
        password: "wrong_password",
      });
    }

    expect(loginPage.errorToast).toContainText("Too many requests");
  });
});
