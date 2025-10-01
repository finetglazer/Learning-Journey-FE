import { CSSProperties, Dispatch, SetStateAction } from "react";

export interface DropdownProps {
    selectedItem: DropdownItem | null;
    setSelectedItem: Dispatch<SetStateAction<DropdownItem | null>>;
    trigger?: "click" | "hover";
    prefix?: JSX.Element;
    open?: boolean;
    label?: string;
    labelClassName?: string;
    onOpenChange?: () => void;
    useSearch?: boolean;
    searchPlaceholder?: string;
    searchStyle?: CSSProperties;
    popupStyle?: CSSProperties;
    menuStyle?: CSSProperties;
    menuItemStyle?: CSSProperties;
    chevronClassName?: string;
    buttonClassName?: string;
    buttonLabelClassName?: string;
};

export interface DropdownItem {
    id: string;
    content?: string;
};