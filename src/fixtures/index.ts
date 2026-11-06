import { test as base } from "@playwright/test";
import { LoginPage } from "@/pages/auth/login.page";
import { AdminDashboardPage } from "@/pages/site-owner-dashboard/admin.page";
import { AdminDashboardUsersStudentPage } from "@/pages/site-owner-dashboard/users/student.page";
import { StudentDashboardPage } from "@/pages/student-dashboard/dashboard.page";
import { DashboardMyCoursesPage } from "@/pages/site-owner-dashboard/courses/mycourses.page";
import { DashboardCoursesTypePage } from "@/pages/site-owner-dashboard/courses/course-type.page";
import { DashboardCreateCoursesPage } from "@/pages/site-owner-dashboard/courses/create.page";
import { DashboardCreateBundleCoursesPage } from "@/pages/site-owner-dashboard/courses/bundle-create.page";
import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";
import { DashboardCoursesAdvanceInfoPage } from "@/pages/site-owner-dashboard/courses/settings/advance-info.page";
import { DashboardCoursesLandingPagePage } from "@/pages/site-owner-dashboard/courses/settings/landing-page.page";
import { DashboardCoursesAfterCheckoutPage } from "@/pages/site-owner-dashboard/courses/settings/after-checkout-page.page";
import { DashboardCertificateSettingsPage } from "@/pages/site-owner-dashboard/courses/settings/certificate-settings.page";
import { DashboardCoursesRedirectToCheckoutPage } from "@/pages/site-owner-dashboard/courses/settings/redirect-to-checkout-page.page";

export const test = base.extend<{
  loginPage: LoginPage;
  adminPage: AdminDashboardPage;
  adminStudentPage: AdminDashboardUsersStudentPage;
  studentDashboardPage: StudentDashboardPage;
  dashboardMyCoursesPage: DashboardMyCoursesPage;
  dashboardCoursesTypePage: DashboardCoursesTypePage;
  dashboardCreateCoursesPage: DashboardCreateCoursesPage;
  dashboardCreateBundleCoursesPage: DashboardCreateBundleCoursesPage;

  dashboardCoursesSettingsBase: DashboardCoursesSettingsBase;
  dashboardCoursesAdvanceInfoPage: DashboardCoursesAdvanceInfoPage;
  dashboardCoursesLandingPagePage: DashboardCoursesLandingPagePage;
  dashboardCoursesAfterCheckoutPage: DashboardCoursesAfterCheckoutPage;
  dashboardCertificateSettingsPage: DashboardCertificateSettingsPage;
  dashboardCoursesRedirectToCheckoutPage: DashboardCoursesRedirectToCheckoutPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  adminPage: async ({ page }, use) => await use(new AdminDashboardPage(page)),
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
  dashboardMyCoursesPage: async ({ page }, use) =>
    await use(new DashboardMyCoursesPage(page)),
  dashboardCoursesTypePage: async ({ page }, use) =>
    await use(new DashboardCoursesTypePage(page)),
  dashboardCreateCoursesPage: async ({ page }, use) =>
    await use(new DashboardCreateCoursesPage(page)),
  dashboardCreateBundleCoursesPage: async ({ page }, use) =>
    await use(new DashboardCreateBundleCoursesPage(page)),

  dashboardCoursesSettingsBase: async ({ page }, use) =>
    await use(new DashboardCoursesSettingsBase(page)),
  dashboardCoursesAdvanceInfoPage: async ({ page }, use) =>
    await use(new DashboardCoursesAdvanceInfoPage(page)),
  dashboardCoursesLandingPagePage: async ({ page }, use) =>
    await use(new DashboardCoursesLandingPagePage(page)),
  dashboardCoursesAfterCheckoutPage: async ({ page }, use) =>
    await use(new DashboardCoursesAfterCheckoutPage(page)),
  dashboardCertificateSettingsPage: async ({ page }, use) =>
    await use(new DashboardCertificateSettingsPage(page)),
  dashboardCoursesRedirectToCheckoutPage: async ({ page }, use) =>
    await use(new DashboardCoursesRedirectToCheckoutPage(page)),
});

export { expect } from "@playwright/test";
