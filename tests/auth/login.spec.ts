import { expect, test } from "../../fixtures";

test("valid credentials redirect to dashboard", async ({ loginPage }) => {
  await loginPage.goto();

  await loginPage.login({
    email: process.env.SITE_OWNER_EMAIL!,
    password: process.env.SITE_OWNER_PASSWORD!,
  });

  await expect
    .poll(() => loginPage.page.url(), {
      message: "URL should change after successful login",
      timeout: 10_000,
    })
    .toMatch(/\/dashboard\/?$/);
});

test("invalid password shows an error", async ({ loginPage }) => {
  await loginPage.goto();
  const loginPageURL = loginPage.page.url();

  await loginPage.login({
    email: process.env.SITE_OWNER_EMAIL!,
    password: "wrong_password",
  });

  await expect(loginPage.errorToast, "Toast shown").toHaveText(
    "Invalid credentials",
  );
  await expect(loginPage.page).toHaveURL(loginPageURL);
});

test("Submit empty fields", async ({ loginPage }) => {
  await loginPage.goto();
  const loginPageURL = loginPage.page.url();

  await loginPage.login({
    email: "",
    password: "",
  });

  

  // await expect(loginPage.errorToast, "Toast shown").toHaveText(
  //   "Invalid credentials",
  // );
  await expect(loginPage.page).toHaveURL(loginPageURL);
});
