export interface ICourseBasicInfo {
  name: string;
  shortDescription: string;
  description: string;
  previewType?: "image" | "video";
  publishingStatus?: "published" | "draft";
  isHideEnrollmentCount?: boolean;
  category?: Array<string> | string;
}
