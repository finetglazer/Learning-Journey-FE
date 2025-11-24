"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useContext } from "react";
import { projectRepository } from "@/repository/project-repository";
import { ROOT_ROUTE } from "@/const/routes-const";
import { AppContext, AppContextProps } from "@/hooks/app-context";

/**
 * This component handles the logic after being wrapped in <Suspense>
 */
function InvitationDeclineContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const {
        setLoadingPage,
    } = useContext<AppContextProps>(AppContext);

    // 'loading': Processing the decline
    // 'success': Token was valid, user declined
    // 'error': Token was invalid or expired
    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );
    const [message, setMessage] = useState("Processing your request...");

    useEffect(() => {
        const token = searchParams.get("token");
        const projectId = Number(searchParams.get("projectId"));

        if (!token) {
            setStatus("error");
            setMessage("No invitation token found. The link may be broken.");
            return;
        }

        // Call the decline repository method
        projectRepository.declineInvitation({
            projectId: projectId,
        }, {
            token,
        }).subscribe({
            next: (res) => {
                if (res.status) {
                    setStatus("success");
                } else {
                    setStatus("error");
                    setMessage(res.message || "Failed to process the request.");
                }
            },
            error: (err) => {
                setStatus("error");
                setMessage("This invitation is invalid, has expired, or was already used.");
            },
        });

    }, [searchParams]); // Run once when searchParams are available

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
                        Processing...
                    </h1>
                    <p className="text-sm text-gray-500">{message}</p>
                </CardHeader>
            </Card>
        );
    }

    // --- Success State (Declined) ---
    if (status === "success") {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="items-center p-8 pb-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-4">
                        <XCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-center">
                        Invitation Declined
                    </h1>
                </CardHeader>
                <CardContent className="text-center text-sm text-gray-600 px-8 pb-6">
                    <p>
                        You have successfully declined the invitation.
                        You will not be added to the project.
                    </p>
                </CardContent>
                <CardFooter className="px-8 pb-8">
                    <Button
                        className="bg-teal-400 text-white hover:bg-teal-600 cursor-pointer"
                        size="lg"
                        variant="outline"
                        onClick={handleGoHome}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go back home
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
                        Request Failed
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
                        onClick={handleGoHome}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go back home
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
export default function InvitationDeclinePage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Suspense>
                <InvitationDeclineContent />
            </Suspense>
        </div>
    );
}