import { Button } from "@/components/ui/button";

export interface SidebarSectionProps {
    title: string;
    action?: React.ReactNode;
};

export const SidebarSection = ({ title, action }: SidebarSectionProps) => (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</h3>
        {action && (
            <Button className="text-gray-600 hover:bg-gray-100 bg-transparent cursor-pointer">
                {action}
            </Button>
        )}
    </div>
);