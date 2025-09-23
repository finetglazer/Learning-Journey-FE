"use client"

import { IntegratedButton, IntegratedButtonProps } from "@/components/core/button/integrated-button";
import { Divider } from "@/components/core/divider/divider";
import { IntegratedInput, IntegratedInputProps } from "@/components/core/input/integrated-input";
import { Link, LinkProps } from "@/components/core/link/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { JSX } from "react";

export interface FormLayoutProps {
    header?: {
        title?: string;
        titleClassName?: string;
    };
    body?: {
        inputs?: IntegratedInputProps[];
    };
    footer?: {
        submitButton?: IntegratedButtonProps;
        footComponent?: JSX.Element;
    };
    actions?: {
        buttons?: IntegratedButtonProps[];
    };
    divider?: {
        type: "2-line-symmetric" | "1-line" | "none";
        content?: string;
    };
};

export default function AuthFormLayout(props: FormLayoutProps) {
    const {
        header,
        body,
        footer,
        actions,
        divider,
    } = props;

    const getDivider = () => {
        switch (divider?.type) {
            case "2-line-symmetric":
                return (
                    <div className="flex items-center mb-2 ml-2">
                        <Divider />
                        <span>
                            {divider?.content || ""}
                        </span>
                        <Divider className="mr-0 ml-3" />
                    </div>
                );
            case "1-line":
                return <Divider />;
            case "none":
                return (
                    <span>{divider?.content || ""}</span>
                );
            default:
                return <></>;
        }
    };

    return (
        <Card className="max-w-175 h-120 mt-85 ml-120 grid place-items-center">
            <CardHeader className="w-full p-0 text-center">
                <CardTitle className={cn("font-bold text-[3rem] w-full", header?.titleClassName)}>{header?.title || ""}</CardTitle>
            </CardHeader>
            <CardContent className="">
                {(actions?.buttons || []).map((button: IntegratedInputProps) =>
                    <IntegratedButton {...button} />
                )}
                {getDivider()}
                {(body?.inputs || []).map((input: IntegratedInputProps) =>
                    <IntegratedInput {...input} />
                )}
            </CardContent>
            <CardFooter className="flex-col text-center">
                {footer?.submitButton ? <IntegratedButton {...footer?.submitButton} /> : null}
                {footer?.footComponent || null}
            </CardFooter>
        </Card>
    );
};