"use client"

import { IntegratedButton } from "@/components/core/button/integrated-button";
import { SIGN_IN_ROUTE } from "@/const/routes-const";
import { OtpEmailInputLayout } from "@/layout/otp-email-input-layout";
import { authRepository } from "@/repository/auth-repository";
import { formService } from "@/service/form-service";
import { Model } from "react-3layer-common";

export default function EmailInputPage() {
    const {
        model,
        updateModel,
        loading,
        onSubmitForm,
    } = formService.useForm(
        Model,
        authRepository.resetPasswordSendEmail,
    );

    return (
        <OtpEmailInputLayout
            type="email"
            title="First thing,"
            description={["Enter your registered email"]}
            backButtonTitle="Sign in"
            backButtonUrl={SIGN_IN_ROUTE}
            submitButton={(
                <IntegratedButton
                    id="submit-email-btn"
                    label="Submit"
                    labelClassName="text-[1.2rem]"
                    wrapperClassName="mt-2"
                    loading={loading}
                    onClick={onSubmitForm}
                />
            ) as any}
            model={model}
            updateModel={updateModel}
            onSubmitForm={onSubmitForm}
        />
    );
};