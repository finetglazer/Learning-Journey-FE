import { cn } from "@/lib/utils";
import Link from "next/link";

export interface LinkWithLoadingProps {
    href?: string;
    content?: string;
    className?: string;
};

export const LinkWithLoading = (props: LinkWithLoadingProps) => {
    const {
        href,
        content,
        className,
    } = props;

    return (
        <Link href={href || ""} className={cn("", className)}>{content}</Link>
    );
};