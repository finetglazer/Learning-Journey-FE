"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROOT_ROUTE } from "@/const/routes-const";
import { useContext } from "react";
import { AppContext, AppContextProps } from "@/hooks/app-context";

/**
 * A static page shown AFTER a user declines an invitation
 * or if the invitation link is invalid/expired.
 */
export const InvitationDeclinePage = () => {
    const router = useRouter();

    const {
        setLoadingPage,
    } = useContext<AppContextProps>(AppContext);

    const handleGoHome = () => {
        setLoadingPage(true);
        router.push(ROOT_ROUTE);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="items-center p-8 pb-4">
                    {/* --- Icon --- */}
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 mb-4">
                        <AlertTriangle className="w-8 h-8" />
                    </div>

                    {/* --- Title --- */}
                    <h1 className="text-2xl font-bold text-center">
                        Invitation Declined
                    </h1>
                </CardHeader>

                {/* --- Description --- */}
                <CardContent className="text-center text-sm text-gray-600 px-8 pb-6">
                    <p>
                        This invitation link is no longer valid since you have declined an invitation.
                    </p>
                </CardContent>

                {/* --- Next Step Button --- */}
                <CardFooter className="px-8 pb-8">
                    <Button
                        className="w-full cursor-pointer bg-blue-500 hover:bg-blue-700 text-white hover:text-white"
                        size="lg"
                        variant="outline"
                        onClick={handleGoHome}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go back home
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default InvitationDeclinePage;