import { HTMLInputTypeAttribute, JSX } from "react";
import { ValidationType } from "../validation/type";
import { PasswordStrenghtIndicatorProps } from "../password-strength-indicator/password-strength-indicator";
import { InputValidationProps } from "../validation/input-validation";

export interface InputProps {
    id: string;
    label?: string;
    placeholder?: string;
    type?: HTMLInputTypeAttribute | undefined;
    required?: boolean;
    wrapperClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    inputValidation?: InputValidationProps;
    passwordStrengthIndicator?: PasswordStrenghtIndicatorProps;
    extraComponent?: JSX.Element;
};