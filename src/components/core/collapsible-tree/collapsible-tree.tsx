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

const ITEM_SELECTED_TEXT_COLOR = "text-blue-500";

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
    const [pr, setPr] = useState<number>(4);

    const prefixProps = prefix?.props;

    const clonePrefix = prefix && isValidElement(prefix)
        ? cloneElement(prefix, {
            ...prefixProps,
            className: cn(
                "h-10 w-10 mt-3 ml-2 text-gray-500", 
                prefixProps?.className, 
                id === selectedItemId ? ITEM_SELECTED_TEXT_COLOR : ""
            )
        } as any)
        : <Fragment />;

    const chevronClassName = cn("text-gray-500", id === selectedItemId ? ITEM_SELECTED_TEXT_COLOR : "");

    useEffect(() => {
        switch (level) {
            case 0:
                setMl(2);
                setPr(1);
                break;
            case 1:
                setMl(3.5);
                setPr(0.5);
                break;
            case 2:
                setMl(7);
                setPr(0.25);
                break;
            default:
                setMl(9);
                setPr(0.25);
        }
    }, []);

    const onClick = () => {
        setOpen(!open);
        if (typeof setSelectedItemId === "function") {
            setSelectedItemId(id);
        }
    };

    return (
        <div style={{paddingRight: `${pr}rem`}}>
            <div
                style={{ marginLeft: `${ml}rem`, paddingLeft: "12px" }}
                className={`flex items-center cursor-pointer ${id === selectedItemId ? "bg-blue-200" : ""} rounded-md`}
                onClick={onClick}
                id={id}
            >
                {(children || []).length ?
                    (open ? <ChevronDown className={chevronClassName} />
                        : <ChevronRight className={chevronClassName} />)
                    : null}
                {clonePrefix}
                <span className={cn("text-[1.3rem] text-gray-700 -ml-1", id === selectedItemId ? ITEM_SELECTED_TEXT_COLOR : "")}>{label}</span>
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