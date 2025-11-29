import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerLoaderProps {
    /** Size of the spinner icon (Tailwind class, e.g., 'h-6 w-6') */
    sizeClass?: string;
    /** Color of the spinner (Tailwind class, e.g., 'text-blue-500') */
    colorClass?: string;
    /** Optional message displayed next to or below the spinner */
    message?: string;
}

const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({
    sizeClass = 'h-8 w-8',
    colorClass = 'text-gray-500',
    message,
}) => {
    return (
        <div className="flex flex-col w-full items-center justify-center space-y-2 p-4">

            {/* The rotating icon */}
            <Loader2
                className={`${sizeClass} ${colorClass} animate-spin`}
                aria-hidden="true"
            />

            {/* Optional loading message */}
            {message && (
                <span className="text-sm font-medium text-gray-700">
                    {message}
                </span>
            )}

        </div>
    );
};

export default SpinnerLoader;