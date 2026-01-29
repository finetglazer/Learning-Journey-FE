"use client";

import { Button } from "@/components/ui/button";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useContext, useState } from "react";
import { finalize } from "rxjs";
import { toast } from "sonner";
import { SlashCommands } from "../notion-editor/extensions/slash-commands";
import { ImageUploadWrapper } from "../notion-editor/extensions/image-upload-wrapper";
import { PostDetailContext } from "./post-detail-context";

export interface PostDetailAnswerEditFormProps {
    answerId: number;
    initialContent: any;
    onCancel: () => void;
}

export function PostDetailAnswerEditForm({
    answerId,
    initialContent,
    onCancel
}: PostDetailAnswerEditFormProps) {
    const { updateAnswer } = useContext(PostDetailContext);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image,
            Placeholder.configure({
                placeholder: "Write your answer here...",
            }),
            SlashCommands.configure({
                suggestion: {
                    hiddenCommands: ["File"],
                } as any,
            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: "prose prose-sm dark:prose-invert focus:outline-none min-h-[300px] max-w-none p-4 border rounded-md border-input bg-transparent",
            },
        },
    });

    const handleSave = () => {
        if (!editor || editor.isEmpty) return;

        setIsSubmitting(true);
        const content = editor.getJSON();

        updateAnswer(answerId, content)
            .pipe(finalize(() => setIsSubmitting(false)))
            .subscribe({
                next: (res) => {
                    if (res?.status) {
                        toast.success(res?.msg || res?.message || "Answer updated successfully");
                        onCancel(); // Close edit mode
                    } else {
                        toast.error(res?.msg || res?.message || "Failed to update answer");
                    }
                },
                error: (err) => {
                    toast.error("Failed to update answer");
                    console.error(err);
                }
            });
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <EditorContent editor={editor} />
            <div className="flex justify-end gap-2">
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="cursor-pointer"
                >
                    Cancel
                </Button>
                <Button
                    className="bg-[#0EB4FC] cursor-pointer hover:bg-[#0EB4FC]/90 text-white min-w-[100px]"
                    onClick={handleSave}
                    disabled={isSubmitting || !editor || editor.isEmpty}
                >
                    {isSubmitting ? "Saving..." : "Save"}
                </Button>
            </div>
            <ImageUploadWrapper editor={editor} projectId={-1} />
        </div>
    );
}
