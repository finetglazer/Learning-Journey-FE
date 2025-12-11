"use client";

// ✅ FIX 1: In Tiptap v3, menus are imported from '@tiptap/react/menus'
import { BubbleMenu } from "@tiptap/react/menus";
import { isTextSelection } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    MessageSquarePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorBubbleMenuProps {
    editor: Editor;
    onAddComment: () => void;
    className?: string;
}

export function EditorBubbleMenu({ editor, onAddComment, className }: EditorBubbleMenuProps) {
    if (!editor) return null;

    return (
        <BubbleMenu
            editor={editor}
            pluginKey="bubbleMenu"
            // ✅ FIX 2: 'tippyOptions' is removed in v3.
            // Tiptap v3 uses Floating UI defaults which are usually fine.
            // If you need to customize position, use the new 'options' prop (not shown here as defaults work well).
            shouldShow={({ editor, from, to, state, view }) => {
                const { selection } = state;
                const isText = isTextSelection(selection);
                const hasSelection = from !== to;

                if (!hasSelection || !isText) {
                    return false;
                }

                return editor.isEditable;
            }}
            className={cn(
                "flex items-center gap-1 p-1 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
                className
            )}
        >
            <MenuButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive("bold")}
                icon={<Bold className="w-4 h-4" />}
                label="Bold"
            />
            <MenuButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive("italic")}
                icon={<Italic className="w-4 h-4" />}
                label="Italic"
            />
            <MenuButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive("underline")}
                icon={<Underline className="w-4 h-4" />}
                label="Underline"
            />
            <MenuButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive("strike")}
                icon={<Strikethrough className="w-4 h-4" />}
                label="Strike"
            />
            <MenuButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive("code")}
                icon={<Code className="w-4 h-4" />}
                label="Code"
            />

            <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-1" />

            <MenuButton
                onClick={onAddComment}
                isActive={false}
                icon={<MessageSquarePlus className="w-4 h-4 text-blue-500" />}
                label="Comment"
            />
        </BubbleMenu>
    );
}

interface MenuButtonProps {
    onClick: () => void;
    isActive: boolean;
    icon: React.ReactNode;
    label: string;
}

function MenuButton({ onClick, isActive, icon, label }: MenuButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300",
                isActive && "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
            )}
            type="button"
            title={label}
        >
            {icon}
        </button>
    );
}