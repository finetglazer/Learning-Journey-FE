"use client";

import { Button } from "@/components/ui/button";
import { AppContext } from "@/hooks/app-context";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, getFileIcon, getFileSize } from "@/lib/utils";
import { CreatePostModel } from "@/model/create-post-model";
import { formService } from "@/service/form-service";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Plus, X } from "lucide-react";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { SlashCommands } from "../notion-editor/extensions/slash-commands";
import { PostPageContext, PostPageContextInterface } from "./post-page-context";
import { ImageUploadWrapper } from "../notion-editor/extensions/image-upload-wrapper";
import { AlertModal } from "../alert-modal/alert-modal";
import { isEqual, debounce } from "lodash";

export interface CreatePostModalProps {
    open: boolean;
    onClose: () => void;
    initialData?: { title: string; content: any; tags: string[]; files: any[] };
    onSubmit?: (model: CreatePostModel) => void;
}

export function CreatePostModal({ open, onClose, initialData, onSubmit }: CreatePostModalProps) {
    const postPageContext = useContext<PostPageContextInterface>(PostPageContext);

    const alertMessage = postPageContext?.alertMessage || null;
    const setAlertMessage = postPageContext?.setAlertMessage;
    const onCreatePost = postPageContext?.onCreatePost;

    const { postRepository } = useContext(AppContext);

    const { model, updateModel, onSubmitForm, loading } = formService.useForm(
        CreatePostModel,
        onSubmit || onCreatePost as any,
        undefined,
        new CreatePostModel()
    );

    useEffect(() => {
        if (open && initialData) {
            updateModel("title", initialData.title);
            updateModel("content", initialData.content);
            updateModel("tags", initialData.tags);
            updateModel("files", initialData.files);
        } else if (open && !initialData) {
            updateModel("title", "");
            updateModel("content", "");
            updateModel("tags", []);
            updateModel("files", []);
        }
    }, [open, initialData]);

    const [newTag, setNewTag] = useState("");
    const [isAddingTag, setIsAddingTag] = useState(false);
    const tagInputRef = useRef<HTMLInputElement>(null);

    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [showTagDropdown, setShowTagDropdown] = useState(false);

    const searchTagsDebounced = useCallback(
        debounce((query: string) => {
            if (!query.trim() || !postRepository) {
                setSuggestedTags([]);
                return;
            }
            postRepository.searchTags(query).subscribe({
                next: (res: any) => {
                    if (res?.data) {
                        setSuggestedTags(res.data?.tags || []);
                    }
                },
                error: (err) => {
                    console.error(err);
                },
            });
        }, 300),
        [postRepository]
    );

    useEffect(() => {
        if (isAddingTag && newTag) {
            searchTagsDebounced(newTag);
            setShowTagDropdown(true);
        } else {
            setShowTagDropdown(false);
        }
    }, [newTag, isAddingTag, searchTagsDebounced]);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image,
            Placeholder.configure({
                placeholder: 'Click "/" to choose commands',
            }),
            SlashCommands.configure({
                suggestion: {
                    hiddenCommands: ["File"],
                } as any,
            }),
        ],
        content: model.content,
        onUpdate: ({ editor }) => {
            updateModel("content", editor.getJSON());
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
            // If dropdown is visible and has items, selecting first one is a nice UX, but for now just add what's typed
            handleAddTag();
            setShowTagDropdown(false);
        } else if (e.key === "Escape") {
            setIsAddingTag(false);
            setNewTag("");
            setShowTagDropdown(false);
        }
    };

    const handleSelectTag = (tag: string) => {
        if (!model.tags.includes(tag)) {
            updateModel("tags", [...model.tags, tag]);
        }
        setNewTag("");
        setIsAddingTag(false);
        setShowTagDropdown(false);
    };

    // Reset editor content when modal opens or model changes externally (if that ever happens)
    useEffect(() => {
        if (open && editor) {
            const currentContent = editor.getJSON();
            if (!isEqual(currentContent, model.content)) {
                // Handle initial empty string case

                // If model.content is "" (initial) and editor is empty doc, do nothing?
                // Or if model.content is object, set it.
                // If model.content is "", setContent("") clears it.

                if (model.content === "" && Object.keys(currentContent).length === 0) return;

                editor.commands.setContent(model.content);
            }
        }
    }, [open, editor, model.content]);

    useEffect(() => {
        if (isAddingTag && tagInputRef.current) {
            tagInputRef.current.focus();
        }
    }, [isAddingTag]);

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-scroll">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Post" : "Create Post"}</DialogTitle>
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

                    {/* Attachments Section */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-base font-semibold">Attachments</Label>
                        <div className="flex flex-wrap gap-2">
                            {model.files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-sm"
                                >
                                    {/* File Icon */}
                                    <div className="flex-shrink-0">
                                        {getFileIcon(file.name.split('.').pop() || '', 'STATIC_FILE', 16)}
                                    </div>
                                    <span className="max-w-[150px] truncate" title={file.name}>
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {getFileSize(file.size)}
                                    </span>
                                    <X
                                        className="h-4 w-4 cursor-pointer hover:text-red-500"
                                        onClick={() => {
                                            const newFiles = [...model.files];
                                            newFiles.splice(index, 1);
                                            updateModel("files", newFiles);
                                            if ((file as any)?.fileId) {
                                                updateModel("filesToRemove", [...model.filesToRemove, (file as any).fileId]);
                                            }
                                        }}
                                    />
                                </div>
                            ))}
                            <label className="flex cursor-pointer items-center gap-1 rounded-md border border-dashed px-3 py-1 text-sm hover:bg-muted/50">
                                <Plus className="h-4 w-4" />
                                <span>Add File</span>
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            updateModel("files", [
                                                ...model.files,
                                                ...Array.from(e.target.files),
                                            ]);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            {/* Left side: Add Tag + Tag List */}
                            <div className="flex items-center flex-wrap gap-2">
                                {isAddingTag ? (
                                    <div className="relative flex items-center gap-1 rounded-sm border bg-muted px-2 py-1">
                                        <input
                                            ref={tagInputRef}
                                            type="text"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={handleKeyDownTag}
                                            onBlur={() => {
                                                setShowTagDropdown(false);
                                            }}
                                            className="w-24 bg-transparent text-sm outline-none"
                                            placeholder="Tag name"
                                        />
                                        {showTagDropdown && suggestedTags.length > 0 && (
                                            <div className="absolute top-full left-0 z-50 mt-1 w-48 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
                                                <div className="p-1">
                                                    {suggestedTags.map((tag) => (
                                                        <div
                                                            key={tag}
                                                            className="cursor-pointer relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleSelectTag(tag);
                                                            }}
                                                        >
                                                            {tag}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1 cursor-pointer rounded-sm bg-muted/50 text-muted-foreground hover:bg-muted"
                                        onClick={() => setIsAddingTag(true)}
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add tag
                                    </Button>
                                )}

                                {model.tags.map((tag) => (
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
                            {initialData ? "Update" : "Post"}
                        </Button>
                        <Button variant="secondary" onClick={onClose} className="cursor-pointer bg-muted hover:bg-muted/80">
                            Cancel
                        </Button>
                    </div>
                </DialogFooter>

                {alertMessage && (
                    <AlertModal
                        alertMessage={alertMessage}
                        onClose={() => setAlertMessage(null)}
                    />
                )}
            </DialogContent>
            <ImageUploadWrapper editor={editor} projectId={-1} />
        </Dialog>
    );
}

