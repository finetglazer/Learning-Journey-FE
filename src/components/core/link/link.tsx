import { cn } from "@/lib/utils";

export interface LinkProps {
    href?: string;
    content?: string;
    className?: string;
};

export const Link = (props: LinkProps) => {
    const {
        href,
        content,
        className,
    } = props;

    return (
        <a href={href} className={cn("", className)}>{content}</a>
    );
};