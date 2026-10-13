import { test as base } from "@playwright/test";
import { LoginPage } from "@/pages/auth/login.page";
import { AdminDashboardPage } from "@/pages/dashboard/admin.page";
import { AdminDashboardUsersStudentPage } from "@/pages/dashboard/users/student.page";

export const test = base.extend<{
  loginPage: LoginPage;
  adminPage: AdminDashboardPage;
  studentPage: AdminDashboardUsersStudentPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  adminPage: async ({ loginPage, page }, use) => {
    await loginPage.login({
      email: process.env.SITE_OWNER_EMAIL!,
      password: process.env.SITE_OWNER_PASSWORD!,
    });
    await use(new AdminDashboardPage(page));
  },
  studentPage: async ({ adminPage, page }, use) => {
    const studentPage = new AdminDashboardUsersStudentPage(page);
    await studentPage.goto();
    await use(studentPage);
  },
});

export { expect } from "@playwright/test";
