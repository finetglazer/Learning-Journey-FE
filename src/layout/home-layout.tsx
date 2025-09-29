"use client"

import { TreeNode } from "@/model/tree-node";
import { CollapsibleTree } from "../components/core/collapsible-tree/collapsible-tree";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cloneElement, Dispatch, isValidElement, SetStateAction } from "react";
import { Divider } from "@/components/core/divider/divider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavbarGroup } from "@/model/navbar-group-model";
import { cn } from "@/lib/utils";

export interface HomeLayoutProps {
    sidebar?: {
        header?: {
            prefix?: JSX.Element,
            title?: string,
            description?: string,
        },
        upperItems?: TreeNode[],
        lowerItems?: TreeNode[],
        selectedItemId?: string | null,
        setSelectedItemId?: Dispatch<SetStateAction<string | null>>,
    },
    navbar?: {
        groups: NavbarGroup[];
        selectedNavbarGroupId?: string | null;
        setSelectedNavbarGroupId?: Dispatch<SetStateAction<string | null>>,
    },
    children?: React.ReactNode,
};

export const HomeLayout = (props: HomeLayoutProps) => {
    const {
        sidebar,
        navbar,
        children,
    } = props;

    const {
        upperItems,
        lowerItems,
        header,
        selectedItemId,
        setSelectedItemId,
    } = sidebar || {};

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="!h-[100vh] w-full rounded-lg border"
        >
            <ResizablePanel defaultSize={5} minSize={5} maxSize={6}>
                <div className="flex flex-col items-center bg-[#91FFD9] h-full w-full pt-5 gap-4">
                    {(navbar?.groups || []).map((group: NavbarGroup) => {
                        const groupIconProps = group?.icon?.props;
                        const cloneGroupIcon = isValidElement(group?.icon)
                            ? cloneElement(group?.icon, {
                                ...groupIconProps,
                                className: cn("h-9 w-9", groupIconProps?.className),
                            })
                            : null;
                        return (
                            <button
                                key={group.groupId}
                                onClick={() => {
                                    if (typeof navbar?.setSelectedNavbarGroupId === "function") {
                                        navbar?.setSelectedNavbarGroupId(group.groupId);
                                    }
                                }}
                                className={cn(
                                    "flex flex-col items-center justify-center p-2 w-full transition-colors relative",
                                    navbar?.selectedNavbarGroupId === group.groupId
                                        ? "text-gray-800"
                                        : "text-gray-500 hover:bg-black/5 rounded-md"
                                )}
                            >
                                {navbar?.selectedNavbarGroupId === group.groupId && (
                                    <span className="absolute top-1/2 -translate-y-1/2 left-0 h-3/4 w-1 bg-black rounded-r-md" />
                                )}
                                <div className="grid place-items-center w-full">
                                    {cloneGroupIcon}

                                    <span className="text-sm mt-1 font-medium truncate">
                                        {group.name}
                                    </span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={23} minSize={15} maxSize={30} className="bg-sidebar-accent">
                <div className="flex items-center ml-4 mt-5">
                    {isValidElement(header?.prefix) ? header?.prefix : null}
                    <div className="ml-3">
                        <p className="font-bold text-[1.2rem]">{header?.title || ""}</p>
                        <p className="text-[1.2rem] font-thin">{header?.description || ""}</p>
                    </div>
                </div>
                <ScrollArea className="h-[calc(100%-32px)]">
                    <div className="mt-7 -ml-2">
                        {(upperItems || []).map((item: TreeNode) =>
                            <CollapsibleTree
                                root={item}
                                selectedItemId={selectedItemId}
                                setSelectedItemId={setSelectedItemId}
                            />
                        )}
                    </div>
                    <Divider className="mt-5 ml-4 max-w-90 w-[calc(100%-40px)]" />
                    <div className="mt-7 -ml-2">
                        {(lowerItems || []).map((item: TreeNode) =>
                            <CollapsibleTree
                                root={item}
                                selectedItemId={selectedItemId}
                                setSelectedItemId={setSelectedItemId}
                            />
                        )}
                    </div>
                </ScrollArea>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={80}>
                {isValidElement(children) ? children : null}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};