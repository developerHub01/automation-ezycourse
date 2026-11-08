import { Locator, Page } from "@playwright/test";
import { DashboardCoursesSettingsBase } from "@/pages/site-owner-dashboard/courses/settings/settings.base";
import { NotificationBase } from "@/notifications/notification.base";
import { ICourseGradeSettings } from "@/types/courses.types";

/**
 * Page Object Model for the course Grade settings (grading and marksheets).
 */
export class DashboardCoursesGradeSettingsPage extends DashboardCoursesSettingsBase {
  readonly url = (id: number) =>
    `dashboard/courses/${id}/setting/grade-settings/`;

  readonly form: Locator;
  readonly enableGradingCheck: Locator;

  /****
   * Grade thresholds table (only shown while grading is enabled).
   * Each row: a disabled "from" number, an editable "up to" number, a grade.
   */
  readonly thresholdTable: Locator;
  readonly thresholdRows: Locator;
  readonly addAnotherBtn: Locator;

  readonly notificationBase: NotificationBase;

  constructor(page: Page) {
    super(page);

    this.form = this.main.locator("form").first();
    this.enableGradingCheck = this.main.getByRole("checkbox", {
      name: /Enable grading/,
    });

    this.thresholdTable = this.main.locator("table");
    this.thresholdRows = this.thresholdTable.locator("tbody tr");
    this.addAnotherBtn = this.main.getByRole("button", {
      name: "+ Add another",
    });

    this.notificationBase = new NotificationBase(this.page);
  }

  goto = async (id: number) => await this.page.goto(this.url(id));

  /**
   * The saved state loads after the form renders and would otherwise
   * overwrite what was just clicked.
   */
  private waitUntilLoaded = async () => {
    await this.enableGradingCheck.waitFor({
      state: "visible",
    });
    await this.page.waitForLoadState("networkidle");
  };

  /**
   * Fills the grade thresholds row by row. Rows are added as needed (the app
   * requires a row to be complete before adding the next one).
   */
  setThresholds = async (thresholds: ICourseGradeSettings["thresholds"]) => {
    if (!thresholds) return;

    await this.thresholdTable.waitFor({
      state: "visible",
    });

    for (const [index, { max, grade }] of thresholds.entries()) {
      if ((await this.thresholdRows.count()) <= index) {
        await this.addAnotherBtn.click();
        await this.thresholdRows.nth(index).waitFor({
          state: "visible",
        });
      }

      const row = this.thresholdRows.nth(index);
      const maxInput = row.getByRole("spinbutton").last();
      const gradeInput = row.getByRole("textbox");

      /* Once saved, only the last row's "up to" value is editable, so a
       * locked one is left as it is. */
      if (await maxInput.isEnabled()) await maxInput.fill(String(max));
      if (await gradeInput.isEnabled()) await gradeInput.fill(grade);
    }
  };

  fill = async (payload: ICourseGradeSettings) => {
    await this.waitUntilLoaded();

    await this.enableGradingCheck.setChecked(payload.enable);

    if (payload.enable) await this.setThresholds(payload.thresholds);
  };

  /**
   * Saves the form and reports whether the app confirmed it.
   */
  save = async (): Promise<boolean> => {
    await this.saveBtn.click();
    return (await this.notificationBase.checkStatus()) === "success";
  };
}
