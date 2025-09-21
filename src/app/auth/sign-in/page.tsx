"use client"

import { IntegratedButtonProps } from "@/components/core/button/integrated-button";
import { IntegratedInputProps } from "@/components/core/input/integrated-input";
import { LockIcon, MailIcon } from "lucide-react";
import AuthFormLayout from "../layout";
import { GoogleIcon } from "@/components/core/icons";
import Image from "next/image";

export default function SignInPage() {
    const header = {
        title: "Welcome",
        titleClassName: ""
    };

    const bodyInputs: IntegratedInputProps[] = [
        {
            id: "username-input",
            label: "Username",
            placeholder: "Username",
            required: true,
            prefix: <MailIcon />
        },
        {
            id: "password-input",
            label: "Password",
            placeholder: "Password",
            required: true,
            type: "password",
            prefix: <LockIcon />,
            passwordStrengthIndicator: {
                currentSatisfiedCategoriesNumber: 1,
                minimumSatisfiedCategories: 2,
                categoryNumber: 3,
            }
        },
    ];

    const actionButtons: IntegratedButtonProps[] = [
        {
            id: "sign-in-btn",
            label: "Sign In",
            prefix: <Image src={GoogleIcon} alt="google-oauth2-btn" />
        },
    ]

    const submitButton: IntegratedButtonProps = {
        id: "sign-in-btn",
        label: "Sign In",
    };

    return (
        <AuthFormLayout
            header={header}
            body={{
                inputs: bodyInputs
            }}
            footer={{
                submitButton
            }}
            actions={{
                buttons: actionButtons 
            }}
        />
    );
};