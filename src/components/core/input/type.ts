import { HTMLInputTypeAttribute } from "react";
import { CustomClassName } from "../type";

export interface InputProps {
    id: string;
    label: string;
    placeholder?: string;
    type?: HTMLInputTypeAttribute | undefined;
    wrapperClassName?: CustomClassName;
    labelClassName?: CustomClassName;
    inputClassName?: CustomClassName;
};