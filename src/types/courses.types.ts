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

export interface IBundleCourseBasicInfo extends Omit<
  ICourseBasicInfo,
  "subCategory"
> {}

export type TCoursePaymentMethod =
  "stripe" | "fastspring" | "razopay" | "manual" | "mercadopago";

export interface ICourseAdvanceInfo {
  language: string;
  duration: number;
  paymentMethods: Array<TCoursePaymentMethod> | "all";
  level?: "beginner" | "intermediate" | "advanced";
  assurance?: string;
  includes: {
    showQuizzesNumberCount: boolean;
    showAssignmentsNumberCount: boolean;
    addCustomCourseIncludes?: Array<string>;
  };
  learningOutcomes?: Array<string>;
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  enableCourseReview: boolean;
  enableGifting: boolean;
}
