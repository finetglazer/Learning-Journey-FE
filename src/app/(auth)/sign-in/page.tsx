"use client"

import { IntegratedButton, IntegratedButtonProps } from "@/components/core/button/integrated-button";
import { Icon } from "@/components/core/icon/icon";
import { IntegratedInputProps } from "@/components/core/input/integrated-input";
import { LinkWithLoading } from "@/components/core/link/link";
import { FORGOT_PASSWORD_ROUTE, GOOGLE_OAUTH2_ROUTE, ROOT_ROUTE, SIGN_UP_ROUTE } from "@/const/routes-const";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { SignInModel } from "@/model/sign-in-model";
import { formService } from "@/service/form-service";
import { LockIcon, UserIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import Cookies from "js-cookie";

const AuthFormLayout = dynamic(() => import("@/layout/auth-form-layout"), { ssr: false });

export default function SignInPage() {
    const router = useRouter();

    const {
        setLoadingPage,
        setUserId,
        authRepository,
    } = useContext<AppContextProps>(AppContext);

    const {
        model,
        loading,
        updateModel,
        onSubmitForm,
    } = formService.useForm(
        SignInModel,
        authRepository?.signIn,
        (data) => {
            Cookies.set("userId", String(data?.user?.id), { expires: 7, secure: true, sameSite: 'strict' });
            router.push(ROOT_ROUTE);
            setUserId(data?.user?.id as number);
            setLoadingPage(true);
        }
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
                <LinkWithLoading
                    href={FORGOT_PASSWORD_ROUTE}
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
            ),
            onClick: () => { router.push(GOOGLE_OAUTH2_ROUTE) },
        },
    ];
    const footer = {
        submitButton: (
            <IntegratedButton
                id="sign-in-btn"
                label="Sign In"
                wrapperClassName="my-auto mt-4"
                onClick={onSubmitForm}
                loading={loading}
            />
        ),
        footComponent: (
            <span className="mt-4">
                {"Don't have an account? "}
                <LinkWithLoading
                    href={SIGN_UP_ROUTE}
                    className="underline"
                    content="Sign up"
                >
                </LinkWithLoading>
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
                onSubmitForm={onSubmitForm}
            />
        </>
    );
};