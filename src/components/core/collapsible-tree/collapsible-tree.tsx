"use client"

import { cn } from "@/lib/utils";
import { TreeNode } from "@/model/tree-node";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cloneElement, Dispatch, Fragment, isValidElement, SetStateAction, useState } from "react";

export interface CollapsibleTreeProps {
    root: TreeNode;
    selectedItemId?: string | null;
    setSelectedItemId?: Dispatch<SetStateAction<string | null>>;
};

export const CollapsibleTree = (props: CollapsibleTreeProps) => {
    const {
        root,
        selectedItemId,
        setSelectedItemId,
    } = props;

    const {
        id,
        type,
        level,
        prefix,
        label,
        children,
    } = root;

    const [open, setOpen] = useState<boolean>(false);

    const marginLeftRem = 0.5 + (level * 1.5);
    const paddingRightRem = 1;

    const prefixProps = prefix?.props;

    const clonePrefix = prefix && isValidElement(prefix)
        ? cloneElement(prefix, {
            ...prefixProps,
            className: cn(
                "h-8 w-8 mt-3 ml-2 text-gray-500 shrink-0",
                prefixProps?.className,
                id === selectedItemId && type !== "group-root" ? "text-blue-500" : ""
            )
        } as any)
        : <Fragment />;

    const chevronClassName = cn(
        "text-gray-500 shrink-0",
        id === selectedItemId && type !== "group-root" ? "text-blue-500" : "",
        !prefix ? "h-5 w-5" : "",
        { "ml-4": type === "group-root" }
    );

    const onClick = () => {
        setOpen(!open);
        if (typeof setSelectedItemId === "function") {
            setSelectedItemId(id);
        }
    };

    return (
        <div>
            <div
                style={{ marginLeft: `${marginLeftRem}rem` }}
                className={cn("cursor-pointer px-2", { "mb-2": type === "group-root" })}
                onClick={onClick}
                id={id}
            >
                <div
                    style={{ paddingRight: `${paddingRightRem}rem` }}
                    className={cn(
                        "flex items-center rounded-md",
                        { "bg-blue-200": id === selectedItemId && type !== "group-root" }
                    )}
                >
                    <div className={cn("flex items-center truncate", { "flex-grow": type !== "group-root" })}>
                        {clonePrefix}
                        <span className={cn(
                            "text-[1.2rem] text-gray-700 -ml-1 truncate",
                            { "text-blue-500": id === selectedItemId && type !== "group-root" },
                            { "text-[1.2rem] font-semibold": type === "group-root" },
                            { "ml-2.5": !prefix }
                        )}>
                            {label}
                        </span>
                    </div>
                    <div className={type === "group-root" ? "flex-grow" : ""}>
                        {(children || []).length ?
                            (open ? <ChevronDown className={chevronClassName} />
                                : <ChevronRight className={chevronClassName} />)
                            : <div className="w-6 shrink-0" />
                        }
                    </div>
                </div>
            </div>
            <div
                className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-in-out",
                    open ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"
                )}
            >
                <div className="overflow-hidden">
                    <div className="relative">
                        {open && type !== "group-root" && (children || []).length > 0 && (
                            <span
                                className="absolute top-0 bottom-0 w-[2px] bg-gray-300"
                                style={{ left: "2.25rem" }}
                            />
                        )}
                        {(children || []).map((child: TreeNode) =>
                            <CollapsibleTree
                                key={child.id}
                                root={child}
                                selectedItemId={selectedItemId}
                                setSelectedItemId={setSelectedItemId}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};