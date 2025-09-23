"use client"

import { IntegratedInputProps } from "@/components/core/input/integrated-input";
import AuthFormLayout from "@/layout/auth-form-layout";
import { LockIcon } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
    const header = {
        title: "Reset password",
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
                currentSatisfiedCategoriesNumber: 0,
                minimumSatisfiedCategories: 2,
                categoryNumber: 3,
            },
            inputValidation: {
                message: "AAA"
            },
            wrapperClassName: "mt-7"
        },
        {
            id: "confirm-password-input",
            label: "Confirm password",
            placeholder: "Confirm your new password",
            required: true,
            type: "password",
            prefix: <LockIcon />,
            inputValidation: {
                message: "AAA"
            },
            wrapperClassName: "mt-7",
        },
    ];

    const footer = {
        submitButton: {
            id: "reset-password-btn",
            label: "Reset password",
            wrapperClassName: "my-auto mt-5",
            onClick: () => {
                toast("Event has been created", {
                    description: "Sunday, December 03, 2023 at 9:00 AM",
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo"),
                    },
                    classNames: {
                        description: "!text-foreground/80",
                    },
                })
            },
        }
    };

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
        />
    );
};