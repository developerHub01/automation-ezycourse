import { test as base } from "@playwright/test";
import { LoginPage } from "@/pages/auth/login.page";
import { LogoutPage } from "@/pages/auth/logout.page";
import { AdminDashboardPage } from "@/pages/site-owner-dashboard/admin.page";
import { AdminDashboardUsersStudentPage } from "@/pages/site-owner-dashboard/users/student.page";
import { StudentDashboardPage } from "@/pages/student-dashboard/dashboard.page";
import { DashboardMyCoursesPage } from "@/pages/site-owner-dashboard/courses/mycourses.page";
import { DashboardCoursesTypePage } from "@/pages/site-owner-dashboard/courses/course-type.page";
import { DashboardCreateCoursesPage } from "@/pages/site-owner-dashboard/courses/create.page";
import { DashboardCreateBundleCoursesPage } from "@/pages/site-owner-dashboard/courses/bundle-create.page";
import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";
import { DashboardCoursesBasicInfoPage } from "@/pages/site-owner-dashboard/courses/settings/basic-info.page";
import { DashboardCoursesGradeSettingsPage } from "@/pages/site-owner-dashboard/courses/settings/grade-settings.page";
import { DashboardCoursesProgressiveModePage } from "@/pages/site-owner-dashboard/courses/settings/progressive-mode.page";
import { DashboardCoursesMotivationPopupPage } from "@/pages/site-owner-dashboard/courses/settings/motivation-popup.page";
import { DashboardCoursesAdvanceInfoPage } from "@/pages/site-owner-dashboard/courses/settings/advance-info.page";
import { DashboardCoursesLandingPagePage } from "@/pages/site-owner-dashboard/courses/settings/landing-page.page";
import { DashboardCoursesAfterCheckoutPage } from "@/pages/site-owner-dashboard/courses/settings/after-checkout-page.page";
import { DashboardCertificateSettingsPage } from "@/pages/site-owner-dashboard/courses/settings/certificate-settings.page";
import { DashboardCoursesRedirectToCheckoutPage } from "@/pages/site-owner-dashboard/courses/settings/redirect-to-checkout-page.page";
import { DashboardCoursesAccessibilitySettingPage } from "@/pages/site-owner-dashboard/courses/settings/accessibility-setting.page";

export const test = base.extend<{
  loginPage: LoginPage;
  logoutPage: LogoutPage;
  adminPage: AdminDashboardPage;
  adminStudentPage: AdminDashboardUsersStudentPage;
  studentDashboardPage: StudentDashboardPage;
  dashboardMyCoursesPage: DashboardMyCoursesPage;
  dashboardCoursesTypePage: DashboardCoursesTypePage;
  dashboardCreateCoursesPage: DashboardCreateCoursesPage;
  dashboardCreateBundleCoursesPage: DashboardCreateBundleCoursesPage;

  dashboardCoursesSettingsBase: DashboardCoursesSettingsBase;
  dashboardCoursesBasicInfoPage: DashboardCoursesBasicInfoPage;
  dashboardCoursesAdvanceInfoPage: DashboardCoursesAdvanceInfoPage;
  dashboardCoursesMotivationPopupPage: DashboardCoursesMotivationPopupPage;
  dashboardCoursesGradeSettingsPage: DashboardCoursesGradeSettingsPage;
  dashboardCoursesProgressiveModePage: DashboardCoursesProgressiveModePage;
  dashboardCoursesLandingPagePage: DashboardCoursesLandingPagePage;
  dashboardCoursesAfterCheckoutPage: DashboardCoursesAfterCheckoutPage;
  dashboardCertificateSettingsPage: DashboardCertificateSettingsPage;
  dashboardCoursesRedirectToCheckoutPage: DashboardCoursesRedirectToCheckoutPage;
  dashboardCoursesAccessibilitySettingPage: DashboardCoursesAccessibilitySettingPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  logoutPage: async ({ page }, use) => await use(new LogoutPage(page)),
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
  dashboardCoursesBasicInfoPage: async ({ page }, use) =>
    await use(new DashboardCoursesBasicInfoPage(page)),
  dashboardCoursesMotivationPopupPage: async ({ page }, use) =>
    await use(new DashboardCoursesMotivationPopupPage(page)),
  dashboardCoursesGradeSettingsPage: async ({ page }, use) =>
    await use(new DashboardCoursesGradeSettingsPage(page)),
  dashboardCoursesProgressiveModePage: async ({ page }, use) =>
    await use(new DashboardCoursesProgressiveModePage(page)),
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
  dashboardCoursesAccessibilitySettingPage: async ({ page }, use) =>
    await use(new DashboardCoursesAccessibilitySettingPage(page)),
});

export { expect } from "@playwright/test";
