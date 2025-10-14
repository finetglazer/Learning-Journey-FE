"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AlertType = 'danger' | 'warning' | 'info';

const alertConfig = {
    danger: {
        title: "Danger",
        titleColor: "text-red-500",
        buttonColor: "bg-red-500 hover:bg-red-600 text-white",
    },
    warning: {
        title: "Warning",
        titleColor: "text-yellow-500",

        // For the "Process anyway" button
        primaryButtonColor: "bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold",

        // For the "Got it" or "Cancel" button
        secondaryButtonColor: "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold",
    },
    info: {
        title: "Information",
        titleColor: "text-blue-500",
        buttonColor: "bg-blue-500 hover:bg-blue-600 text-white",
    },
};

export interface AlertMessage {
    type: AlertType;
    title?: string;
    description?: string;
    proceedAnyway?: () => void;
};

export interface AlertModalProps {
    alertMessage: AlertMessage;
    onClose?: () => void;
};

export function AlertModal({
    alertMessage,
    onClose,
}: AlertModalProps) {

    const {
        type,
        title,
        description,
        proceedAnyway,
    } = alertMessage;

    const config = alertConfig[type] || alertConfig.info;

    return (
        <AlertDialog open>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="items-center text-center">
                    <AlertDialogTitle className={cn("font-semibold tracking-wide", config.titleColor)}>
                        {config.title}
                    </AlertDialogTitle>

                    <div className="w-1/2 border-t border-gray-200 pt-4" />

                    <AlertDialogDescription className="text-slate-600 text-base font-bold text-center">
                        {title}
                        {description && <br />}
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <Button
                        onClick={onClose}
                        className={cn("font-semibold cursor-pointer", (config as any)?.secondaryButtonColor || (config as any)?.buttonColor)}
                    >
                        Got it
                    </Button>
                    {proceedAnyway && (
                        <Button
                            onClick={onClose}
                            className={cn("font-semibold cursor-pointer", (config as any)?.primaryButtonColor || (config as any)?.buttonColor)}
                        >
                            Proceed anyway
                        </Button>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}