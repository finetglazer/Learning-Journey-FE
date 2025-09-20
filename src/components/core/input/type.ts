import { HTMLInputTypeAttribute } from "react";
import { ValidationType } from "../validation/type";

export interface InputProps {
    id: string;
    label: string;
    placeholder?: string;
    type?: HTMLInputTypeAttribute | undefined;
    required?: boolean;
    wrapperClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    validationType?: ValidationType;
    validationMessage?: string;
};