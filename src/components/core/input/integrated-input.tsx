"use client"

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import _ from "lodash";
import { cloneElement, Fragment, isValidElement, JSX } from "react";
import { PasswordStrengthIndicator } from "../password-strength-indicator/password-strength-indicator";
import { InputValidation } from "../validation/input-validation";
import { InputProps } from "./type";
import { Tooltip } from "antd";

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

    const inputElement = (
        <Input
            id={input.id}
            className={cn("pl-10", (input.model?.errors || {})[input.fieldName] ? "border-red-500 border" : "", input?.inputClassName)}
            type={input?.type || "text"}
            placeholder={input?.placeholder}
            onChange={(event) => {
                input.updateModel(
                    input.fieldName,
                    event.target.value
                )
            }}
            value={(input.model as any)[input.fieldName] || ""}
            disabled={input?.disabled || false}
        />
    );

    return (
        <div className={cn("grid w-full max-w-sm items-center relative gap-3", input?.wrapperClassName)}>
            <Label htmlFor={input.id}>
                <span className={input?.labelClassName || ""}>{input?.label || ""}</span>
                {input?.required ? <span className="text-red-600">*</span> : null}
            </Label>
            <div className="relative">
                {clonePrefix}
                {input?.type !== "password"
                    ? (
                        <Tooltip
                            placement="top"
                            title={(input.model as any)[input.fieldName] || ""}
                        >
                            {inputElement}
                        </Tooltip>
                    ) : inputElement}

                {input?.type !== "password" ? clonePostfix : null}
            </div>
            <div className={`flex items-center ${passwordStrengthIndicator ? 'justify-between' : 'justify-end'} -mt-1`}>
                {!_.isNil(passwordStrengthIndicator?.currentPassword) &&
                    !_.isNil(passwordStrengthIndicator?.categoryNumber) &&
                    !_.isNil(passwordStrengthIndicator?.minimumSatisfiedCategories) ?
                    (
                        <PasswordStrengthIndicator
                            currentPassword={passwordStrengthIndicator?.currentPassword}
                            categoryNumber={passwordStrengthIndicator?.categoryNumber}
                            minimumSatisfiedCategories={passwordStrengthIndicator?.minimumSatisfiedCategories}
                        />
                    ) : <div />}
                <div className="flex-col justify-between relative">
                    {(input.model?.errors || {})[input.fieldName] ? (
                        <InputValidation
                            {...inputValidation}
                            message={(input.model?.errors || {})[input.fieldName]}
                        />
                    ) : null}
                    {input?.extraComponent || null}
                </div>
            </div>
        </div>
    );
};