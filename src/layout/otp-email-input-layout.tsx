"use client"

import { IntegratedButton, IntegratedButtonProps } from "@/components/core/button/integrated-button";
import { Divider } from "@/components/core/divider/divider";
import { Icon } from "@/components/core/icon/icon";
import { IntegratedInput } from "@/components/core/input/integrated-input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, uuid4 } from "@/lib/utils";
import { InputOTP } from "antd-input-otp";
import { MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { isValidElement, useState } from "react";
import { Model } from "react-3layer-common";

export interface OtpEmailInputLayoutProps {
    type: "otp" | "email";
    model: Model;
    updateModel: (fieldName: string, value: any) => void;
    wrapperClassName?: string;
    title?: string;
    titleClassName?: string;
    description?: string[];
    submitButton?: IntegratedButtonProps;
    backButtonTitle?: string;
    backButtonUrl?: string;
    otpValidationError?: string | null;
};

export const OtpEmailInputLayout = (props: OtpEmailInputLayoutProps) => {
    const {
        wrapperClassName,
        title,
        titleClassName,
        type,
        description,
        submitButton,
        backButtonTitle,
        backButtonUrl,
        model,
        updateModel,
        otpValidationError,
    } = props;

    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const renderContent = () => {
        switch (type) {
            case "otp":
                return (
                    <>
                        <InputOTP
                            onChange={(value) => updateModel("otp", value.join(""))}
                            value={(model?.otp || "").split("")}
                        />
                        {
                            otpValidationError ? (
                                <div className="w-full text-center mt-2">
                                    <span className="text-red-600">{otpValidationError}</span>
                                </div>
                            ) : null
                        }
                    </>
                )
            case "email":
                return (
                    <IntegratedInput
                        id="otp-email-input-form-email-input"
                        prefix={<MailIcon />}
                        type="email"
                        placeholder="Enter your email"
                        wrapperClassName="max-w-full"
                        fieldName="email"
                        model={model}
                        updateModel={updateModel}
                    />
                )
        }
    };

    return (
        <Card className={cn("max-w-175 h-auto mt-65 mx-auto grid place-items-center", wrapperClassName)}>
            <CardHeader className="w-full p-0 text-center">
                {backButtonTitle ? (
                    <div className="flex">
                        <IntegratedButton
                            id={`back-btn-${uuid4()}`}
                            label={backButtonTitle || ""}
                            prefix={<Icon name="LeftArrow" className="opacity-[0.7] hover:opacity-[1]" />}
                            variant="default"
                            wrapperClassName="text-left"
                            buttonClassName="bg-transparent text-black hover:bg-transparent w-auto"
                            labelClassName="text-[1.1rem] text-gray-500 hover:text-black"
                            onClick={() => {
                                router.push(backButtonUrl || "");
                                if (setLoading) {
                                    setLoading(true);
                                }
                            }}
                            loading={loading}
                        />
                    </div>
                ) : null}
                <CardTitle className={cn("font-bold text-[3rem] w-full", titleClassName)}>{title}</CardTitle>
            </CardHeader>
            <CardContent className="items-center">
                <Divider className="w-120 mb-4" />
                {
                    (description || []).map((description: string) =>
                        <p className="text-[1.7rem] italic font-light text-center">{description}</p>
                    )
                }
                <div className="mt-7">
                    {renderContent()}
                </div>
            </CardContent>
            {isValidElement(submitButton)
                ?
                <CardFooter className="flex-col text-center">
                    {submitButton}
                </CardFooter>
                : null
            }
        </Card>
    );
};