"use client"

import { Icon } from "@/components/core/icon/icon";
import { HomeLayout } from "@/layout/home-layout";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility
import { TreeNode } from "@/model/tree-node";

// 1. Define the interface for a navbar group item
export interface NavbarGroup {
    groupId: string;
    name: string;
    icon?: JSX.Element;
};

export default function HomePageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const navbarGroups: NavbarGroup[] = [
        {
            groupId: "group-1",
            name: "Community",
            icon: <Icon name="StackIcon" />
        },
        {
            groupId: "group-2",
            name: "Files",
            icon: <Icon name="StackIcon" />
        },
        {
            groupId: "group-3",
            name: "Calendar",
            icon: <Icon name="StackIcon" />
        },
    ];

    const [selectedNavbarGroupId, setSelectedNavbarGroupId] = useState<string | null>(navbarGroups[0]?.groupId || null);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const sidebarUpperItems: TreeNode[] = [
        {
            id: "category-group-I",
            label: "Category group I",
            type: "group-root",
            level: 0,
            parentGroupId: "group-1",
            children: [
                {
                    id: "Category A-1",
                    label: "Community Item 1",
                    level: 0,
                    prefix: <Icon name="StackIcon" />,
                },
                {
                    id: "Category A-2",
                    label: "Community Item 2",
                    level: 0,
                    prefix: <Icon name="StackIcon" />,
                },
            ]
        },
        {
            id: "category-group-II",
            label: "Category group II",
            type: "group-root",
            level: 0,
            parentGroupId: "group-2",
            children: [
                {
                    id: "Category B-1",
                    label: "Files Item 1",
                    level: 0,
                    prefix: <Icon name="StackIcon" />,
                },
            ]
        }
    ];

    const sidebarLowerItems: TreeNode[] = [
        {
            id: "lower-category-1",
            label: "Shared Community Item",
            level: 0,
            prefix: <Icon name="StackIcon" />,
            parentGroupId: "group-1",
        },
        {
            id: "lower-category-2",
            label: "Archived Files",
            level: 0,
            prefix: <Icon name="StackIcon" />,
            parentGroupId: "group-2",
        },
    ];

    const filteredUpperItems = sidebarUpperItems.filter(item => item.parentGroupId === selectedNavbarGroupId);
    const filteredLowerItems = sidebarLowerItems.filter(item => item.parentGroupId === selectedNavbarGroupId);

    return (
        <HomeLayout
            navbar={{
                groups: navbarGroups,
                selectedNavbarGroupId: selectedNavbarGroupId,
                setSelectedNavbarGroupId: setSelectedNavbarGroupId,
            }}
            sidebar={{
                selectedItemId: selectedItemId,
                setSelectedItemId: setSelectedItemId,
                header: {
                    title: "Product Web",
                    description: "Classic software project",
                    prefix: <Icon name="AtIcon" className="h-12 w-12 text-blue-400" />
                },
                upperItems: filteredUpperItems,
                lowerItems: filteredLowerItems,
            }}
            children={children}
        />
    );
};