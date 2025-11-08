import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SidebarItemProps {
    id: string;
    icon: React.ReactNode;
    label: string | React.ReactNode;
    onClick?: () => void;
    actionIcon?: React.ReactNode;
    isActive?: boolean;
};

export const SidebarItem = ({ icon, label, onClick, actionIcon = null, isActive = false }: SidebarItemProps) => (
    <div
        onClick={onClick}
        className={cn(
            "flex items-center justify-between px-4 py-2 mx-2 rounded-md cursor-pointer",
            isActive
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-100",
            "group"
        )}
    >
        <div className="flex items-center space-x-3">
            {icon}
            <span className="text-sm">{label}</span>
        </div>
        {actionIcon && (
            <Button className="cursor-pointer opacity-0 group-hover:opacity-100 text-gray-600 hover:bg-gray-100 bg-transparent">
                {actionIcon}
            </Button>
        )}
    </div>
);