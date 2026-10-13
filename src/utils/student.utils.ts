import { customAlphabet } from "nanoid";
import { IStudentBasic } from "@/types/student.types";

const generateNameId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 8);
const generateEmailId = customAlphabet(
  "abcdefghijklmnopqrstuvwxyz0123456789",
  5,
);

export const generateStudent = (
  payload?: Partial<IStudentBasic>,
): IStudentBasic => ({
  firstName: payload?.firstName ?? "Shakil",
  lastName: payload?.lastName ?? generateNameId(),
  email: payload?.email ?? `student-${generateEmailId()}@gmail.com`,
  password: payload?.password ?? "123456",
});
