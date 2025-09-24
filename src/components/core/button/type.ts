import { Model } from "react-3layer-common";
import { Observable } from "rxjs";

export interface ButtonProps {
    id: string;
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline" | "link" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    loading?: boolean;
    disabled?: boolean;
    wrapperClassName?: string;
    buttonClassName?: string;
    labelClassName?: string;
    onClick?: (form?: Model) => void;
}