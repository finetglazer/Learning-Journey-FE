"use client"

import { IntegratedButton } from "@/components/core/button/integrated-button";
import { OtpEmailInputLayout } from "@/layout/otp-email-input-layout";
import "./page.css";
import { formService } from "@/service/form-service";
import { EmailVerificationModel } from "@/model/email-verification-model";
import { authRepository } from "@/repository/auth-repository";
import { SIGN_IN_ROUTE, SIGN_UP_BASE_ROUTE } from "@/const/routes-const";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OTP_REGEX } from "@/const/consts";

export default function EmailVerificationPage() {
    const router = useRouter();

    const {
        model,
        loading,
        updateModel,
        onSubmitForm,
    } = formService.useForm(
        EmailVerificationModel,
        authRepository.verifyOtp,
        () => router.push(SIGN_IN_ROUTE)
    );

    const [otpValidationError, setOtpValidationError] = useState<string | undefined | null>(undefined);

    const validateOtp = () => {
        if (!model?.otp) {
            setOtpValidationError("OTP is required");
            return false;
        }
        else if ((model?.otp || "").length < 6 || !OTP_REGEX.test((model?.otp || ""))) {
            setOtpValidationError("OTP must be 6 digits");
            return false;
        }
        else {
            setOtpValidationError(null);
            return true;
        }
    };

    return (
        <OtpEmailInputLayout
            type="otp"
            title="Email Verification"
            description={[
                "We've sent verification code to your email",
                "Please enter that 6-digit code"
            ]}
            submitButton={(
                <IntegratedButton
                    id="verify-email-btn"
                    label="Verify"
                    labelClassName="text-[1.2rem]"
                    wrapperClassName="mt-2"
                    onClick={onSubmitForm}
                    loading={loading}
                    validateFn={validateOtp}
                />
            ) as any}
            model={model}
            updateModel={updateModel}
            otpValidationError={otpValidationError}
            backButtonTitle="Sign up"
            backButtonUrl={SIGN_UP_BASE_ROUTE}
            onSubmitForm={onSubmitForm}
        />
    );
}