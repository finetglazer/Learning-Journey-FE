import { Button } from "@/components/ui/button";
import { SidebarSectionConfig } from "./home-panel";
import { ArrowLeft, PanelLeft, PanelRight } from "lucide-react";
import React from "react";
import { SidebarItem, SidebarItemProps } from "./components/sidebar-item";
import { cn } from "@/lib/utils";
import { SidebarSection } from "./components/sidebar-section";

export interface SettingsPanelProps {
    sections: SidebarSectionConfig[];
    onShowHome: () => void;
    activeItem: string;
    isCollapsed: boolean;
    onToggleCollapse: (e: any) => void;
};
export const SettingsPanel = ({ sections, onShowHome, activeItem, isCollapsed, onToggleCollapse }: SettingsPanelProps) => {
    return (
        <div className="w-full h-full flex-shrink-0 bg-white flex flex-col">
            <div className="flex items-center p-4 border-b border-gray-200 h-[81px] shrink-0">
                <Button
                    onClick={onShowHome}
                    variant="ghost"
                    size="icon"
                    className="p-1 -ml-2 mr-2 text-gray-600 hover:bg-gray-100 h-8 w-8 cursor-pointer"
                >
                    <ArrowLeft size={18} />
                </Button>
                <h3 className={cn(
                    "font-semibold text-gray-900 overflow-hidden whitespace-nowrap transition-all duration-200 ease-in-out",
                    isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                )}>
                    Settings
                </h3>
                <Button
                    onClick={(e) => {
                        onToggleCollapse(e);
                    }}
                    variant="ghost"
                    size="icon"
                    className={cn("text-gray-600 cursor-pointer hover:bg-gray-100 h-8 w-8", isCollapsed ? "ml-0" : "ml-auto")}
                >
                    {isCollapsed ? <PanelRight size={18} /> : <PanelLeft size={18} />}
                </Button>
            </div>
            <div className="py-2 overflow-y-auto overflow-x-hidden h-[calc(100vh-81px)]">
                {sections.map((section: SidebarSectionConfig, index: number) => (
                    <React.Fragment key={section.title || index}>
                        <SidebarSection title={section.title} action={section.action} isCollapsed={isCollapsed} />
                        {section.items.map((item: SidebarItemProps) => (
                            <SidebarItem
                                key={item.id}
                                id={item.id}
                                icon={item.icon}
                                label={item.label}
                                onClick={item.onClick}
                                actionIcon={item.actionIcon}
                                isActive={activeItem === item.id}
                                isCollapsed={isCollapsed}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};