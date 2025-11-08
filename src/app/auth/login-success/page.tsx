"use client"

import { HOME_BASE_ROUTE, ROOT_ROUTE } from "@/const/routes-const";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthSuccess() {
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        if (token) {
            localStorage.setItem("accessToken", token);
            setTimeout(() => router.push(ROOT_ROUTE), 1200);
        }
    }, [router]);

    return (
        <div
            className="flex items-center justify-center h-screen bg-cover bg-center"
        >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 flex flex-col items-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
                <h1 className="text-lg font-semibold text-gray-800">
                    Signing you in…
                </h1>
                <p className="text-sm text-gray-500">
                    Please wait while we complete your login
                </p>
            </div>
        </div>
    );
}
