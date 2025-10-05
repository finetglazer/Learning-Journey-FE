"use client"

import { Loader2 } from "lucide-react";
import Image from "next/image";

export interface LoadingPageProps {
    title?: string;
    description?: string;
};

export default function LoadingPage(props: LoadingPageProps) {
    const {
        title,
        description,
    } = props;

    return (
        <div
            className="flex items-center justify-center h-screen bg-cover bg-center"
        >
            <Image
                src="/BG.png"
                alt="background"
                className="object-cover absolute -z-10"
                fill
            />
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
                <h1 className="text-lg font-semibold text-gray-800">
                    {title}
                </h1>
                <p className="text-sm text-gray-500">
                    {description}
                </p>
            </div>
        </div>
    );
}
