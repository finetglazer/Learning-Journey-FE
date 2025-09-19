import { CustomClassName } from "../type";

export interface ButtonProps {
    id: string;
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline" | "link" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    loading?: boolean;
    disabled?: boolean;
    wrapperClassName?: CustomClassName;
    buttonClassName?: CustomClassName;
    labelClassName?: CustomClassName;
    onClick?: () => void;
}