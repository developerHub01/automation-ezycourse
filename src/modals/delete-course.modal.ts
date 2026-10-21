import { Locator, Page } from "@playwright/test";
import { ModalBase } from "@/modals/modal.base";

export class DeleteCourseModal extends ModalBase {
  readonly bodyContent: Locator;
  readonly courseIdLocator: Locator;
  readonly deleteCommandLocator: Locator;
  readonly deleteInput: Locator;
  readonly cancelBtn: Locator;
  readonly deleteBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.bodyContent = this.body.locator("> div");
    this.courseIdLocator = this.bodyContent
      .getByRole("paragraph")
      .getByRole("strong")
      .first();
    this.deleteCommandLocator = this.bodyContent
      .getByRole("paragraph")
      .getByRole("strong")
      .last();

    this.deleteInput = this.bodyContent.getByRole("textbox");

    this.cancelBtn = this.footer.getByRole("button", {
      name: "Cancel",
    });
    this.deleteBtn = this.footer.getByRole("button", {
      name: "Delete",
    });
  }

  cancel = async () => await this.cancelBtn.click();

  delete = async (id?: number): Promise<boolean> => {
    try {
      await this.modal.waitFor({
        state: "attached",
      });

      if (id) {
        const courseId = await this.courseIdLocator.innerText();
        console.log({
          id,
          courseId,
        });
        if (id !== Number(courseId)) throw new Error("id not matched");
      }

      const deleteComamnd = (
        await this.deleteCommandLocator.innerText()
      ).trim();
      console.log({
        deleteComamnd,
      });
      await this.deleteInput.fill(deleteComamnd);

      await this.deleteBtn.click();
      await this.modal.waitFor({
        state: "detached",
      });

      return true;
    } catch (error) {
      return false;
    }
  };
}
