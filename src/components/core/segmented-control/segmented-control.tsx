import { CALENDAR_VIEW_OPTIONS } from "@/const/consts";
import { cn } from "@/lib/utils";

export interface SegmentedControlProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}

export const SegmentedControl = (props: SegmentedControlProps) => {
    const { value, onValueChange, className } = props;

    const getLabel = (key: string) => {
        switch (key) {
            case "day":
                return "Day";
            case "week":
                return "Week";
            case "month-view":
                return "Month view";
            case "year":
                return "Year";
            default:
                return "";
        }
    };

    return (
        <div
            className={cn(
                "inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-0.5 shadow-sm",
                className
            )}
            role="group"
        >
            {CALENDAR_VIEW_OPTIONS.map((option, index) => {
                const isActive = value === option;

                return (
                    <button
                        key={"calendar-".concat(option).concat("-mode")}
                        onClick={() => onValueChange(option)}
                        className={cn(
                            "px-5 py-2 text-sm font-semibold transition-colors duration-200 ease-in-out",
                            index > 0 && "border-l border-gray-200",
                            "first:rounded-l-full last:rounded-r-full",
                            isActive
                                ? "text-amber-500 font-bold"
                                : "text-slate-500 hover:bg-gray-50",
                            "hover:cursor-pointer"
                        )}
                    >
                        {getLabel(option)}
                    </button>
                );
            })}
        </div>
    );
};