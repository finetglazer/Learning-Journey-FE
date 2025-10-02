import { cn } from "@/lib/utils";

export interface SegmentedControlOption {
    label: string;
    value: string;
}

export interface SegmentedControlProps {
    options: SegmentedControlOption[];
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}

export const SegmentedControl = (props: SegmentedControlProps) => {
    const { options, value, onValueChange, className } = props;

    return (
        <div
            className={cn(
                "inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-0.5 shadow-sm",
                className
            )}
            role="group"
        >
            {options.map((option, index) => {
                const isActive = value === option.value;

                return (
                    <button
                        key={option.value}
                        onClick={() => onValueChange(option.value)}
                        className={cn(
                            "px-5 py-2 text-sm font-semibold transition-colors duration-200 ease-in-out",
                            index > 0 && "border-l border-gray-200",
                            "first:rounded-l-full last:rounded-r-full",
                            isActive
                                ? "text-slate-800 font-bold"
                                : "text-slate-500 hover:bg-gray-50",
                            "hover:cursor-pointer"
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};