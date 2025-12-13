"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Edit2, Trash2, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentActionButtonsProps {
    isOwner: boolean;       // Is the current user the creator?
    isResolved?: boolean;   // Is the thread already resolved?
    canEditDoc: boolean;    // Does user have general "Member/Owner" rights?

    // Actions
    onResolve?: () => void;
    onReopen?: () => void;
    onEdit?: () => void;
    onDelete: () => void;

    // Styling
    variant?: "sidebar" | "floating" | "reply";
}

export function CommentActionButtons({
                                         isOwner,
                                         isResolved = false,
                                         canEditDoc,
                                         onResolve,
                                         onReopen,
                                         onEdit,
                                         onDelete,
                                         variant = "sidebar"
                                     }: CommentActionButtonsProps) {
    // 1. If user is read-only, show nothing
    if (!canEditDoc) return null;

    return (
        <div className={cn(
            "flex items-center gap-1 transition-opacity",
            variant === "floating" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
            {/* RESOLVE / REOPEN: Visible to ALL Editors */}
            {!isResolved && onResolve && (
                <ActionButton
                    icon={<CheckCircle className="h-4 w-4 text-green-600" />}
                    onClick={onResolve}
                    label="Resolve"
                />
            )}
            {isResolved && onReopen && (
                <ActionButton
                    icon={<RotateCcw className="h-3.5 w-3.5 text-blue-600" />}
                    onClick={onReopen}
                    label="Reopen"
                />
            )}

            {/* EDIT: Visible ONLY to Creator */}
            {isOwner && onEdit && !isResolved && (
                <ActionButton
                    icon={<Edit2 className="h-3.5 w-3.5 text-gray-500" />}
                    onClick={onEdit}
                    label="Edit"
                />
            )}

            {/* DELETE: Visible ONLY to Creator */}
            {isOwner && (
                <ActionButton
                    icon={variant === "reply" ? <X className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5 text-red-500" />}
                    onClick={onDelete}
                    label="Delete"
                    danger={variant !== "reply"}
                />
            )}
        </div>
    );
}

function ActionButton({ icon, onClick, label, danger }: any) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn(
                "h-6 w-6 p-0 rounded-full",
                danger ? "hover:bg-red-100 dark:hover:bg-red-900/30" : "hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            title={label}
        >
            {icon}
        </Button>
    );
}