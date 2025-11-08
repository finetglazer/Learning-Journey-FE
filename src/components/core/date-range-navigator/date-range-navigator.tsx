import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IntegratedButton } from "../button/integrated-button";

export interface DateRangeNavigatorProps {
    dateRangeLabel: string;
    onPreviousClick?: () => void;
    onNextClick?: () => void;
    isPreviousDisabled?: boolean;
    isNextDisabled?: boolean;
    wrapperClassName?: string;
}

export const DateRangeNavigator = (props: DateRangeNavigatorProps) => {
    const {
        dateRangeLabel,
        onPreviousClick,
        onNextClick,
        isPreviousDisabled = false,
        isNextDisabled = false,
        wrapperClassName,
    } = props;

    return (
        <div className={cn("flex items-center justify-center space-x-4", wrapperClassName)}>
            {/* Previous Button */}
            <IntegratedButton
                id={"prev-btn"}
                onClick={onPreviousClick}
                disabled={isPreviousDisabled}
                wrapperClassName="w-auto m-0"
                buttonClassName={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    "border border-gray-200 bg-white shadow-sm",
                    "transition-colors duration-200 ease-in-out",
                    "active:scale-95",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                )}
                prefix={<ChevronLeft className="h-5 w-5 text-slate-600" />}
            />

            {/* Date Range Label */}
            <span className="w-50 text-center text-base font-semibold text-slate-700 truncate">
                {dateRangeLabel}
            </span>

            {/* Next Button */}
            <IntegratedButton
                id={"next-btn"}
                onClick={onNextClick}
                disabled={isNextDisabled}
                wrapperClassName="w-auto m-0"
                buttonClassName={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    "border border-gray-200 bg-white shadow-sm",
                    "transition-colors duration-200 ease-in-out",
                    "active:scale-95",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                )}
                prefix={<ChevronRight className="h-5 w-5 text-slate-600" />}
            />
        </div>
    );
};