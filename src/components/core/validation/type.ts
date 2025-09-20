export type ValidationType = "error" | "warning" | "info";

export interface ValidationProps {
    type: ValidationType;
    message?: string;
    wrapperClassName?: string;
    messageClassName?: string;
};