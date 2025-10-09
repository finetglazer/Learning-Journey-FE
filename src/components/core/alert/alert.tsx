import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
export interface WarningAlertDialogProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    warningMessage?: string;
    recommendActionMessage?: string;
};

export function WarningAlertDialog({ open, setOpen, warningMessage, recommendActionMessage }: WarningAlertDialogProps) {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="items-center text-center">
                    {/* Title of the alert */}
                    <AlertDialogTitle className="text-yellow-500 font-semibold tracking-wide">
                        Warning
                    </AlertDialogTitle>

                    {/* Divider line */}
                    <div className="w-1/2 border-t border-gray-200 pt-4" />

                    {/* Description message */}
                    <AlertDialogDescription className="text-slate-500 text-base text-center font-bold">
                        {warningMessage && (
                            <>
                                {warningMessage}
                                <br />
                            </>
                        )}
                        {recommendActionMessage}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-center">
                    <Button
                        onClick={() => setOpen(false)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold cursor-pointer"
                    >
                        Got it
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}