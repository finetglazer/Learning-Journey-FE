"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROOT_ROUTE } from "@/const/routes-const";
import { useContext } from "react";
import { AppContext, AppContextProps } from "@/hooks/app-context";

/**
 * A static page shown AFTER a user successfully accepts an invitation.
 */
export const InvitationAcceptPage = () => {
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
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-4">
                        <Check className="w-8 h-8" />
                    </div>

                    {/* --- Title --- */}
                    <h1 className="text-2xl font-bold text-center">
                        Invitation Accepted!
                    </h1>
                </CardHeader>

                {/* --- Description --- */}
                <CardContent className="text-center text-sm text-gray-600 px-8 pb-6">
                    <p>
                        You have successfully joined the project. You can now access
                        its tasks, files, and collaborate with your team.
                    </p>
                </CardContent>

                {/* --- Next Step Button --- */}
                <CardFooter className="px-8 pb-8">
                    <Button
                        className="w-full cursor-pointer bg-blue-500 hover:bg-blue-700"
                        size="lg"
                        onClick={handleGoHome}
                    >
                        Go home
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default InvitationAcceptPage;