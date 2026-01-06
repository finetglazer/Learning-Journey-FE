"use client"

import { CALENDAR_ROUTE } from "@/const/routes-const";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import Cookies from "js-cookie";

export default function AuthSuccess() {
    const router = useRouter();

    const {
        setEmail,
        setUserId,
        setDisplayName,
    } = useContext<AppContextProps>(AppContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const refreshToken = params.get("refreshToken");
        const userId = params.get("userId");
        const displayName = params.get("displayName");
        const email = params.get("email");
        if (token) {
            localStorage.setItem("accessToken", token);
            localStorage.setItem("refreshToken", refreshToken as string);

            Cookies.set("userId", String(userId), { expires: 7, secure: true, sameSite: 'strict' });

            setUserId(Number(userId));
            setDisplayName(displayName as string);
            setEmail(email as string);
            setTimeout(() => router.push(CALENDAR_ROUTE), 1200);
        }
    }, [router, setEmail, setUserId, setDisplayName]);

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
