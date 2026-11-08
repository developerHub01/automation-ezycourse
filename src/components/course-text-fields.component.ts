import { Locator, Page } from "@playwright/test";

/**
 * Course name, short description and rich-text description. Shared by the
 * create form and the Basic Information settings.
 *
 * @param root the form that contains the fields.
 */
export class CourseTextFieldsComponent {
  readonly page: Page;

  readonly name: Locator;
  readonly shortDescription: Locator;
  readonly description: Locator;

  constructor(page: Page, root: Locator) {
    this.page = page;

    this.name = root.locator("#title");
    this.shortDescription = root.locator("#short_description");
    this.description = root.locator(`[contenteditable="true"]`).first();
  }

  fill = async ({
    name,
    shortDescription,
    description,
  }: {
    name?: string;
    shortDescription?: string;
    description?: string;
  }) => {
    if (name) await this.name.fill(name);
    if (shortDescription) await this.shortDescription.fill(shortDescription);
    if (description) await this.description.fill(description);
  };
}
