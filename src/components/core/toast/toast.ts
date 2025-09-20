"use client"

import { toast } from "sonner";

export interface ToastActionProps {
    label: string;
    onClick: () => void;
};

export interface ToastWithActionProps {
    action: ToastActionProps;
    title?: string;
    description?: string;
    descriptionClassName?: string;
};

export const toastWithAction = (props: ToastWithActionProps) => {
    const {
        title,
        description,
        action,
        descriptionClassName,
    } = props;

    toast(title, {
        description,
        action,
        classNames: {
            description: descriptionClassName,
        },
    })
};