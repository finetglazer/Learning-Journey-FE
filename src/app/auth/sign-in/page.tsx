"use client"

import { IntegratedButton } from "@/components/core/button/integrated-button";
import { IntegratedInput } from "@/components/core/input/integrated-input";
import { PasswordStrengthIndicator } from "@/components/core/password-strength-indicator/password-strength-indicator";
import { Toast } from "@/components/core/toast/toast";
import { InputValidation } from "@/components/core/validation/input-validation";
import { MailIcon } from "lucide-react";

export default function SignInPage() {
    return (
        <>
            <IntegratedInput
                id="username-input"
                label="Username"
                prefix={<MailIcon className={""}/>}
                postfix={<MailIcon />}
                required
            />
            <IntegratedButton
                id="sign-in-btn"
                label="Sign In"
                size="lg"
                buttonClassName={""}
            />
            <InputValidation
                type="info"
                message="dadd"
            />
            <PasswordStrengthIndicator 
                currentSatisfiedCategoriesNumber={0}
                minimumSatisfiedCategories={2}
                categoryNumber={3}
            />
            <Toast />
        </>
    );
};