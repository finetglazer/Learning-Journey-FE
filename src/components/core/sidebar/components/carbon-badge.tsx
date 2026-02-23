"use client";

import Script from "next/script";
import { cn } from "@/lib/utils";

interface CarbonBadgeProps {
    isCollapsed: boolean;
}

export const CarbonBadge = ({ isCollapsed }: CarbonBadgeProps) => {
    return (
        <div
            className={cn(
                "px-4 py-3 border-t border-gray-200 transition-all duration-300",
                isCollapsed ? "opacity-0 pointer-events-none h-0 p-0 overflow-hidden" : "opacity-100"
            )}
        >
            <div className="overflow-hidden max-w-full">
                <div
                    id="wcb"
                    className="carbonbadge"
                    style={{
                        transform: "scale(0.6)",
                        transformOrigin: "left top",
                        minWidth: "340px",
                        whiteSpace: "nowrap",
                    }}
                ></div>
            </div>
            <Script
                src="https://unpkg.com/website-carbon-badges@1.1.3/b.min.js"
                strategy="lazyOnload"
            />
        </div>
    );
};
