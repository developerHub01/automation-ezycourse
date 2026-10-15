import { test as base } from "@playwright/test";
import { LoginPage } from "@/pages/auth/login.page";
import { AdminDashboardPage } from "@/pages/site-owner-dashboard/admin.page";
import { AdminDashboardUsersStudentPage } from "@/pages/site-owner-dashboard/users/student.page";
import { StudentDashboardPage } from "@/pages/student-dashboard/dashboard.page";

export const test = base.extend<{
  loginPage: LoginPage;
  adminPage: AdminDashboardPage;
  adminStudentPage: AdminDashboardUsersStudentPage;
  studentDashboardPage: StudentDashboardPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  adminPage: async ({ page }, use) => {
    await use(new AdminDashboardPage(page));
  },
  adminStudentPage: async ({ page }, use) => {
    const studentPage = new AdminDashboardUsersStudentPage(page);
    await studentPage.goto();
    await use(studentPage);
  },
  studentDashboardPage: async ({ page }, use) => {
    const studentPage = new StudentDashboardPage(page);
    await studentPage.goto();
    await use(studentPage);
  },
});

export { expect } from "@playwright/test";
