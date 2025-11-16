import React from "react";
import { SidebarItem, SidebarItemProps } from "./components/sidebar-item";
import { SidebarSection } from "./components/sidebar-section";
import { UserProfile } from "./components/user-profile";

export interface SidebarSectionConfig {
    title: string;
    action?: React.ReactNode;
    items: SidebarItemProps[];
}
export interface HomePanelProps {
    sections: SidebarSectionConfig[];
    activeItem: string;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
};

export const HomePanel = ({ sections, activeItem, isCollapsed, onToggleCollapse }: HomePanelProps) => {
    return (
        <div className="w-full h-full flex-shrink-0 flex flex-col">
            <UserProfile isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} />
            <div className="py-2 overflow-y-auto overflow-x-hidden h-[calc(100vh-81px)]">
                {sections.map((section, index: number) => (
                    <React.Fragment key={section.title || index}>
                        <SidebarSection title={section.title} action={section.action} isCollapsed={isCollapsed} />
                        {section.items.map(item => (
                            <SidebarItem
                                key={item.id}
                                id={item.id}
                                icon={item.icon}
                                label={item.label}
                                onClick={item.onClick}
                                actionIcon={item.actionIcon}
                                isActive={activeItem === item.id}
                                isCollapsed={isCollapsed}
                                menu={item.menu}
                            />
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};