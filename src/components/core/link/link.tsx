"use client"

import { AppContext, AppContextProps } from "@/hooks/app-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useContext } from "react";

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

    const {
        setLoadingPage,
    } = useContext<AppContextProps>(AppContext);

    return (
        <Link
            onClick={() => {
                setLoadingPage(true);
            }}
            className={cn("", className)}
            href={href || ""}
        >{content}</Link>
    );
};