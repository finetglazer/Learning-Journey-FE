import { IntegratedButton } from "@/components/core/button/integrated-button";
import { IntegratedInput } from "@/components/core/input/integrated-input";
import { ChangePasswordModel } from "@/model/change-password-model";
import { authRepository } from "@/repository/auth-repository";
import { formService } from "@/service/form-service";
import { LockIcon } from "lucide-react";

export default function ChangePasswordPage() {
    const {
        model,
        loading,
        updateModel,
        onSubmitForm,
    } = formService.useForm(
        ChangePasswordModel,
        authRepository.changePassword,
    );

    const inputs = [
        {
            id: "old-password-input",
            label: "Old password",
            placeholder: "Enter your old password",
            type: "password",
            required: true,
            prefix: <LockIcon size={16} />,
            fieldName: "oldPassword",
            model,
            updateModel,
        },
        {
            id: "new-password-input",
            label: "New password",
            placeholder: "Enter your new password",
            required: true,
            type: "password",
            prefix: <LockIcon size={16} />,
            passwordStrengthIndicator: {
                currentPassword: model?.newPassword || null,
                minimumSatisfiedCategories: 2,
                categoryNumber: 3,
            },
            fieldName: "newPassword",
            model,
            updateModel,
        },
        {
            id: "confirm-password-input",
            label: "Confirm password",
            placeholder: "Re-enter your new password",
            required: true,
            type: "password",
            prefix: <LockIcon size={16} />,
            fieldName: "confirmPassword",
            model,
            updateModel,
        },
    ];

    return (
        // Enhanced Layout: Added padding, header, and a max-width container
        <div className="p-10 max-w-3xl mx-auto h-full overflow-y-auto ml-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Change Password</h1>
            <p className="text-sm text-gray-600 mb-6">
                Update your password here. For security, choose a strong password you haven't used before.
            </p>

            <hr className="my-8 border-gray-200" />

            {/* Form container with consistent spacing */}
            <form onSubmit={onSubmitForm} className="max-w-lg space-y-6">
                {inputs.map((input) => (
                    <IntegratedInput {...input} key={input.id} />
                ))}

                <IntegratedButton
                    id="change-password-btn"
                    label="Change password"
                    loading={loading}
                    wrapperClassName="pt-4"
                    buttonClassName="h-12"
                    labelClassName="text-base"
                />
            </form>
        </div>
    );
};