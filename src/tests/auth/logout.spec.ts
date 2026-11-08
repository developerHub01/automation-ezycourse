import { expect, test } from "@/fixtures";
import { authenticate } from "@/lib/auth.lib";
import { AuthRole } from "@/types/index.types";
import { Browser } from "@playwright/test";

const roles: Array<{ role: AuthRole; label: string; email: string; password: string }> = [
  {
    role: "site_owner",
    label: "Owner/admin",
    email: process.env.SITE_OWNER_EMAIL!,
    password: process.env.SITE_OWNER_PASSWORD!,
  },
  {
    role: "student",
    label: "Student",
    email: process.env.BASE_STUDENT_EMAIL!,
    password: process.env.BASE_STUDENT_PASSWORD!,
  },
];

/**
 * Logging out ends the saved session on the server, which would break every
 * other spec using it. So the session is made sure to be valid before the
 * test (re-login only if it is not) and restored after it.
 */
const ensureSession = async (browser: Browser, r: (typeof roles)[number]) => {
  /* Empty state: the role's file may not exist yet, authenticate creates it */
  const page = await browser.newPage({
    storageState: { cookies: [], origins: [] },
  });
  try {
    await authenticate({
      page,
      role: r.role,
      credentials: { email: r.email, password: r.password },
    });
  } finally {
    await page.close();
  }
};

for (const r of roles) {
  test.describe(`Logout: ${r.label}`, () => {
    /* Uses the saved session, so no login is repeated here */
    test.use({ storageState: `playwright/.auth/${r.role}.json` });

    test.beforeAll(async ({ browser }) => await ensureSession(browser, r));
    test.afterAll(async ({ browser }) => await ensureSession(browser, r));

    test(`${r.label} logs out from the dashboard`, async ({ logoutPage }) => {
      expect(
        await logoutPage.logout(),
        "Not logged in: the session could not be restored",
      ).toBeTruthy();

      await logoutPage.expectLoggedOut();
    });
  });
}
