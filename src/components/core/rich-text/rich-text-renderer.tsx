"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { SlashCommands } from "../notion-editor/extensions/slash-commands";
import Placeholder from "@tiptap/extension-placeholder";
import React, { useEffect } from "react";

interface RichTextRendererProps {
    content: any; // The Tiptap JSON object
    className?: string;
}

export const RichTextRenderer = ({ content, className }: RichTextRendererProps) => {
    const editor = useEditor({
        editable: false, // Read-only mode
        immediatelyRender: false,
        extensions: [
            StarterKit,
            // Include other extensions if needed to match the creation editor
            SlashCommands,
            Placeholder.configure({
                placeholder: '',
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: `prose prose-sm dark:prose-invert max-w-none focus:outline-none ${className || ""}`,
            },
        },
    });

    // Update content if it changes externally
    useEffect(() => {
        if (editor && content) {
            // Only set content if it's different to avoid loops or unnecessary updates, 
            // though standard behavior usually handles this. 
            // For a renderer, content likely won't change often after initial load.
            // But if we navigate between posts, it might.
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return <EditorContent editor={editor} />;
};
