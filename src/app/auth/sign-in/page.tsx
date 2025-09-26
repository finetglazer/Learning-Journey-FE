"use client"

import { SignInModel } from "@/model/sign-in-model";
import { authRepository } from "@/repository/auth-repository";
import { IntegratedButtonProps } from "@/components/core/button/integrated-button";
import { IntegratedInputProps } from "@/components/core/input/integrated-input";
import { Link } from "@/components/core/link/link";
import AuthFormLayout from "@/layout/auth-form-layout";
import { formService } from "@/service/form-service";
import { LockIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { SIGN_UP_BASE_ROUTE } from "@/const/routes-const";
import GoogleIcon from "@/components/core/icons/google";
import { Icon } from "@/components/core/icon/icon";
export default function SignInPage() {
    const {
        model,
        loading,
        updateModel,
        onSubmitForm,
    } = formService.useForm(
        SignInModel,
        authRepository.signIn,
    );

    const header = {
        title: "Welcome back!",
    };

    const bodyInputs: IntegratedInputProps[] = [
        {
            id: "email-input",
            label: "Email",
            placeholder: "Email",
            required: true,
            prefix: <UserIcon />,
            fieldName: "email",
            model: model,
            updateModel: updateModel,
        },
        {
            id: "password-input",
            label: "Password",
            placeholder: "Password",
            fieldName: "password",
            required: true,
            type: "password",
            prefix: <LockIcon />,
            extraComponent: (
                <Link
                    href=""
                    content="Forgot password?"
                    className="absolute text-[0.9rem] w-30 top-3 right-60 hover:underline"
                />
            ),
            model: model,
            updateModel: updateModel,
        },
    ];

    const actionButtons: IntegratedButtonProps[] = [
        {
            id: "google-oauth2-btn",
            label: "Sign in with Google",
            buttonClassName: "bg-white text-black border-1",
            prefix: (
                <Icon
                    name="GoogleIcon"
                    className="mr-2 h-20 w-20"
                />
            )
        },
    ];

    const footer = {
        submitButton: {
            id: "sign-in-btn",
            label: "Sign In",
            wrapperClassName: "my-auto mt-4",
            onClick: onSubmitForm,
            loading,
        },
        footComponent: (
            <span className="mt-4">
                {"Don't have an account? "}
                <Link
                    href={SIGN_UP_BASE_ROUTE}
                    className="underline"
                    content="Sign up"
                >
                </Link>
            </span>
        )
    };

    return (
        <>
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
        </>
    );
};