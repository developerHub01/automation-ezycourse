import { test as setup } from "@playwright/test";
import { authenticate } from "@/lib/auth.lib";

setup("authenticate site onwer", async ({ page }) => {
  await authenticate({
    page,
    role: "site_owner",
    credentials: {
      email: process.env.SITE_OWNER_EMAIL!,
      password: process.env.SITE_OWNER_PASSWORD!,
    },
  });
});
