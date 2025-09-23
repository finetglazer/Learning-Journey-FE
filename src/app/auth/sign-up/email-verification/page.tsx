"use client"

import { IntegratedButton } from "@/components/core/button/integrated-button";
import { OtpEmailInputLayout } from "@/layout/otp-email-input-layout";
import "./page.css";

export default function EmailVerificationPage() {
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
                />
            ) as any}
        />
    );
}