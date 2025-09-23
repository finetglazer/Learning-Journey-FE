"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cloneElement, Fragment, isValidElement, JSX } from "react";
import { InputProps } from "./type";
import { cn } from "@/lib/utils";
import { InputValidation } from "../validation/input-validation";
import { PasswordStrengthIndicator } from "../password-strength-indicator/password-strength-indicator";
import _ from "lodash";

export interface IntegratedInputProps extends InputProps {
    prefix?: JSX.Element;
    postfix?: JSX.Element;
};

export const IntegratedInput = (props: IntegratedInputProps) => {
    const {
        prefix,
        postfix,
        ...input
    } = props;

    const prefixProps = prefix?.props;
    const postfixProps = postfix?.props;

    const clonePrefix = prefix && isValidElement(prefix)
        ? cloneElement(prefix, {
            ...prefixProps,
            className: cn("absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground", prefixProps?.className)
        } as any)
        : <Fragment />;

    const clonePostfix = postfix && isValidElement(postfix)
        ? cloneElement(postfix, {
            ...postfixProps,
            className: cn("absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground", postfixProps?.className)
        } as any)
        : <Fragment />;

    const passwordStrengthIndicator = input?.passwordStrengthIndicator;
    const inputValidation = input?.inputValidation;

    return (
        <div className={cn("grid w-full max-w-sm items-center relative gap-3", input?.wrapperClassName)}>
            <Label htmlFor={input.id}>
                <span>{input.label}</span>
                {input?.required ? <span className="text-red-600">*</span> : null}
            </Label>
            <div className="relative">
                {clonePrefix}

                <Input
                    id={input.id}
                    type={input?.type || "text"}
                    placeholder={input?.placeholder}
                    className={cn("pl-10", input?.inputClassName)}
                />

                {input?.type !== "password" ? clonePostfix : null}
            </div>
            <div className="flex items-center justify-between -mt-1">
                {!_.isNil(passwordStrengthIndicator?.currentSatisfiedCategoriesNumber) &&
                !_.isNil(passwordStrengthIndicator?.categoryNumber) &&
                !_.isNil(passwordStrengthIndicator?.minimumSatisfiedCategories) ?
                (
                    <PasswordStrengthIndicator
                        currentSatisfiedCategoriesNumber={passwordStrengthIndicator?.currentSatisfiedCategoriesNumber}
                        categoryNumber={passwordStrengthIndicator?.categoryNumber}
                        minimumSatisfiedCategories={passwordStrengthIndicator?.minimumSatisfiedCategories}
                    />
                ) : null}
                <div className="flex-col justify-between relative">
                    {inputValidation?.message ? (
                        <InputValidation {...inputValidation} />
                    ) : null}
                    {input?.extraComponent || null}
                </div>
            </div>
        </div>
    );
};