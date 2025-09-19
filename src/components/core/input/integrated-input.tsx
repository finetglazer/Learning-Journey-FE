"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputProps } from "./type";
import { cloneElement, Fragment, JSX } from "react";
import { CustomClassName } from "../type";
import { mergeClassNames } from "@/utils/classname-utils";

export interface IntegratedInputProps extends InputProps {
    prefix?: JSX.Element;
    postfix?: JSX.Element;
    prefixClassName?: CustomClassName;
    postfixClassName?: CustomClassName;
};

export const IntegratedInput = (props: IntegratedInputProps) => {
    const {
        prefix,
        postfix,
        prefixClassName,
        postfixClassName,
        ...input
    } = props;

    const clonePrefix = prefix
        ? cloneElement(prefix, {
            className: mergeClassNames("absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground", prefixClassName)
        })
        : <Fragment />;

    const clonePostfix = postfix
        ? cloneElement(postfix, {
            className: mergeClassNames("absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground", postfixClassName)
        })
        : <Fragment />;

    return (
        <div className={mergeClassNames("grid w-full max-w-sm items-center gap-3", input?.wrapperClassName)}>
            <Label htmlFor={input.id}>{input.label}</Label>
            <div className="relative">

                {clonePrefix}

                <Input
                    id={input.id}
                    type={input?.type || "text"}
                    placeholder={input?.placeholder}
                    className={mergeClassNames("pl-10", input?.inputClassName)}
                />

                {input?.type !== "password" ? clonePostfix : null}

            </div>
        </div>
    );
};