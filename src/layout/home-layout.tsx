import { TreeNode } from "@/model/tree-node";
import { CollapsibleTree } from "../components/core/collapsible-tree/collapsible-tree";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Dispatch, isValidElement, SetStateAction } from "react";
import { Divider } from "@/components/core/divider/divider";
import { ScrollArea } from "@/components/ui/scroll-area";

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
            <ResizablePanel defaultSize={27} minSize={15} maxSize={30} className="bg-sidebar-accent">
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