import { cn } from "@/lib/utils";
import { IconProps } from "./type";
import { iconCollection } from "@/components/core/icons";

export const Icon = ({ name, className, ...props }: IconProps) => {
    const IconComponent = iconCollection[name];

    if (!IconComponent) {
        return null;
    }
    return (
        <IconComponent name={name} className={cn('', className)} {...props} />
    );
};