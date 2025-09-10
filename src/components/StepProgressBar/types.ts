export enum StepStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  SUCCESS = "success",
}

export type StepProgressBarProperties =
  | {
      steps: { title: string; status: StepStatus }[];
      currentStep?: never;
    }
  | {
      steps: { title: string; status?: never }[];
      currentStep: number;
    };

export interface StepItem {
  title: string;
  status?: StepStatus;
}
