"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cloneElement, Fragment, isValidElement, JSX } from "react";
import { ButtonProps } from "./type";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IntegratedButtonProps extends ButtonProps {
    prefix?: JSX.Element;
    postfix?: JSX.Element;
}

export const IntegratedButton = (props: IntegratedButtonProps) => {
    const {
        prefix,
        postfix,
        ...button
    } = props;

    const prefixProps = prefix?.props;
    const postfixProps = postfix?.props;

    const clonePrefix = button?.loading
        ? <Loader2Icon className="animate-spin" />
        : prefix && isValidElement(prefix)
            ? cloneElement(prefix, {
                ...prefixProps,
                className: cn("", prefixProps?.className)
            } as any)
            : <Fragment />;

    const clonePostfix = postfix && isValidElement(postfix)
        ? cloneElement(postfix, {
            ...postfixProps,
            className: cn("", postfixProps?.className)
        } as any)
        : <Fragment />;

    const validateFn = button?.validateFn;
    const validateIsFn = typeof validateFn === "function";

    return (
        <div className={cn("w-95 -mt-4 mb-2", button?.wrapperClassName)}>
            <Button
                id={button.id}
                type="button"
                variant={button?.variant || "outline"}
                size={button?.size}
                onClick={(event) => {
                    event.preventDefault();
                    if (typeof button?.onClick === "function"
                        && (validateIsFn && validateFn() || !validateIsFn)
                    ) {
                        button?.onClick();
                    }
                }}
                disabled={button?.disabled || button?.loading}
                className={cn("w-full cursor-pointer bg-[var(--button-primary)] border-0 hover:bg-amber-300 text-white", button?.buttonClassName)}
            >
                {clonePrefix}

                <Label
                    htmlFor={button.id}
                    className={cn("cursor-pointer", button?.labelClassName)}
                >
                    {button.label}
                </Label>

                {clonePostfix}
            </Button>
        </div>
    );
};