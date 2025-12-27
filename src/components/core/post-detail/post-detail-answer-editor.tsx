"use client";

import { Button } from "@/components/ui/button";
import { AppContext } from "@/hooks/app-context";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useContext, useState } from "react";
import { SlashCommands } from "../notion-editor/extensions/slash-commands";
import { PostDetailContext } from "./post-detail-context";

export interface PostDetailAnswerEditorProps {
    // You might want to pass onSubmit callback or handle it internally
}

export function PostDetailAnswerEditor({ }: PostDetailAnswerEditorProps) {
    const { postRepository, userId } = useContext(AppContext);
    const { postDetailData } = useContext(PostDetailContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [content, setContent] = useState<any>(null);
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Write your answer here...",
            }),
            SlashCommands,
        ],
        onUpdate: ({ editor }) => {
            setContent(editor.getJSON());
        },
        content: "",
        editorProps: {
            attributes: {
                class: "prose prose-sm dark:prose-invert focus:outline-none min-h-[300px] max-w-none p-4 border rounded-md border-input bg-transparent",
            },
        },
    });

    const handleSubmit = () => {
        if (!editor || !postDetailData || editor.isEmpty) return;

        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            editor.commands.setContent("");
        }, 1000);
    };

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Answer</h3>
            <EditorContent editor={editor} />
            <div className="flex justify-end">
                <Button
                    className="bg-[#0EB4FC] hover:bg-[#0EB4FC]/90 text-white min-w-[120px]"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !editor || editor.isEmpty}
                >
                    {isSubmitting ? "Posting..." : "Post Answer"}
                </Button>
            </div>
        </div>
    );
}
