import { PackageOpen } from "lucide-react"

export interface EmptyDataProps {
    title: string;
    message?: string;
};

export const EmptyData = ({
    title,
    message,
}: EmptyDataProps) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-3 mt-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <PackageOpen className="h-8 w-8 text-slate-400" />
            </div>
            <div className="space-y-1">
                <h3 className="text-lg font-medium text-slate-900 text-center">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto text-center">
                    {message}
                </p>
            </div>
        </div>
    )
}