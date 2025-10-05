import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function WarningAlertDialog() {
    return (
        // The `defaultOpen` prop makes the dialog visible by default when the component is rendered.
        <AlertDialog defaultOpen>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="items-center text-center">
                    {/* Title of the alert */}
                    <AlertDialogTitle className="text-yellow-500 font-semibold tracking-wide">
                        Warning
                    </AlertDialogTitle>

                    {/* Divider line */}
                    <div className="w-1/2 border-t border-gray-200 pt-4" />

                    {/* Description message */}
                    <AlertDialogDescription className="!mt-4 text-slate-500 text-base">
                        Your date you pick is out of the time range of the month!
                        <br />
                        Please choose the another date
                    </AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    )
}