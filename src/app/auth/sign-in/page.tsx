"use client"

import { IntegratedButton } from "@/components/core/button/integrated-button";
import { IntegratedInput } from "@/components/core/input/integrated-input";
import { MailIcon } from "lucide-react";

export default function SignInPage() {
    return (
        <>
            <IntegratedInput
                id="username-input"
                label="Username"
                prefix={<MailIcon />}
                postfix={<MailIcon />}
            />
            <IntegratedButton
                id="sign-in-btn"
                label="Sign In"
                // size="lg"
                buttonClassName={{ merge: ""}}
            />
        </>
    );
};