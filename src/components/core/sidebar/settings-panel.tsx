import { ArrowLeft } from "lucide-react";
import React from "react";
import { SidebarItem, SidebarItemProps } from "./components/sidebar-item";
import { SidebarSection } from "./components/sidebar-section";
import { SidebarSectionConfig } from "./home-panel";
import { Button } from "@/components/ui/button";

export interface SettingsPanelProps {
    sections: SidebarSectionConfig[];
    onShowHome: () => void;
    activeItem: string;
};

export const SettingsPanel = ({ sections, onShowHome, activeItem }: SettingsPanelProps) => {
    return (
        <div className="w-full h-full flex-shrink-0 bg-white">
            <div className="flex items-center p-4 border-b border-gray-200">
                <Button
                    onClick={onShowHome}
                    className="cursor-pointer p-1 -ml-2 mr-2 text-gray-600 hover:bg-gray-100 bg-transparent rounded-md"
                >
                    <ArrowLeft size={18} />
                </Button>
                <h3 className="font-semibold text-gray-900">Settings</h3>
            </div>
            <div className="py-2 overflow-y-auto h-[calc(100vh-65px)]">
                {sections.map((section: SidebarSectionConfig, index: number) => (
                    <React.Fragment key={section.title || index}>
                        <SidebarSection title={section.title} action={section.action} />
                        {section.items.map((item: SidebarItemProps) => (
                            <SidebarItem
                                key={item.id}
                                id={item.id}
                                icon={item.icon}
                                label={item.label}
                                onClick={item.onClick}
                                actionIcon={item.actionIcon}
                                isActive={activeItem === item.id}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};