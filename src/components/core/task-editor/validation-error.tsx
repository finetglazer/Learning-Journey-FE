import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CircleAlertIcon } from "lucide-react";

export interface ValidationErrorProps {
    tooltip?: string;
};

export const ValidationError = ({ tooltip }: ValidationErrorProps) => {
    return (
        <Tooltip>
            <TooltipTrigger>
                <CircleAlertIcon color="white" size={18} fill={"red"} />
            </TooltipTrigger>
            {tooltip && (
                <TooltipContent className={cn("z-[99999]")}>
                    <p>{tooltip}</p>
                </TooltipContent>
            )}
        </Tooltip>
    )
};