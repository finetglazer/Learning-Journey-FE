"use client"

import { IntegratedButton, IntegratedButtonProps } from "@/components/core/button/integrated-button";
import { Divider } from "@/components/core/divider/divider";
import { Icon } from "@/components/core/icon/icon";
import { IntegratedInput, IntegratedInputProps } from "@/components/core/input/integrated-input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, uuid4 } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";

export interface FormLayoutProps {
    cardClassName?: string;
    header?: {
        title?: string;
        titleClassName?: string;
        backButtonTitle?: string;
        backButtonUrl?: string;
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
        cardClassName,
        header,
        body,
        footer,
        actions,
        divider,
    } = props;
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

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
                return <Divider className="w-95 -mt-2" />;
            case "none":
                return (
                    <span>{divider?.content || ""}</span>
                );
            default:
                return <></>;
        }
    };

    return (
        <Card className={cn("w-175 max-w-175 h-auto grid place-items-center", cardClassName)}>
            <CardHeader className="w-full p-0 text-center">
                {header?.backButtonTitle ? (
                    <div className="flex">
                        <IntegratedButton
                            id={`back-btn-${uuid4()}`}
                            label={header?.backButtonTitle || ""}
                            prefix={<Icon name="LeftArrow" className="opacity-[0.7]" />}
                            variant="default"
                            wrapperClassName="text-left"
                            buttonClassName="bg-transparent text-black hover:bg-transparent w-auto"
                            labelClassName="text-[1.1rem] text-gray-500 hover:text-black"
                            onClick={() => {
                                router.push(header?.backButtonUrl || "");
                                if (setLoading) {
                                    setLoading(true);
                                }
                            }}
                            loading={loading}
                        />
                    </div>
                ) : null}
                <CardTitle className={cn("font-bold text-[3rem] w-full", header?.titleClassName)}>{header?.title || ""}</CardTitle>
            </CardHeader>
            <CardContent className="">
                {(actions?.buttons || []).map((button: IntegratedButtonProps) =>
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