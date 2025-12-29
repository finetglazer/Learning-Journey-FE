"use client";

import { Button } from "@/components/ui/button";
import { AppContext } from "@/hooks/app-context";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useContext, useState } from "react";
import { finalize } from "rxjs";
import { toast } from "sonner";
import { SlashCommands } from "../notion-editor/extensions/slash-commands";
import { PostDetailContext } from "./post-detail-context";
import { CreateAnswerRequest } from "@/repository/post-reposiory";

export interface PostDetailAnswerEditorProps { }

export function PostDetailAnswerEditor({ }: PostDetailAnswerEditorProps) {
    const { postRepository, userId } = useContext(AppContext);
    const { postDetailData, onHasMoreAnswer } = useContext(PostDetailContext);
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

    const postAnswer = () => {
        if (!editor || !postDetailData || editor.isEmpty || !postRepository || !userId) return;

        setIsSubmitting(true);

        const request: CreateAnswerRequest = {
            content: editor.getJSON() as any,
        };

        postRepository.submitAnswer(userId, postDetailData.postId, request)
            .pipe(finalize(() => setIsSubmitting(false)))
            .subscribe({
                next: (res) => {
                    if (res?.status) {
                        toast.success(res?.msg || res?.message);
                        editor.commands.clearContent();
                        // Reload answers to show the new one at the top (if sort is newest) or just refresh
                        onHasMoreAnswer(true);
                    }
                    else {
                        toast.error(res?.msg || res?.message);
                    }
                },
                error: (err) => {
                    toast.error("Failed to post answer");
                    console.error(err);
                }
            });
    };

    return (
        <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-gray-800">Your Answer</h3>
            <EditorContent editor={editor} />
            <div className="flex justify-end">
                <Button
                    className="bg-[#0EB4FC] cursor-pointer hover:bg-[#0EB4FC]/90 text-white min-w-[120px]"
                    onClick={postAnswer}
                    disabled={isSubmitting || !editor || editor.isEmpty}
                >
                    {isSubmitting ? "Posting..." : "Post Answer"}
                </Button>
            </div>
        </div>
    );
}
