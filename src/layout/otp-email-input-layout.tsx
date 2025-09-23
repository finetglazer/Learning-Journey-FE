import { IntegratedButtonProps } from "@/components/core/button/integrated-button";
import { Divider } from "@/components/core/divider/divider";
import { IntegratedInput, IntegratedInputProps } from "@/components/core/input/integrated-input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Form } from "antd";
import { InputOTP } from "antd-input-otp";
import { MailIcon } from "lucide-react";
import { isValidElement } from "react";

export interface OtpEmailInputLayoutProps {
    type: "otp" | "email";
    wrapperClassName?: string;
    title?: string;
    titleClassName?: string;
    description?: string[];
    input?: IntegratedInputProps;
    otpError?: string;
    submitButton?: IntegratedButtonProps;
};

export const OtpEmailInputLayout = (props: OtpEmailInputLayoutProps) => {
    const {
        wrapperClassName,
        title,
        titleClassName,
        type,
        description,
        submitButton,
    } = props;

    const renderContent = () => {
        switch (type) {
            case "otp":
                return (
                    <Form
                        name="basic"
                        initialValues={{ remember: true }}
                        // onFinish={}
                        // onFinishFailed={}
                        autoComplete="off"
                    >
                        <Form.Item
                            className="otp-form-item"
                            name="otp"
                            rules={[
                                { required: true, message: 'Please input the OTP!' },
                                { len: 6, message: 'OTP must be 6 digits!' }
                            ]}
                        >
                            <InputOTP />
                        </Form.Item>
                    </Form>
                )
            case "email":
                return (
                    <IntegratedInput
                        id="otp-email-input-form-email-input"
                        prefix={<MailIcon />}
                        type="email"
                        placeholder="Enter your email"
                        wrapperClassName="max-w-full"
                        inputValidation={{
                            message: "AAAA"
                        }}
                    />
                )
        }
    };

    return (
        <Card className={cn("max-w-175 h-auto mt-65 mx-auto grid place-items-center", wrapperClassName)}>
            <CardHeader className="w-full p-0 text-center">
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