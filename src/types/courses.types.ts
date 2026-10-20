export interface ICourseBasicInfo {
  name: string;
  shortDescription: string;
  description: string;
  previewType?: "image" | "video";
  publishingStatus?: "published" | "draft";
  isHideEnrollmentCount?: boolean;
  category?: Array<string> | string;
  subCategory?: Array<string> | string;
}

export type TCourseAccessability =
  "public" | "private" | "hidden" | "restricted";

export interface ISingleCourseBasicInfo extends ICourseBasicInfo {
  access?: TCourseAccessability;
  motivationalPopup?: boolean;
  enableLimitEnrollment?: boolean;
  enrollmentLimit?: number;
}
