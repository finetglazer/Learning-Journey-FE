"use client"

import { IntegratedButton, IntegratedButtonProps } from "@/components/core/button/integrated-button";
import { IntegratedInput, IntegratedInputProps } from "@/components/core/input/integrated-input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
                    <div className="flex items-center">
                        <Separator />
                        <span>
                            {divider?.content || ""}
                        </span>
                        <Separator />
                    </div>
                );
            case "1-line":
                return <Separator />;
            case "none":
                return (
                    <span>{divider?.content || ""}</span>
                );
            default:
                return <></>;
        }
    };

    return (
        <Card className="w-50">
            <CardHeader>
                <CardTitle className={cn("", header?.titleClassName)}>{header?.title || ""}</CardTitle>
            </CardHeader>
            <CardContent>
                {(actions?.buttons || []).map((button: IntegratedInputProps) =>
                    <IntegratedButton {...button} />
                )}
                {getDivider()}
                {(body?.inputs || []).map((input: IntegratedInputProps) =>
                    <IntegratedInput {...input} />
                )}
            </CardContent>
            <CardFooter>
                {footer?.submitButton ? <IntegratedButton {...footer?.submitButton} /> : null}
            </CardFooter>
        </Card>
    );
};