"use client"

import { cn } from "@/lib/utils";
import { TreeNode } from "@/model/tree-node";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cloneElement, Dispatch, Fragment, isValidElement, SetStateAction, useEffect, useState } from "react";

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
        level,
        prefix,
        label,
        children,
    } = root;

    const [open, setOpen] = useState<boolean>(false);
    const [ml, setMl] = useState<number>(2);
    const [mrPx, setMrPx] = useState<number>(50);

    const prefixProps = prefix?.props;

    const clonePrefix = prefix && isValidElement(prefix)
        ? cloneElement(prefix, {
            ...prefixProps,
            className: cn("h-10 w-10 mt-3 ml-2 text-gray-500", prefixProps?.className)
        } as any)
        : <Fragment />;

    const chevronClassName = "text-gray-500";

    useEffect(() => {
        switch (level) {
            case 0:
                setMl(2);
                setMrPx(50);
                break;
            case 1:
                setMl(3.5);
                setMrPx(60);
                break;
            case 2:
                setMl(7);
                setMrPx(70);
                break;
            default:
                setMl(9);
                setMrPx(80);
        }
    }, []);

    const onClick = () => {
        setOpen(!open);
        if (typeof setSelectedItemId === "function") {
            setSelectedItemId(id);
        }
    };

    return (
        <div>
            <div
                style={{ marginLeft: `${ml}rem`, width: `calc(100%-${mrPx}px)` }}
                className={`flex items-center cursor-pointer ${id === selectedItemId ? "bg-blue-200" : ""} rounded-md`}
                onClick={onClick}
                id={id}
            >
                {(children || []).length ?
                    (open ? <ChevronDown className={chevronClassName} />
                        : <ChevronRight className={chevronClassName} />)
                    : null}
                {clonePrefix}
                <span className="text-[1.3rem] text-gray-700 -ml-1">{label}</span>
            </div>
            {open && (children || []).length ? (
                <>
                    {(children || []).map((child: TreeNode) =>
                        <CollapsibleTree
                            root={child}
                            selectedItemId={selectedItemId}
                            setSelectedItemId={setSelectedItemId}
                        />
                    )}
                </>
            ) : null}
        </div>
    );
};