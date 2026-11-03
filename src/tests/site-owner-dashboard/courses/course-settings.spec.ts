import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";
import { expect, test } from "@/fixtures";

const sidebarItemList: Array<{
  name: string;
  title: string | null;
}> = [
  {
    name: "Basic information",
    title: "Basic Information",
  },
  {
    name: "Advanced information",
    title: "Advance Information",
  },
  {
    name: "Landing page",
    title: "Landing page setting",
  },
  {
    name: "After checkout page",
    title: "After checkout page setting",
  },
  {
    name: "Certificate",
    title: "Certificate settings",
  },
  {
    name: "Course accessibility",
    title: "Course accessibility setting",
  },
  {
    name: "Motivation popup",
    title: "Motivation popup setting",
  },
  {
    name: "Grade settings",
    title: null,
  },
  {
    name: "Redirect to checkout page",
    title: "Redirect to checkout page setting",
  },
];

test.describe("Course create", () => {
  test.beforeEach(async ({ dashboardCoursesSettingsBase }) => {
    await dashboardCoursesSettingsBase.goto(50452);
    // await dashboardCoursesSettingsBase.goto(50492);
    await dashboardCoursesSettingsBase.mainHeading.waitFor({
      state: "visible",
    });
  });

  test.describe("Functional", () => {
    test("update advance setting", async ({
      dashboardCoursesAdvanceInfoPage: advanceinfoPage,
    }) => {
      await advanceinfoPage.gotoTab(sidebarItemList[1]);
      // await advanceinfoPage.selectMethods([
      //   "fastspring",
      //   "manual",
      //   "mercadopago",
      // ]);
      // await advanceinfoPage.selectLevel("advanced");
      // await advanceinfoPage.addCourseAssurance({
      //   check: true,
      //   value: "hello world",
      // });
      await advanceinfoPage.addCourseIncludes({
        check: true,
        fields: ["x", "y", "z"],
      });
      await advanceinfoPage.addLearningOutcome({
        check: true,
        fields: ["x", "y", "z"],
      });
      await advanceinfoPage.addFaq({
        check: true,
        fields: [
          {
            question: "question1",
            answer: "answer1",
          },
          {
            question: "question2",
            answer: "answer2",
          },
          {
            question: "question3",
            answer: "answer3",
          },
        ],
      });
      await advanceinfoPage.saveBtn.click();
      await advanceinfoPage.page.waitForTimeout(1000);
    });
  });

  test.describe("UI", () => {
    test("Sidebar navigation working", async ({
      dashboardCoursesSettingsBase: settingPage,
    }) => {
      for (const tab of sidebarItemList) {
        await settingPage.gotoTab(tab);

        if (!tab.title) {
          await expect(settingPage.mainHeading).toHaveCount(0);
          continue;
        }

        await expect(settingPage.mainHeading).toContainText(tab.title, {
          ignoreCase: true,
        });
      }
    });
  });
});
