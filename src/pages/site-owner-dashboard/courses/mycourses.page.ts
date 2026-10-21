import { DropdownComponent } from "@/components/dropdown-menu.component";
import { DeleteCourseModal } from "@/modals/delete-course.modal";
import { NotificationBase } from "@/notifications/notification.base";
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

  /**
   * Footer
   */
  readonly tableFooter: Locator;
  readonly tablePagination: Locator;
  readonly pageTotal: Locator;
  readonly pagePrev: Locator;
  readonly pageNext: Locator;
  readonly pageOptions: Locator;
  readonly pageOptionSelector: Locator;
  readonly pageOptionInput: Locator;
  readonly pageOptionsListbox: Locator;
  readonly pageOptionsListItem: Locator;

  readonly dropdownComponent: DropdownComponent;
  readonly deleteCourseModal: DeleteCourseModal;
  readonly notificationBase: NotificationBase;

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
    this.tableFooter = this.tableWrapper.locator(".ant-table-footer");
    this.tablePagination = this.tableFooter.locator(".ant-pagination");
    this.pageTotal = this.tablePagination.locator(".ant-pagination-total-text");
    this.pagePrev = this.tablePagination.locator(".ant-pagination-prev");
    this.pageNext = this.tablePagination.locator(".ant-pagination-next");
    this.pageOptions = this.tablePagination.locator(".ant-pagination-options");
    this.pageOptionSelector = this.pageOptions.locator(".ant-select-selector");
    this.pageOptionInput = this.pageOptionSelector.getByRole("combobox", {
      name: "Page Size",
    });
    this.pageOptionsListbox = this.pageOptions.locator(
      ".ant-select-dropdown .rc-virtual-list-holder-inner",
    );
    this.pageOptionsListItem = this.pageOptionsListbox.locator(
      ".ant-select-item-option",
    );

    /**
     *  dropdown menu
     */
    this.dropdownComponent = new DropdownComponent(this.page);
    this.deleteCourseModal = new DeleteCourseModal(this.page);
    this.notificationBase = new NotificationBase(this.page);
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

  /*  5 | 10 | 15 | 20 | 30 | 50 */
  changePageSize = async (size: number) => {
    const paginationText = `${size} / page`;

    let ariaExpanded = await this.pageOptionInput.getAttribute("aria-expanded");
    if (ariaExpanded !== "true") await this.pageOptionSelector.click();

    await this.pageOptionsListbox.waitFor({
      state: "visible",
    });

    await this.pageOptionsListItem
      .filter({
        has: this.page.getByText(paginationText, {
          exact: true,
        }),
      })
      // .and(this.page.locator(`[aria-selected="false"]`))
      .click();

    await this.pageOptionSelector.getByText(paginationText).waitFor({
      state: "visible",
    });

    // ariaExpanded = await this.pageOptionInput.getAttribute("aria-expanded");
    // if (ariaExpanded === "true") await this.pageOptionSelector.click();
  };

  delete = async (id: number): Promise<boolean> => {
    const row = await this.getRowById(id);

    if (!row || !(await row.count())) return false;
    const actionBtn = this.getActionBtn(row);

    await actionBtn.click();
    await this.dropdownComponent.selectAction("Delete");
    await this.deleteCourseModal.delete();

    const status = await this.notificationBase.checkStatus();
    return status === "success";
  };

  searchAllOverAndDoAction = async ({
    ids,
    pageSize = 50,
    callback,
  }: {
    ids: Array<number>;
    pageSize?: 5 | 10 | 15 | 20 | 30 | 50;
    callback: (id: number) => Promise<boolean>;
  }) => {
    const remainIds = new Set([...ids]);
    if (!remainIds.size) return;

    await this.changePageSize(pageSize);

    const searchEachPage = async () => {
      if (!remainIds.size || (await this.pageNext.isDisabled())) return;

      const completedId: Array<number> = [];
      for (const id of [...remainIds]) {
        const isDeleted = await callback(id);
        if (isDeleted) completedId.push(id);
      }

      completedId.forEach((id) => remainIds.delete(id));
      await this.pageNext.click();
      await searchEachPage();
    };

    await searchEachPage();
  };

  searchAllOverAndDelete = async ({
    ids,
    pageSize = 10,
  }: {
    ids: Array<number>;
    pageSize?: 5 | 10 | 15 | 20 | 30 | 50;
  }) =>
    await this.searchAllOverAndDoAction({
      ids,
      pageSize,
      callback: async (id) => await this.delete(id),
    });
}
