"use client"

import { IntegratedButtonProps } from "@/components/core/button/integrated-button";
import { GoogleIcon } from "@/components/core/icons";
import { IntegratedInputProps } from "@/components/core/input/integrated-input";
import AuthFormLayout from "@/layout/auth-form-layout";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";
import Image from "next/image";

export default function SignUpPage() {
    const header = {
        title: "Register",
    };

    const bodyInputs: IntegratedInputProps[] = [
        {
            id: "username-input",
            label: "Username",
            placeholder: "Username",
            required: true,
            prefix: <UserIcon />,
            inputValidation: {
                message: "AA"
            },
        },
        {
            id: "email-input",
            label: "Email",
            placeholder: "Email",
            type: "email",
            required: true,
            prefix: <MailIcon />,
            inputValidation: {
                message: "AA"
            },
        },
        {
            id: "password-input",
            label: "Password",
            placeholder: "Password",
            required: true,
            type: "password",
            prefix: <LockIcon />,
            passwordStrengthIndicator: {
                currentSatisfiedCategoriesNumber: 0,
                minimumSatisfiedCategories: 2,
                categoryNumber: 3,
            },
            inputValidation: {
                message: "AAA"
            },
        },
    ];

    const actionButtons: IntegratedButtonProps[] = [
        {
            id: "google-oauth2-btn",
            label: "Sign in with Google",
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
            wrapperClassName: "my-auto"
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