import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

export interface SidebarItemProps {
    id: string;
    icon: React.ReactNode;
    label: string | React.ReactNode;
    onClick?: () => void;
    actionIcon?: React.ReactNode;
    isActive?: boolean;
    isCollapsed?: boolean;
};
export const SidebarItem = React.forwardRef<HTMLDivElement, SidebarItemProps>(({ icon, label, onClick, actionIcon = null, isActive = false, isCollapsed = false }, ref) => (
    <div
        ref={ref}
        onClick={onClick}
        className={cn(
            "flex items-center py-2 mx-2 rounded-md cursor-pointer",
            isActive
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-100",
            "group",
            isCollapsed ? "justify-center px-2" : "justify-between px-4"
        )}
    >
        <div className={cn("flex items-center", isCollapsed ? "space-x-0" : "space-x-3")}>
            {icon}
            <span className={cn(
                "text-sm truncate transition-all duration-200 ease-in-out",
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            )}>
                {label}
            </span>
        </div>
        {!isCollapsed && actionIcon && (
            <Button variant="ghost" size="icon" className="cursor-pointer opacity-0 group-hover:opacity-100 text-gray-600 h-auto p-1">
                {actionIcon}
            </Button>
        )}
    </div>
));

SidebarItem.displayName = "SidebarItem";