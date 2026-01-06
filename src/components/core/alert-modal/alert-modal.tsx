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
import { isNil } from "lodash";

export type AlertType = 'error' | 'warning' | 'info';

const alertConfig = {
    error: {
        title: "Error",
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
    description?: string | string[];
    proceedAnyway?: () => void;
    useCancel?: boolean;
};

export interface AlertModalProps {
    alertMessage: AlertMessage;
    onClose?: () => void;
};

const formatStringDates = (text: any) => {
    if (typeof text !== 'string') return text;
    return text.replace(/(\d{4})-(\d{2})-(\d{2})/g, '$3/$2/$1');
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

    const getDescription = () => {
        const descriptionClassName = "font-normal";
        if (isNil(alertMessage?.description)) {
            return <></>
        }
        if (typeof alertMessage?.description === "string") {
            return (
                <div className={descriptionClassName}>{formatStringDates(alertMessage?.description)}</div>
            )
        }
        if (!(alertMessage?.description || []).length) {
            const errors: any = alertMessage?.description;
            const errorDescriptions: any[] = [];
            Object.keys(errors).forEach(key => {
                errorDescriptions.push({
                    [key]: errors[key]
                });
            });
            return (errorDescriptions || []).map(descriptionItem => {
                const keys = Object.keys(descriptionItem);
                return keys.map(key => (
                    <div key={key} className="flex align-center gap-2">
                        <p className="font-bold">{key}</p>
                        <p className="font-normal">{formatStringDates(descriptionItem[key])}</p>
                    </div>
                ))
            });
        }
        return (alertMessage?.description || []).map((descriptionItem: any, index: number) => {
            return (
                <p key={index} className={descriptionClassName}>{formatStringDates(descriptionItem)}</p>
            );
        })
    };

    return (
        <AlertDialog open>
            <AlertDialogContent className="max-w-md z-[99999]">
                <AlertDialogHeader className="items-center text-center">
                    <AlertDialogTitle className={cn("font-semibold tracking-wide", config.titleColor)}>
                        {config.title}
                    </AlertDialogTitle>

                    <div className="w-1/2 border-t border-gray-200 pt-4" />

                    <AlertDialogDescription asChild className="text-slate-600 text-base font-bold text-center">
                        <div>
                            {formatStringDates(title)}
                            {description && <br />}
                            {getDescription()}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <Button
                        onClick={onClose}
                        className={cn("font-semibold cursor-pointer", (config as any)?.secondaryButtonColor || (config as any)?.buttonColor)}
                    >
                        {alertMessage?.useCancel ? "Cancel" : "Okay"}
                    </Button>
                    {proceedAnyway && (
                        <Button
                            onClick={() => {
                                proceedAnyway();
                                onClose?.();
                            }}
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