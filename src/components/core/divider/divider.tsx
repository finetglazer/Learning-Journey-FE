import { cn } from "@/lib/utils";

export interface DividerProps {
    className?: string;
};

export const Divider = (props: DividerProps) => {
    const {
        className,
    } = props;

    return (
        <div className={cn("h-[0.5px] w-40 border-gray-200 border mr-3", className)} />
    );
};