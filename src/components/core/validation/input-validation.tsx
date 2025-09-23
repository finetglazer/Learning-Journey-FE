import { cloneElement, Fragment, isValidElement, JSX } from "react";
import { ValidationProps, ValidationType } from "./type";
import { BadgeInfoIcon, CircleAlertIcon, TriangleAlertIcon } from "lucide-react";
import { classNames, cn } from "@/lib/utils";

export interface InputValidationProps extends ValidationProps {
    prefix?: JSX.Element
};

const renderDefaultPrefix = (type: ValidationType) => {
    switch (type) {
        case "error":
            return (
                <CircleAlertIcon color="white" size={14} fill={"red"} />
            );
        case "warning":
            return (
                <TriangleAlertIcon color="white" size={14} fill={"orange"} />
            );
        case "info":
            return (
                <BadgeInfoIcon color="white" size={14} fill={"blue"} />
            );
        default:
            return <Fragment />
    }
};

const getMessageStyle = (type: ValidationType) => {
    switch (type) {
        case "error":
            return "text-red-600";
        case "warning":
            return "text-yellow-600";
        case "info":
            return "text-blue-600";
        default:
            return "";
    }
};

export const InputValidation = (props: InputValidationProps) => {
    const {
        prefix,
        ...inputValidation
    } = props;

    const prefixProps = prefix?.props;

    const clonePrefix = prefix && isValidElement(prefix)
        ? cloneElement(prefix, {
            ...prefixProps,
            className: cn("", prefixProps?.className)
        } as any)
        : null;

    return (
        <div className={cn("w-full flex justify-end mt-0", inputValidation?.wrapperClassName)}>
            <div className="flex items-center">
                {clonePrefix || renderDefaultPrefix(inputValidation?.type || "error")}

                <span className={cn(
                    classNames(getMessageStyle(inputValidation?.type || "error"), "ml-0.5 -mt-1 text-[0.8rem]"),
                    inputValidation?.messageClassName)}
                >
                    {inputValidation?.message}
                </span>
            </div>
        </div>
    );
};