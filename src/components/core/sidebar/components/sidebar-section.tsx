import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SidebarSectionProps {
    title: string;
    action?: React.ReactNode;
    isCollapsed?: boolean;
};

export const SidebarSection = ({ title, action, isCollapsed = false }: SidebarSectionProps) => {
    if (!title) return <div className="mt-2" />;
    return (
        <div className={cn(
            "flex items-center justify-between px-4 pt-4 pb-2 transition-all duration-300 ease-in-out",
            isCollapsed ? "opacity-0 h-0 p-0 m-0" : "opacity-100 h-auto"
        )}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">{title}</h3>
            {action && (
                // FIX: Add 'asChild' here.
                // This tells React: "Don't render a new button tag, just apply these button styles to the 'action' element itself."
                <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-gray-600 hover:bg-gray-100 bg-transparent cursor-pointer p-1 h-auto w-auto"
                >
                    {action}
                </Button>
            )}
        </div>
    );
};