"use client";

import { useSearchParams } from "next/navigation";
import { PublicProfile } from "@/components/core/sidebar/pages/public-profile/public-profile";
import { LimitTimeAndTimeZone } from "@/components/core/sidebar/pages/limit-time-and-time-zone-setting/limit-time-and-time-zone-setting";
import ChangePasswordPage from "@/components/core/sidebar/pages/change-password/change-password";
import { MemorableEvents } from "@/components/core/sidebar/pages/memorable-event/memorable-event";

export default function SettingsPage() {
    const searchParams = useSearchParams();
    // Default to profile if no tab specified
    const tab = searchParams.get("tab") || "profile";

    const renderContent = () => {
        switch (tab) {
            case "profile":
                return <PublicProfile />;
            case "password":
                return <ChangePasswordPage />;
            case "timezone":
                return <LimitTimeAndTimeZone />;
            case "memorable-events":
                return <MemorableEvents />;
            default:
                return <PublicProfile />;
        }
    };

    return (
        <div className="h-full w-full">
            {renderContent()}
        </div>
    );
}
