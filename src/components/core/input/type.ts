import { HTMLInputTypeAttribute, JSX } from "react";
import { PasswordStrenghtIndicatorProps } from "../password-strength-indicator/password-strength-indicator";
import { InputValidationProps } from "../validation/input-validation";
import { Model } from "react-3layer-common";

export interface InputProps {
    id: string;
    fieldName: string;
    model: Model;
    updateModel: (fieldName: string, value: any) => void;
    label?: string;
    placeholder?: string;
    type?: HTMLInputTypeAttribute | undefined;
    required?: boolean;
    disabled?: boolean;
    wrapperClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    inputValidation?: InputValidationProps;
    passwordStrengthIndicator?: PasswordStrenghtIndicatorProps;
    extraComponent?: JSX.Element;
};