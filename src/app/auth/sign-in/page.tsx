"use client"

import { IntegratedButtonProps } from "@/components/core/button/integrated-button";
import { GoogleIcon } from "@/components/core/icons";
import { IntegratedInputProps } from "@/components/core/input/integrated-input";
import { Link } from "@/components/core/link/link";
import AuthFormLayout from "@/layout/auth-form-layout";
import { LockIcon, UserIcon } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
    const header = {
        title: "Welcome back!",
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
            extraComponent: (
                <Link 
                    href=""
                    content="Forgot password?"
                    className="absolute text-[0.9rem] w-30 top-4 right-0 hover:underline"
                />
            )
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
            id: "sign-in-btn",
            label: "Sign In",
            wrapperClassName: "my-auto"
        },
        footComponent: (
            <span className="mt-2">
                {"Don't have an account? "} 
                <Link
                    href=""
                    className="underline"
                    content="Sign up"
                >
                </Link>
            </span>
        )
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