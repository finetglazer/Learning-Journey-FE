"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, Check, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect, useState } from "react";
import { ROOT_ROUTE } from "@/const/routes-const";
import { AppContext, AppContextProps } from "@/hooks/app-context";

/**
 * This component handles the logic after being wrapped in <Suspense>
 */
function InvitationAcceptContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {
        setLoadingPage,
        projectRepository,
    } = useContext<AppContextProps>(AppContext);
    
    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );
    const [message, setMessage] = useState("Validating your invitation...");

    useEffect(() => {
        if (!projectRepository) {
            return;
        }
        const token = searchParams.get("token");
        const projectId = Number(searchParams.get("projectId"));

        if (!token) {
            setStatus("error");
            setMessage("No invitation token found. The link may be broken.");
            return;
        }
        
        projectRepository.acceptInvitation({
            projectId: projectId,
        }, {
            token,
        }).subscribe({
                next: (res) => {
                    if (res.status) {
                        setStatus("success");
                    } else {
                        setStatus("error");
                        setMessage(res.message || "Failed to join the project.");
                    }
                },
                error: (err) => {
                    setStatus("error");
                    setMessage("This invitation is invalid or has expired.");
                },
            });

    }, [searchParams, projectRepository]);

    const handleGoHome = () => {
        setLoadingPage(true);
        router.push(ROOT_ROUTE);
    };

    // --- Loading State ---
    if (status === "loading") {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="items-center p-8">
                    <Loader2 className="h-12 w-12 animate-spin text-gray-500 mb-4" />
                    <h1 className="text-xl font-medium text-gray-700">
                        Joining Project...
                    </h1>
                    <p className="text-sm text-gray-500">{message}</p>
                </CardHeader>
            </Card>
        );
    }

    // --- Success State ---
    if (status === "success") {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="items-center p-8 pb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-4">
                        <Check className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-center">
                        Invitation Accepted!
                    </h1>
                </CardHeader>
                <CardContent className="text-center text-sm text-gray-600 px-8 pb-6">
                    <p>
                        You have successfully joined the project. You can now access
                        its tasks, files, and collaborate with your team.
                    </p>
                </CardContent>
                <CardFooter className="px-8 pb-8">
                    <Button
                        className="bg-teal-400 text-white hover:bg-teal-600 cursor-pointer"
                        size="lg"
                        onClick={handleGoHome}
                    >
                        Go home
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    // --- Error State ---
    if (status === "error") {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="items-center p-8 pb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-4">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-center">
                        Invitation Failed
                    </h1>
                </CardHeader>
                <CardContent className="text-center text-sm text-gray-600 px-8 pb-6">
                    <p>{message}</p>
                </CardContent>
                <CardFooter className="px-8 pb-8">
                    <Button
                        className="bg-teal-400 text-white hover:bg-teal-600 cursor-pointer"
                        size="lg"
                        variant="outline"
                        onClick={() => router.push(ROOT_ROUTE)}
                    >
                        Go to Homepage
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return null;
}

/**
 * Main page export.
 * This provides the <Suspense> boundary required for useSearchParams().
 */
export default function InvitationAcceptPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Suspense>
                <InvitationAcceptContent />
            </Suspense>
        </div>
    );
}