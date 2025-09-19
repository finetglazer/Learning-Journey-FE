import { CustomClassName } from "@/components/core/type";
import { cn } from "@/lib/utils";

export const mergeClassNames = (firstClassName?: string, secondClassName?: CustomClassName) => {
    if (secondClassName?.override) {
        return secondClassName?.override;
    }
    if (secondClassName?.merge) {
        return cn(firstClassName || "", secondClassName?.merge);
    }
    return firstClassName || "";
};