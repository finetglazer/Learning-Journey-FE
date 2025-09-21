import { HTMLInputTypeAttribute } from "react";
import { ValidationType } from "../validation/type";
import { PasswordStrenghtIndicatorProps } from "../password-strength-indicator/password-strength-indicator";

export interface InputProps {
    id: string;
    label: string;
    placeholder?: string;
    type?: HTMLInputTypeAttribute | undefined;
    required?: boolean;
    wrapperClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    validationError?: string;
    validationType?: ValidationType;
    validationMessage?: string;
    passwordStrengthIndicator?: PasswordStrenghtIndicatorProps;
};