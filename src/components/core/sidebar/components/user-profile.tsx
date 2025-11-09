import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip } from "antd";
import { PanelLeft, User } from "lucide-react";

export const UserProfile = ({ isCollapsed = false, onToggleCollapse }: { isCollapsed: boolean, onToggleCollapse: () => void }) => (
    <div className={cn(
        "flex items-center p-4 border-b border-gray-200 h-[81px] transition-all duration-300 relative",
        isCollapsed ? "justify-center px-2" : "justify-between"
    )}>
        <div className={cn("flex items-center", isCollapsed ? "space-x-0" : "space-x-3")}>
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-gray-600" />
            </div>
            {!isCollapsed && (
                <div className="overflow-hidden">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">{localStorage.getItem("displayName")}</h4>
                    <Tooltip
                        title={localStorage.getItem("email")}
                        placement="bottom"
                    >
                        <p className="text-xs text-gray-500 overflow-ellipsis w-[170px]">{localStorage.getItem("email")}</p>
                    </Tooltip>
                </div>
            )}
        </div>
        {!isCollapsed && (
            <Button
                onClick={onToggleCollapse}
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1 text-gray-600 hover:bg-gray-100 h-10 w-10 cursor-pointer"  // Made button smaller
            >
                <PanelLeft size={18} />
            </Button>
        )}
        {isCollapsed && (
            <Button
                onClick={onToggleCollapse}
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1 text-gray-600 hover:bg-gray-100 h-8 w-8 cursor-pointer"  // Made button smaller
            >
                <PanelLeft size={18} />
            </Button>
        )}
    </div>
);