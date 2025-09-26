"use client"

import { IntegratedButtonProps } from "@/components/core/button/integrated-button";
import { GoogleIcon } from "@/components/core/icons";
import { IntegratedInputProps } from "@/components/core/input/integrated-input";
import { SIGN_IN_ROUTE, SIGN_UP_EMAIL_VERIFICATION_ROUTE } from "@/const/routes-const";
import AuthFormLayout from "@/layout/auth-form-layout";
import { SignUpModel } from "@/model/sign-up-model";
import { authRepository } from "@/repository/auth-repository";
import { formService } from "@/service/form-service";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const router = useRouter();

    const {
        model,
        loading,
        setLoading,
        updateModel,
        onSubmitForm,
    } = formService.useForm(
        SignUpModel,
        authRepository.signUp,
        () => router.push(SIGN_UP_EMAIL_VERIFICATION_ROUTE)
    );

    const header = {
        title: "Register",
        titleClassName: "-mt-3",
        backButtonTitle: "Sign in",
        backButtonUrl: SIGN_IN_ROUTE,
    };

    const bodyInputs: IntegratedInputProps[] = [
        {
            id: "display-name-input",
            label: "Display name",
            placeholder: "Display name",
            required: true,
            prefix: <UserIcon />,
            fieldName: "displayName",
            model,
            updateModel,
        },
        {
            id: "email-input",
            label: "Email",
            placeholder: "Email",
            type: "email",
            required: true,
            prefix: <MailIcon />,
            fieldName: "email",
            model,
            updateModel,
        },
        {
            id: "password-input",
            label: "Password",
            placeholder: "Password",
            required: true,
            type: "password",
            prefix: <LockIcon />,
            passwordStrengthIndicator: {
                currentPassword: model?.password || "",
                minimumSatisfiedCategories: 2,
                categoryNumber: 3,
            },
            fieldName: "password",
            model,
            updateModel,
        },
    ];

    const actionButtons: IntegratedButtonProps[] = [
        {
            id: "google-sign-up-oauth2-btn",
            label: "Sign up with Google",
            buttonClassName: "bg-white text-black border-1",
            prefix: (
                <Image
                    src={GoogleIcon}
                    alt="google-oauth2-btn"
                    height={20}
                    width={20}
                    className="mr-2"
                />
            )
        },
    ];

    const footer = {
        submitButton: {
            id: "sign-up-btn",
            label: "Sign Up",
            wrapperClassName: "my-auto",
            onClick: onSubmitForm,
            loading,
        },
    };

    return (
        <AuthFormLayout
            header={header}
            body={{
                inputs: bodyInputs
            }}
            footer={footer}
            actions={{
                buttons: actionButtons
            }}
            divider={{
                type: "2-line-symmetric",
                content: "OR"
            }}
        />
    );
};