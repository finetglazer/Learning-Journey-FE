"use client"

import { IntegratedButton } from "@/components/core/button/integrated-button";
import { IntegratedInputProps } from "@/components/core/input/integrated-input";
import { FORGOT_PASSWORD_EMAIL_INPUT_ROUTE, SIGN_IN_ROUTE } from "@/const/routes-const";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import AuthFormLayout from "@/layout/auth-form-layout";
import { ResetPasswordModel } from "@/model/reset-password-model";
import { authRepository } from "@/repository/auth-repository";
import { formService } from "@/service/form-service";
import { LockIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";

export default function ResetPasswordPage() {
    const router = useRouter();

    const {
        setLoadingPage,
    } = useContext<AppContextProps>(AppContext);

    const {
        model,
        loading,
        updateModel,
        onSubmitForm,
    } = formService.useForm(
        ResetPasswordModel,
        authRepository.resetPassword,
        () => {
            router.push(SIGN_IN_ROUTE);
            setLoadingPage(true);
        },
    );

    const token = useSearchParams().get("token");

    const header = {
        title: "Reset password",
        backButtonTitle: "Email checking",
        backButtonUrl: FORGOT_PASSWORD_EMAIL_INPUT_ROUTE,
    };

    const bodyInputs: IntegratedInputProps[] = [
        {
            id: "new-password-input",
            label: "New password",
            placeholder: "Enter your new password",
            required: true,
            type: "password",
            prefix: <LockIcon />,
            passwordStrengthIndicator: {
                currentPassword: model?.newPassword || "",
                minimumSatisfiedCategories: 2,
                categoryNumber: 3,
            },
            wrapperClassName: "mt-7",
            fieldName: "newPassword",
            model: model,
            updateModel: updateModel,
        },
        {
            id: "confirm-password-input",
            label: "Confirm password",
            placeholder: "Confirm your new password",
            required: true,
            type: "password",
            prefix: <LockIcon />,
            wrapperClassName: "mt-7",
            fieldName: "confirmPassword",
            model: model,
            updateModel: updateModel,
        },
    ];

    const footer = {
        submitButton: (
            <IntegratedButton
                id="reset-password-btn"
                label="Reset password"
                wrapperClassName="my-auto mt-5"
                onClick={onSubmitForm}
                loading={loading}
            />
        )
    };

    useEffect(() => {
        updateModel("token", token);
    }, [token]);

    return (
        <AuthFormLayout
            header={header}
            body={{
                inputs: bodyInputs
            }}
            footer={footer}
            divider={{
                type: "1-line",
            }}
            onSubmitForm={onSubmitForm}
        />
    );
};