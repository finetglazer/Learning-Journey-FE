"use client"

import { IntegratedButton } from "@/components/core/button/integrated-button";
import { SIGN_IN_ROUTE } from "@/const/routes-const";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { formService } from "@/service/form-service";
import dynamic from "next/dynamic";
import { useContext } from "react";
import { Model } from "react-3layer-common";

const OtpEmailInputLayout = dynamic(() => import("@/layout/otp-email-input-layout").then(mod => mod.OtpEmailInputLayout), { ssr: false });

export default function EmailInputPage() {
    const {
        authRepository,
    } = useContext<AppContextProps>(AppContext);

    const {
        model,
        updateModel,
        loading,
        onSubmitForm,
    } = formService.useForm(
        Model,
        authRepository?.resetPasswordSendEmail,
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
            )}
            model={model}
            updateModel={updateModel}
            onSubmitForm={onSubmitForm}
        />
    );
};