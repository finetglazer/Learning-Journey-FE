"use client"

import { useContext, useEffect } from "react";
import { SettingLayoutContext, SettingLayoutContextProps } from "../setting-layout-context";
import { IntegratedInput, IntegratedInputProps } from "@/components/core/input/integrated-input";
import { LockIcon } from "lucide-react";
import { formService } from "@/service/form-service";
import { ChangePasswordModel } from "@/model/change-password-model";
import { authRepository } from "@/repository/auth-repository";
import { IntegratedButton } from "@/components/core/button/integrated-button";

export default function ChangePasswordPage() {
    const {
        setTitle,
    } = useContext<SettingLayoutContextProps>(SettingLayoutContext);

    const {
        model,
        loading,
        updateModel,
        onSubmitForm,
    } = formService.useForm(
        ChangePasswordModel,
        authRepository.changePassword,
    )

    const inputs: IntegratedInputProps[] = [
        {
            id: "old-password-input",
            label: "Old password",
            placeholder: "Enter your old password",
            type: "password",
            required: true,
            prefix: <LockIcon />,
            fieldName: "oldPassword",
            labelClassName: "text-[1.5rem] font-normal",
            inputClassName: "h-12 w-120",
            model,
            updateModel,
        },
        {
            id: "new-password-input",
            label: "New password",
            placeholder: "Enter your new password",
            required: true,
            type: "password",
            prefix: <LockIcon />,
            passwordStrengthIndicator: {
                currentPassword: model?.newPassword || null,
                minimumSatisfiedCategories: 2,
                categoryNumber: 3,
            },
            fieldName: "newPassword",
            wrapperClassName: "mt-5",
            labelClassName: "text-[1.5rem] font-normal",
            inputClassName: "h-12 w-120",
            model,
            updateModel,
        },
        {
            id: "confirm-password-input",
            label: "Confirm password",
            placeholder: "Enter your confirm password",
            required: true,
            type: "password",
            prefix: <LockIcon />,
            fieldName: "confirmPassword",
            wrapperClassName: "mt-5",
            labelClassName: "text-[1.5rem] font-normal",
            inputClassName: "h-12 w-120",
            model,
            updateModel,
        },
    ];

    useEffect(() => {
        setTitle("Change password");
    }, []);

    return (
        <div className="">
            {inputs.map((input: IntegratedInputProps) => 
                <IntegratedInput {...input} />
            )}

            <IntegratedButton 
                id="change-password-btn"
                label="Change password"
                loading={loading}
                onClick={onSubmitForm}
                wrapperClassName="mt-12 w-120"
                buttonClassName="h-12"
                labelClassName="text-[1.2rem]"
            />
        </div>
    );
};