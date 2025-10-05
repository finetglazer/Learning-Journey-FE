import { Suspense } from 'react';
import ResetPasswordForm from './reset-password-form';

const Spinner = () => (
    <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
);

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <ResetPasswordForm />
        </Suspense>
    );
}