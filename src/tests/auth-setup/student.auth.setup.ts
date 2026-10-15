import { test as setup } from "@playwright/test";
import { authenticate } from "@/lib/auth.lib";

setup("authenticate student", async ({ page }) => {
  await authenticate({
    page,
    role: "student",
    credentials: {
      email: process.env.BASE_STUDENT_EMAIL!,
      password: process.env.BASE_STUDENT_PASSWORD!,
    },
  });
});
