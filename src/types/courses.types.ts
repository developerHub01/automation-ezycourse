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
  assurance?:
    | {
        check: true;
        value: string;
      }
    | {
        check: false;
        value?: never;
      };
  includes: {
    showQuizzesNumberCount: boolean;
    showAssignmentsNumberCount: boolean;
    addCustomCourseIncludes?:
      | {
          check: true;
          fields: Array<string>;
        }
      | {
          check: false;
        };
  };
  learningOutcomes?:
    | {
        check: true;
        fields: Array<string>;
      }
    | {
        check: false;
      };
  faq?:
    | {
        check: true;
        fields: Array<{
          question: string;
          answer: string;
        }>;
      }
    | {
        check: false;
      };
  enableCourseReview: boolean;
  enableGifting: boolean;
}

export interface ICourseLandingPage {
  preview: number;
  hideEnrollmentCount: boolean;
  customLandingPage: null | string;
}

export interface ICourseAfterCheckoutPage {
  type: "internal" | "external";
  nameOrURL: string;
}

export type ICourseCertificationSettings =
  | {
      enable: false;
    }
  | {
      enable: true;
      certificate: string;
      switchs: {
        allowWithoutCompletion: boolean;
        displayCompletionTime: boolean;
      };
    };

export type TCourseRedirectToCheckoutPageSetting = string | null;

export interface TCourseAccessibilitySetting {
  access: TCourseAccessability;
  publish: "published" | "draft";
  presell: {
    enable: boolean;
    chargeOption: "immediate" | "later";
  };
}
