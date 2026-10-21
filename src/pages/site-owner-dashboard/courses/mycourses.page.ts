import { DropdownComponent } from "@/components/dropdown-menu.component";
import { Locator, Page } from "@playwright/test";

export class DashboardMyCoursesPage {
  readonly page: Page;

  readonly url = "/dashboard/mycourses/";

  /****
   *  All courses
   */
  readonly allCoursesHeading: Locator;
  readonly addCourseButton: Locator;

  /**
   *  Table wrapper
   */
  readonly tableWrapper: Locator;
  readonly tableMain: Locator;
  readonly tableHead: Locator;
  readonly tableHeadItem: Locator;

  readonly tableBody: Locator;
  readonly tableRow: Locator;

  readonly tableFooter: Locator;

  readonly dropdownComponent: DropdownComponent;

  constructor(page: Page) {
    this.page = page;

    /***
     * All courses page
     */
    this.allCoursesHeading = this.page.getByRole("heading", {
      name: "All Courses",
      exact: true,
      level: 1,
    });
    this.addCourseButton = this.page.getByRole("button", {
      name: "Add Course",
      exact: true,
    });

    /***
     * ===============
     *  Table
     * ===============
     */
    this.tableWrapper = this.page.locator(".ant-table-wrapper").first();
    this.tableMain = this.tableWrapper
      .locator(".ant-table-content")
      .getByRole("table")
      .first();
    /***
     *  Table header
     */
    this.tableHead = this.tableMain.locator("thead.ant-table-thead").first();
    this.tableHeadItem = this.tableHead.locator("th");
    /***
     *  Table body
     */
    this.tableBody = this.tableMain.locator("tbody.ant-table-tbody");
    this.tableRow = this.tableBody.locator("tr");

    /***
     *  Table footer
     */
    this.tableFooter = this.tableMain.locator(".ant-table-footer");

    /**
     *  dropdown menu
     */
    this.dropdownComponent = new DropdownComponent(this.page);
  }

  goto = async () => await this.page.goto(this.url);

  getTableAllColHead = async (): Promise<Array<string>> =>
    await this.tableHeadItem.allTextContents();

  getColIndexByName = async (name: string): Promise<number> =>
    (await this.getTableAllColHead()).findIndex(
      (item) => item.toLowerCase() === name.toLowerCase(),
    );

  getRowById = async (id: number): Promise<Locator | null> => {
    const idIndex = await this.getColIndexByName("id");
    if (idIndex < 0) return null;
    return this.tableRow.and(this.page.locator(`tr[data-row-key="${id}"]`));
  };

  getRowSpecificColName = async ({
    colName,
    value,
  }: {
    colName: string;
    value: string;
  }): Promise<Locator | null> => {
    const idIndex = await this.getColIndexByName(colName);
    if (idIndex < 0) return null;
    return this.tableRow.filter({
      has: this.page.locator("td").nth(idIndex).getByText(value),
    });
  };

  getActionBtn = (locator: Locator): Locator =>
    locator
      .filter({
        has: this.page.locator("td").last().locator(".ant-dropdown-trigger"),
      })
      .locator(".ant-dropdown-trigger");

  delete = async (id: number) => {
    const row = await this.getRowById(id);

    if (!row || !(await row.count())) return;
    const actionBtn = this.getActionBtn(row);

    console.log({
      actionBtnCnt: await actionBtn.count(),
      actionBtnInnerHTML: await actionBtn.innerHTML(),
    });

    await actionBtn.click();
    await this.dropdownComponent.selectAction("Delete");
  };
}
