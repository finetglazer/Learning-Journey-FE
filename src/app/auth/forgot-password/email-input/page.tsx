import { IntegratedButton } from "@/components/core/button/integrated-button";
import { OtpEmailInputLayout } from "@/layout/otp-email-input-layout";

export default function EmailInput() {
    return (
        <OtpEmailInputLayout
            type="email"
            title="First thing,"
            description={["Enter your registered email"]}
            submitButton={(
                <IntegratedButton
                    id="submit-email-btn"
                    label="Submit"
                    labelClassName="text-[1.2rem]"
                    wrapperClassName="mt-2"
                />
            ) as any}
        />
    );
};