"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CreatePostModel } from "@/model/create-post-model";
import { formService } from "@/service/form-service";
import { SlashCommands } from "../notion-editor/extensions/slash-commands";
import { useRef, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect } from "react";
import { MoreHorizontal, Plus, X } from "lucide-react";

export interface CreatePostModalProps {
    open: boolean;
    onClose: () => void;
}

export function CreatePostModal({ open, onClose }: CreatePostModalProps) {
    const { model, updateModel, onSubmitForm, loading } = formService.useForm(
        CreatePostModel,
        undefined,
        undefined,
        new CreatePostModel()
    );

    const [newTag, setNewTag] = useState("");
    const [isAddingTag, setIsAddingTag] = useState(false);
    const tagInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Click "/" to choose commands',
            }),
            SlashCommands,
        ],
        content: model.content,
        onUpdate: ({ editor }) => {
            updateModel("content", editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm dark:prose-invert focus:outline-none min-h-[300px] max-w-none p-4 border rounded-md border-input bg-transparent",
            },
        },
    });

    const handleAddTag = () => {
        if (newTag.trim() && !model.tags.includes(newTag.trim())) {
            updateModel("tags", [...model.tags, newTag.trim()]);
            setNewTag("");
            setIsAddingTag(false);
        } else {
            setIsAddingTag(false);
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        updateModel(
            "tags",
            model.tags.filter((tag) => tag !== tagToRemove)
        );
    };

    const handleKeyDownTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        } else if (e.key === "Escape") {
            setIsAddingTag(false);
            setNewTag("");
        }
    };

    // Reset editor content when modal opens or model changes externally (if that ever happens)
    useEffect(() => {
        if (open && editor && editor.getHTML() !== model.content) {
            editor.commands.setContent(model.content);
        }
    }, [open, editor, model.content]);

    useEffect(() => {
        if (isAddingTag && tagInputRef.current) {
            tagInputRef.current.focus();
        }
    }, [isAddingTag]);

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create Post</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    {/* Title Section */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="title" className="text-base font-semibold">
                            Title
                        </Label>
                        <p className="text-xs text-muted-foreground">
                            Be explicit and imagine you're asking a question to another person.
                        </p>
                        <Input
                            id="title"
                            placeholder="e.g. How to center a div?"
                            value={model.title}
                            onChange={(e) => updateModel("title", e.target.value)}
                            className="bg-transparent"
                        />
                    </div>

                    {/* Body Section */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-base font-semibold">Body</Label>
                        <p className="text-xs text-muted-foreground">
                            Should include all necessary information for your question.
                        </p>
                        <EditorContent editor={editor} />
                    </div>

                    {/* Tags Section */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            {/* Left side: Add Tag + Tag List */}
                            <div className="flex items-center flex-wrap gap-2">
                                {isAddingTag ? (
                                    <div className="flex items-center gap-1 rounded-sm border bg-muted px-2 py-1">
                                        <input
                                            ref={tagInputRef}
                                            type="text"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={handleKeyDownTag}
                                            onBlur={handleAddTag}
                                            className="w-24 bg-transparent text-sm outline-none"
                                            placeholder="Tag name"
                                        />
                                    </div>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1 rounded-sm bg-muted/50 text-muted-foreground hover:bg-muted"
                                        onClick={() => setIsAddingTag(true)}
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add tag
                                    </Button>
                                )}

                                {model.tags.map((tag, index) => (
                                    <div
                                        key={tag}
                                        className={cn(
                                            "flex items-center gap-1 rounded-sm px-2 py-1 text-xs font-medium",
                                            "bg-teal-100/50 text-teal-800"
                                        )}
                                    >
                                        <span>{tag}</span>
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-foreground/80"
                                            onClick={() => handleRemoveTag(tag)}
                                        />
                                    </div>
                                ))}

                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex items-center sm:justify-between w-full border-t pt-4">
                    {/* Empty div to push buttons to right if needed, or just right aligned */}
                    <div className="hidden sm:block"></div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="bg-[#0EB4FC] hover:bg-[#0EB4FC]/90 text-white gap-1 cursor-pointer"
                            onClick={onSubmitForm}
                            disabled={loading || !model.title || !model.content}
                        >
                            <Plus className="h-4 w-4" />
                            Post
                        </Button>
                        <Button variant="secondary" onClick={onClose} className="cursor-pointer bg-muted hover:bg-muted/80">
                            Cancel
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
