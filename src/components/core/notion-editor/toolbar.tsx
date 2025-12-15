"use client";

import { Editor } from "@tiptap/react";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    MessageSquarePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ToolbarProps {
    editor: Editor | null;
    onAddComment?: () => void;
    canEdit?: boolean;
}

interface ToolbarButtonProps {
    icon: React.ReactNode;
    tooltip: string;
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
}

function ToolbarButton({
                           icon,
                           tooltip,
                           onClick,
                           isActive,
                           disabled,
                       }: ToolbarButtonProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClick}
                        disabled={disabled}
                        className={cn(
                            "h-8 w-8 p-0",
                            isActive && "bg-gray-200 dark:bg-gray-700"
                        )}
                    >
                        {icon}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function Toolbar({ editor, onAddComment, canEdit = true }: ToolbarProps) {
    if (!editor) return null;

    const hasSelection = !editor.state.selection.empty;

    return (
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
            {/* Undo/Redo */}
            <ToolbarButton
                icon={<Undo className="h-4 w-4" />}
                tooltip="Undo"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!canEdit || !editor.can().undo()}
            />
            <ToolbarButton
                icon={<Redo className="h-4 w-4" />}
                tooltip="Redo"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!canEdit || !editor.can().redo()}
            />

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Text formatting */}
            <ToolbarButton
                icon={<Bold className="h-4 w-4" />}
                tooltip="Bold"
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                disabled={!canEdit}
            />
            <ToolbarButton
                icon={<Italic className="h-4 w-4" />}
                tooltip="Italic"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                disabled={!canEdit}
            />
            <ToolbarButton
                icon={<Underline className="h-4 w-4" />}
                tooltip="Underline"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive("underline")}
                disabled={!canEdit}
            />
            <ToolbarButton
                icon={<Strikethrough className="h-4 w-4" />}
                tooltip="Strikethrough"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                disabled={!canEdit}
            />
            <ToolbarButton
                icon={<Code className="h-4 w-4" />}
                tooltip="Code"
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive("code")}
                disabled={!canEdit}
            />

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Headings */}
            <ToolbarButton
                icon={<Heading1 className="h-4 w-4" />}
                tooltip="Heading 1"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive("heading", { level: 1 })}
                disabled={!canEdit}
            />
            <ToolbarButton
                icon={<Heading2 className="h-4 w-4" />}
                tooltip="Heading 2"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive("heading", { level: 2 })}
                disabled={!canEdit}
            />
            <ToolbarButton
                icon={<Heading3 className="h-4 w-4" />}
                tooltip="Heading 3"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive("heading", { level: 3 })}
                disabled={!canEdit}
            />

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Lists */}
            <ToolbarButton
                icon={<List className="h-4 w-4" />}
                tooltip="Bullet List"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive("bulletList")}
                disabled={!canEdit}
            />
            <ToolbarButton
                icon={<ListOrdered className="h-4 w-4" />}
                tooltip="Numbered List"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive("orderedList")}
                disabled={!canEdit}
            />
            <ToolbarButton
                icon={<Quote className="h-4 w-4" />}
                tooltip="Quote"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive("blockquote")}
                disabled={!canEdit}
            />

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Comments */}
            <ToolbarButton
                icon={<MessageSquarePlus className="h-4 w-4" />}
                tooltip="Add Comment"
                onClick={() => onAddComment?.()}
                disabled={!hasSelection}
            />
        </div>
    );
}