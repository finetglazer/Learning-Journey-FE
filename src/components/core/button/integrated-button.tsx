"use client"

import { cloneElement, Fragment, JSX } from "react";
import { CustomClassName } from "../type";
import { Button } from "@/components/ui/button";
import { mergeClassNames } from "@/utils/classname-utils";
import { ButtonProps } from "./type";
import { Label } from "@/components/ui/label";

export interface IntegratedButtonProps extends ButtonProps {
    prefix?: JSX.Element;
    postfix?: JSX.Element;
    prefixClassName?: CustomClassName;
    postfixClassName?: CustomClassName;
}

export const IntegratedButton = (props: IntegratedButtonProps) => {
    const {
        prefix,
        postfix,
        prefixClassName,
        postfixClassName,
        ...button
    } = props;

    const clonePrefix = prefix
        ? cloneElement(prefix, {
            className: prefixClassName
        })
        : <Fragment />;

    const clonePostfix = postfix
        ? cloneElement(postfix, {
            className: postfixClassName
        })
        : <Fragment />;

    return (
        <div className={mergeClassNames("max-w-2xs", button?.wrapperClassName)}>
            <Button
                id={button.id}
                variant={button?.variant || "outline"}
                size={button?.size}
                onClick={button?.onClick}
                disabled={button?.disabled}
                className={mergeClassNames("w-full", button?.buttonClassName)}
            >
                {clonePrefix}

                <Label
                    htmlFor={button.id}
                    className={mergeClassNames("", button?.labelClassName)}
                >
                    {button.label}
                </Label>

                {clonePostfix}
            </Button>
        </div>
    );
};