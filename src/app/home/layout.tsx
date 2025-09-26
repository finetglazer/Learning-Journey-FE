"use client"

import { Icon } from "@/components/core/icon/icon";
import { HomeLayout } from "@/layout/home-layout";
import { useState } from "react";

export default function HomePageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    return (
        <HomeLayout
            sidebar={{
                selectedItemId: selectedItemId,
                setSelectedItemId: setSelectedItemId,
                header: {
                    title: "Product Web",
                    description: "Classic software project",
                    prefix: <Icon name="AtIcon" className="h-12 w-12 text-blue-400" />
                },
                upperItems: [
                    {
                        id: "Category ",
                        label: "Category ",
                        level: 0,
                        prefix: <Icon name="StackIcon" />,
                        children: [
                            {
                                id: "Category b",
                                label: "Category b",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                                children: [
                                    {
                                        id: "Category d",
                                        label: "Category d",
                                        level: 2,
                                        prefix: <Icon name="StackIcon" />,
                                    },
                                ],
                            },
                            {
                                id: "Category c",
                                label: "Category c",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                            },
                        ]
                    },
                    {
                        id: "Category ",
                        label: "Category ",
                        level: 0,
                        prefix: <Icon name="StackIcon" />,
                        children: [
                            {
                                id: "Category b",
                                label: "Category b",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                                children: [
                                    {
                                        id: "Category d",
                                        label: "Category d",
                                        level: 2,
                                        prefix: <Icon name="StackIcon" />,
                                    },
                                ],
                            },
                            {
                                id: "Category c",
                                label: "Category c",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                            },
                        ]
                    },
                    {
                        id: "Category ",
                        label: "Category ",
                        level: 0,
                        prefix: <Icon name="StackIcon" />,
                        children: [
                            {
                                id: "Category b",
                                label: "Category b",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                                children: [
                                    {
                                        id: "Category d",
                                        label: "Category d",
                                        level: 2,
                                        prefix: <Icon name="StackIcon" />,
                                    },
                                ],
                            },
                            {
                                id: "Category c",
                                label: "Category c",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                            },
                        ]
                    },
                    {
                        id: "Category ",
                        label: "Category ",
                        level: 0,
                        prefix: <Icon name="StackIcon" />,
                        children: [
                            {
                                id: "Category b",
                                label: "Category b",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                                children: [
                                    {
                                        id: "Category d",
                                        label: "Category d",
                                        level: 2,
                                        prefix: <Icon name="StackIcon" />,
                                    },
                                ],
                            },
                            {
                                id: "Category c",
                                label: "Category c",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                            },
                        ]
                    },
                ],
                lowerItems: [
                    {
                        id: "Category ",
                        label: "Category ",
                        level: 0,
                        prefix: <Icon name="StackIcon" />,
                        children: [
                            {
                                id: "Category b",
                                label: "Category b",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                                children: [
                                    {
                                        id: "Category d",
                                        label: "Category d",
                                        level: 2,
                                        prefix: <Icon name="StackIcon" />,
                                    },
                                ],
                            },
                            {
                                id: "Category c",
                                label: "Category c",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                            },
                        ]
                    },
                    {
                        id: "Category ",
                        label: "Category ",
                        level: 0,
                        prefix: <Icon name="StackIcon" />,
                        children: [
                            {
                                id: "Category b",
                                label: "Category b",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                                children: [
                                    {
                                        id: "Category d",
                                        label: "Category d",
                                        level: 2,
                                        prefix: <Icon name="StackIcon" />,
                                    },
                                ],
                            },
                            {
                                id: "Category c",
                                label: "Category c",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                            },
                        ]
                    },
                    {
                        id: "Category ",
                        label: "Category ",
                        level: 0,
                        prefix: <Icon name="StackIcon" />,
                        children: [
                            {
                                id: "Category b",
                                label: "Category b",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                                children: [
                                    {
                                        id: "Category d",
                                        label: "Category d",
                                        level: 2,
                                        prefix: <Icon name="StackIcon" />,
                                    },
                                ],
                            },
                            {
                                id: "Category c",
                                label: "Category c",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                            },
                        ]
                    },
                    {
                        id: "Category ",
                        label: "Category ",
                        level: 0,
                        prefix: <Icon name="StackIcon" />,
                        children: [
                            {
                                id: "Category b",
                                label: "Category b",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                                children: [
                                    {
                                        id: "Category d",
                                        label: "Category d",
                                        level: 2,
                                        prefix: <Icon name="StackIcon" />,
                                    },
                                ],
                            },
                            {
                                id: "Category c",
                                label: "Category c",
                                level: 1,
                                prefix: <Icon name="StackIcon" />,
                            },
                        ]
                    },
                ],
            }}
            children={children}
        />
    );
};