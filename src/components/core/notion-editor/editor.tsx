"use client";

import { useEffect, useState, useCallback, useMemo, useRef, useContext } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Collaboration from "@tiptap/extension-collaboration";
import Image from "@tiptap/extension-image";
import NextImage from "next/image";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { CommentMark } from "./extensions/comment-mark";
import { SlashCommands } from "./extensions/slash-commands";
import { Callout } from "./extensions/callout";
import { FileNode } from "./extensions/file-node";
import { EditorBubbleMenu } from "./bubble-menu";
import { CommentSidebar } from "./comment-sidebar";
import { PresenceAvatars } from "./presence-avatars";
import { VersionHistoryDialog } from "./version-history-dialog";
import { CommentThread, DocVersionDTO, AwarenessUser } from "@/model/document";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, User, Calendar, MessageSquare, Clock, ArrowUp, Trash2 // <--- Add these
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { format } from "date-fns";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { cn } from "@/lib/utils";
import { CommentActionButtons } from "./comment-actions";
import { FilePickerWrapper } from "./extensions/file-picker-wrapper";
import { ImageUploadWrapper } from "./extensions/image-upload-wrapper";
import { toast } from "sonner";

interface NotionEditorProps {
    provider: HocuspocusProvider;
    ydoc: Y.Doc;
    isConnected: boolean;
    isSynced: boolean;
    awarenessUsers: AwarenessUser[];
    threads: CommentThread[];
    addThread: (thread: CommentThread) => void;
    updateThread: (threadId: string, updates: Partial<CommentThread>) => void;
    deleteThread: (threadId: string) => void;
    canEdit: boolean;
    versions: DocVersionDTO[];
    isLoadingVersions: boolean;
    onLoadVersions: () => void;
    onRestoreVersion: (versionId: string) => void;
    isRestoringVersion: boolean;
    canRestore?: boolean; // Only file creator or project owner can restore
    documentTitle?: string;
    onTitleChange?: (title: string) => void;
    createdBy?: string;
    createdAt?: string;
    onBack?: () => void;
    projectId?: number | string; // For file picker
}

export function NotionEditor({
    provider,
    ydoc,
    isConnected,
    isSynced,
    awarenessUsers,
    threads,
    addThread,
    updateThread,
    deleteThread,
    canEdit,
    versions,
    isLoadingVersions,
    onLoadVersions,
    onRestoreVersion,
    isRestoringVersion,
    canRestore = false,
    documentTitle = "",
    onTitleChange,
    createdBy = "Jane Doe",
    createdAt = new Date().toISOString(),
    onBack,
    projectId, // Add this
}: NotionEditorProps) {
    // ... existing states ...
    const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const rightGutterRef = useRef<HTMLDivElement>(null); // ✅ Add this ref
    const [threadPositions, setThreadPositions] = useState<Record<string, number>>({});
    const commentFormRef = useRef<HTMLDivElement>(null);
    const [commentFormTop, setCommentFormTop] = useState(0); // Y-position for the form
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [showSidebar, setShowSidebar] = useState(false); // Controls the right panel
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const [selectedThreadId, setSelectedThreadId] = useState<string>();
    const [isMounted, setIsMounted] = useState(false);
    const [containerMounted, setContainerMounted] = useState(false);
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState(documentTitle);
    const [replyingToThreadId, setReplyingToThreadId] = useState<string | null>(null);  // ✅ ADD THIS
    const [replyText, setReplyText] = useState("");  // ✅ ADD THIS

    const [currentUser, setCurrentUser] = useState({
        id: "",
        name: "Anonymous",
        avatar: "",
    });

    const {
        userId,
        displayName,
        avatarUrl,
        projectRepository,
    } = useContext<AppContextProps>(AppContext);

    useEffect(() => {
        setIsMounted(true);

        // Set container mounted in next tick to ensure ref is set
        setTimeout(() => {
            if (editorContainerRef.current) {
                setContainerMounted(true);
            }
        }, 0);

        setCurrentUser({
            id: String(userId || ""),
            name: displayName || "Anonymous",
            avatar: avatarUrl || "",
        });
    }, [userId, displayName, avatarUrl]);

    useEffect(() => {
        setTitle(documentTitle);
    }, [documentTitle]);

    // Create lowlight instance for syntax highlighting
    const lowlight = useMemo(() => createLowlight(common), []);

    const extensions = useMemo(
        () => [
            StarterKit.configure({
                history: false,
                codeBlock: false, // Disable default codeBlock to use CodeBlockLowlight instead
            } as any),
            Placeholder.configure({
                includeChildren: true,
                showOnlyCurrent: true,
                placeholder: ({ node, editor }) => {
                    // Headings
                    if (node.type.name === "heading") {
                        const level = node.attrs.level;
                        return `Heading ${level}`;
                    }

                    // Code Block
                    if (node.type.name === "codeBlock") {
                        return "Enter code...";
                    }

                    // Paragraph placeholder
                    if (node.type.name === "paragraph") {
                        return "Write, press '/' for commands...";
                    }

                    // List items - let them have empty placeholders
                    if (node.type.name === "listItem") {
                        return "";
                    }

                    // Blockquote - empty placeholder
                    if (node.type.name === "blockquote") {
                        return "";
                    }

                    // Callout - empty placeholder
                    if (node.type.name === "callout") {
                        return "";
                    }

                    // For task items, show placeholder in the paragraph inside
                    if (node.type.name === "taskItem") {
                        return "";
                    }

                    // Don't show placeholder for container nodes
                    return "";
                },
            }),
            Underline,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            CommentMark,
            SlashCommands,
            Callout,
            FileNode,
            Image.configure({
                inline: true,
                allowBase64: false,
                HTMLAttributes: {
                    class: 'editor-image',
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                defaultLanguage: "javascript",
            }),
            BubbleMenuExtension,
            Collaboration.configure({
                document: ydoc,
            }),
        ],
        [ydoc, lowlight]
    );

    const editor = useEditor(
        {
            immediatelyRender: false,
            shouldRerenderOnTransaction: false,
            extensions,
            editable: canEdit,
            editorProps: {
                attributes: {
                    // Padding is handled by the parent container now
                    class: "prose prose-lg dark:prose-invert focus:outline-none max-w-none min-h-[500px]",
                },
                handlePaste: (view, event, slice) => {
                    // Check for image files in clipboard
                    const files = Array.from(event.clipboardData?.files || []);
                    const imageFile = files.find(file => file.type.startsWith('image/'));

                    if (imageFile && projectId && projectRepository) {
                        // Upload and insert image
                        const toastId = toast.loading("Uploading image...");

                        projectRepository.uploadEditorImage({ projectId }, imageFile).subscribe({
                            next: (response) => {
                                if (response?.status && response.data?.url) {
                                    view.dispatch(
                                        view.state.tr.replaceSelectionWith(
                                            view.state.schema.nodes.image.create({ src: response.data.url })
                                        )
                                    );
                                    toast.success("Image inserted", { id: toastId });
                                } else {
                                    toast.error("Upload failed", { id: toastId });
                                }
                            },
                            error: (err) => {
                                console.error("Paste image upload error:", err);
                                toast.error(err?.error?.message || "Failed to upload image", { id: toastId });
                            },
                        });

                        // Return true to prevent default TipTap image handling
                        return true;
                    }

                    // Return false to allow default handling for non-images
                    return false;
                },
            },
        },
        [extensions, canEdit, projectId, projectRepository]
    );

    // Track when editor is ready - simplified
    // Simplified readiness check - simply existence of editor
    // With immediatelyRender: true, editor.view is guaranteed to exist if editor exists


    // Close comment form when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (commentFormRef.current && !commentFormRef.current.contains(event.target as Node)) {
                setIsCommenting(false);
                setCommentText(""); // Clear text on cancel
            }
        };

        if (isCommenting) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isCommenting]);

    // Handle comment and file node clicks
    useEffect(() => {
        if (!editor || !editor.view || editor.isDestroyed) return;

        try {
            const editorElement = editor.view.dom;
            if (!editorElement) return;

            const handleClick = (event: MouseEvent) => {
                const target = event.target as HTMLElement;

                // Handle file node clicks
                const fileCard = target.closest(".file-node-card");
                if (fileCard) {
                    const storageRef = fileCard.getAttribute("data-storage-reference");
                    const nodeType = fileCard.getAttribute("data-node-type");

                    if (storageRef) {
                        // For NOTION_DOC, construct the URL to the document page
                        if (nodeType === 'NOTION_DOC') {
                            const url = `/projects/files?id=${storageRef}`;
                            window.open(url, '_blank');
                        } else {
                            // For STATIC_FILE, use the storage reference directly (full URL)
                            window.open(storageRef, '_blank');
                        }
                        return; // Prevent comment handler from also firing
                    }
                }

                // Handle comment clicks
                const commentElement = target.closest("[data-thread-id]");
                if (commentElement) {
                    const threadId = commentElement.getAttribute("data-thread-id");
                    if (threadId) {
                        setSelectedThreadId(threadId);
                        setShowSidebar(true); // ✅ CHANGE THIS: Open the sidebar to view the thread
                    }
                }
            };

            editorElement.addEventListener("click", handleClick);

            return () => {
                if (editorElement) {
                    editorElement.removeEventListener("click", handleClick);
                }
            };
        } catch (error) {
            console.warn("Editor view not ready for click handler:", error);
            return;
        }
    }, [editor]);

    // Note: Image paste handling is now done via editorProps.handlePaste above
    // This prevents duplicate images by intercepting at the ProseMirror plugin level

    const handleAddComment = useCallback(() => {
        if (!editor || editor.state.selection.empty || !rightGutterRef.current) return;

        // 1. Get Selection Position
        const { from } = editor.state.selection;
        const startPos = editor.view.coordsAtPos(from);

        // 2. Get Gutter Position
        const gutterRect = rightGutterRef.current.getBoundingClientRect();

        // 3. Calculate Relative Top
        const relativeTop = startPos.top - gutterRect.top;

        setCommentFormTop(relativeTop);
        setIsCommenting(true);
    }, [editor]);

    const submitComment = () => {
        if (!editor || !commentText.trim()) {
            setIsCommenting(false);
            return;
        }

        const threadId = uuidv4();
        editor.chain().focus().setComment(threadId).run();

        const newThread: CommentThread = {
            threadId,
            userId: currentUser.id,
            userName: currentUser.name,
            name: currentUser.name,
            userAvatar: currentUser.avatar,
            avatar: currentUser.avatar,
            content: commentText,
            replies: [],
            resolved: false,
            orphaned: false,
            createdAt: new Date().toISOString(),
        };

        addThread(newThread);
        setSelectedThreadId(threadId);

        // Reset
        // setShowSidebar(true); // Open sidebar to show the new comment
        setCommentText("");
        setIsCommenting(false);
    };

    const handleResolveThread = useCallback(
        (threadId: string) => {
            editor?.chain().focus().unsetComment(threadId).run();
            updateThread(threadId, {
                resolved: true,
                resolvedBy: currentUser.id,
                resolvedAt: new Date().toISOString(),
            });
        },
        [editor, updateThread, currentUser.id]
    );

    const handleReopenThread = useCallback((threadId: string) => {
        if (!editor || !canEdit) return;

        updateThread(threadId, {
            resolved: false,
            resolvedBy: undefined,
            resolvedAt: undefined,
        });

        // Note: We don't re-add the highlight since the text might have changed
        // User will need to select text again to re-apply comment
    }, [editor, canEdit, updateThread]);

    const handleDeleteThread = useCallback(
        (threadId: string) => {
            editor?.chain().focus().unsetComment(threadId).run();
            deleteThread(threadId);
        },
        [editor, deleteThread]
    );

    const handleAddReply = useCallback(
        (threadId: string, content: string) => {
            const thread = threads.find((t) => t.threadId === threadId);
            if (!thread) return;

            const newReply = {
                // replyId: uuidv4(),
                // userId: currentUser.id,
                // userName: currentUser.name,
                // name: currentUser.name,
                // userAvatar: currentUser.avatar,
                // avatar: currentUser.avatar,
                // content,
                // createdAt: new Date().toISOString(),

                replyId: uuidv4(),
                authorId: currentUser.id, // Match DB authorId
                authorName: currentUser.name, // Match DB authorName
                authorAvatar: currentUser.avatar, // Match DB authorAvatar
                content,
                createdAt: new Date().toISOString(),
            };

            updateThread(threadId, {
                replies: [...thread.replies, newReply],
                updatedAt: new Date().toISOString(),
            });
        },
        [threads, updateThread, currentUser]
    );

    const handleDeleteReply = useCallback(
        (threadId: string, replyId: string) => {
            const thread = threads.find((t) => t.threadId === threadId);
            if (!thread) return;

            updateThread(threadId, {
                replies: thread.replies.filter((r) => r.replyId !== replyId),
                updatedAt: new Date().toISOString(),
            });
        },
        [threads, updateThread]
    );

    const updateCommentPositions = useCallback(() => {
        // ✅ FIX: Added stricter checks to prevent "view is not available" error
        if (!editor || !editor.view || editor.isDestroyed || !rightGutterRef.current) return;

        const editorDom = editor.view.dom;
        const gutterRect = rightGutterRef.current.getBoundingClientRect();

        const rawPositions: { threadId: string; top: number; left: number; createdAt: string }[] = [];

        // 1. Calculate positions relative to the Gutter's top edge
        threads.forEach((thread) => {
            if (thread.resolved) return;

            // Find the highlight in the text
            const element = editorDom.querySelector(`span[data-thread-id="${thread.threadId}"]`);
            if (element) {
                const rect = element.getBoundingClientRect();

                // Pure visual math: (Text Screen Y) - (Gutter Screen Y)
                const relativeTop = rect.top - gutterRect.top;

                rawPositions.push({
                    threadId: thread.threadId,
                    top: relativeTop,
                    left: rect.left,
                    createdAt: thread.createdAt
                });
            }
        });

        // 2. Sort by "Reading Order"
        rawPositions.sort((a, b) => {
            if (Math.abs(a.top - b.top) < 5) {
                return a.left - b.left;
            }
            return a.top - b.top;
        });

        // 3. Prevent Overlap
        const finalPositions: Record<string, number> = {};
        let lastBottom = -9999;

        rawPositions.forEach((pos) => {
            let actualTop = pos.top;

            if (actualTop < lastBottom + 10) {
                actualTop = lastBottom + 6;
            }

            finalPositions[pos.threadId] = actualTop;

            const thread = threads.find(t => t.threadId === pos.threadId);
            if (thread) {
                const baseHeight = 80;
                const replyHeight = thread.replies.length * 60;
                const formHeight = replyingToThreadId === pos.threadId ? 120 : 0;
                const totalHeight = baseHeight + replyHeight + formHeight;

                lastBottom = actualTop + totalHeight;
            } else {
                lastBottom = actualTop + 80;
            }
        });

        setThreadPositions(finalPositions);
    }, [editor, threads, replyingToThreadId]); // ✅ Added 'replyingToThreadId' to dependencies

    const handleSubmitFloatingReply = useCallback((threadId: string) => {
        if (!replyText.trim()) {
            setReplyingToThreadId(null);
            setReplyText("");
            return;
        }

        handleAddReply(threadId, replyText.trim());
        setReplyText("");
        setReplyingToThreadId(null);

        // Recalculate positions after adding reply
        setTimeout(updateCommentPositions, 100);
    }, [replyText, handleAddReply, updateCommentPositions]);

    const handleOpenVersionHistory = () => {
        setShowVersionHistory(true);
        onLoadVersions();
    };

    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        onTitleChange?.(newTitle);
    };

    // ✅ NEW: Enhanced Positioning & Collision Logic
    // ✅ IMPROVED: Precise visual alignment & "Text Order" sorting



    // Update positions whenever the document changes or selection updates
    useEffect(() => {
        if (!editor) return;

        setTimeout(updateCommentPositions, 100);

        editor.on("update", updateCommentPositions);
        editor.on("selectionUpdate", updateCommentPositions);
        window.addEventListener("resize", updateCommentPositions);

        return () => {
            editor.off("update", updateCommentPositions);
            editor.off("selectionUpdate", updateCommentPositions);
            window.removeEventListener("resize", updateCommentPositions);
        };
    }, [editor, updateCommentPositions, replyingToThreadId, threads.length]);  // ✅ ADD THESE DEPENDENCIES

    if (!isMounted) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4" />
                    <p className="text-gray-500">Initializing editor...</p>
                </div>
            </div>
        );
    }

    if (!isSynced) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4" />
                    <p className="text-gray-500">
                        {isConnected ? "Syncing document..." : "Connecting..."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full">
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-gray-900">
                {/* Top Navigation Bar - Removed borders */}
                {/* Top Navigation Bar */}
                <div className="flex items-center justify-between w-full sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-3 border-none">

                    {/* --- LEFT SIDE WRAPPER --- */}
                    <div className="pl-7">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBack}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* --- RIGHT SIDE WRAPPER --- */}
                    {/* 👇 Adjust 'pr-8' to move the Avatars closer/further from the right edge */}
                    <div className="flex items-center gap-2 pr-8">
                        <PresenceAvatars users={awarenessUsers} />

                        {/* Vertical Divider */}
                        <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-2" />

                        {/* History Icon */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setShowVersionHistory(true);
                                onLoadVersions();
                            }}
                            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                            title="Version History"
                        >
                            <Clock className="h-5 w-5" />
                        </Button>

                        {/* Comment Toggle Icon */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowSidebar(!showSidebar)}
                            className={cn(
                                "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
                                showSidebar && "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                            )}
                            title="View all comments"
                        >
                            <MessageSquare className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Main Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">

                    {/* ✅ NEW LAYOUT: Balanced 3-Column Flex */}
                    <div className="flex justify-center min-h-full">

                        {/* 1. LEFT SPACER (Invisible, balances the Right Gutter) */}
                        {/* We use the exact same width (w-[300px]) as the right gutter */}
                        <div className="hidden xl:block w-[300px] shrink-0" aria-hidden="true" />

                        {/* 2. The Document Column (Centered) */}
                        <div className="w-full max-w-4xl px-12 py-12 shrink-0">

                            {/* Header Section */}
                            <div className="group mb-8">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="Untitled"
                                    className="w-full text-5xl font-bold border-none outline-none bg-transparent placeholder:text-gray-300 dark:placeholder:text-gray-700 text-gray-900 dark:text-gray-100 p-0"
                                    disabled={!canEdit}
                                    autoComplete="off"
                                />

                                {/* Metadata */}
                                <div className="mt-6 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 min-w-[100px]">
                                            <User className="h-4 w-4 opacity-70" />
                                            <span className="text-gray-400">Created by</span>
                                        </div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">{createdBy}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 min-w-[100px]">
                                            <Calendar className="h-4 w-4 opacity-70" />
                                            <span className="text-gray-400">Created at</span>
                                        </div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {format(new Date(createdAt), "d MMM, yyyy")}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 border-b border-gray-200 dark:border-gray-800 w-full" />
                            </div>

                            {/* ✅ FIX: Put this Bubble Menu back! */}
                            {editor && (
                                <EditorBubbleMenu
                                    editor={editor}
                                    onAddComment={handleAddComment}
                                />
                            )}

                            {/* Editor Content */}
                            <div ref={editorContainerRef}>
                                {editor ? (
                                    <>
                                        <EditorContent editor={editor} />
                                        <FilePickerWrapper editor={editor} projectId={projectId} />
                                        <ImageUploadWrapper editor={editor} projectId={projectId} />
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="text-sm text-gray-400">Loading editor...</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. The Right Gutter */}
                        <div
                            ref={rightGutterRef} // ✅ Attach it here
                            className="hidden xl:block w-[300px] shrink-0 pr-6 relative"
                        >

                            {/* Render the form ONLY if isCommenting is true */}
                            {/* A. The "Add Comment" Form (Existing Code) */}
                            {isCommenting && (
                                <div
                                    ref={commentFormRef}
                                    className="absolute left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 p-1 flex items-center gap-2"
                                    style={{ top: `${commentFormTop}px` }}
                                >
                                    <input
                                        className="flex-1 p-2 text-sm bg-transparent border-none outline-none placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
                                        placeholder="Add a comment..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                submitComment();
                                            }
                                        }}
                                    />
                                    <Button
                                        size="icon"
                                        onClick={submitComment}
                                        disabled={!commentText.trim()}
                                        className="h-8 w-8 rounded-full bg-black hover:bg-gray-800 text-white shrink-0"
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Unresolved Comment Cards */}
                            {!isCommenting && !showSidebar && Object.keys(threadPositions).length > 0 &&
                                threads
                                    .filter(t => !t.resolved && threadPositions[t.threadId] !== undefined)
                                    .sort((a, b) => threadPositions[a.threadId] - threadPositions[b.threadId])
                                    .map((thread) => {
                                        const isEditing = editingThreadId === thread.threadId;

                                        return (
                                            <div
                                                key={thread.threadId}
                                                className={cn(
                                                    "absolute left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all group z-10",
                                                    isEditing ? "p-1 ring-2 ring-blue-500 z-20" : "p-3 cursor-pointer hover:shadow-md"
                                                )}
                                                style={{ top: `${threadPositions[thread.threadId]}px` }}
                                                onClick={() => {
                                                    if (!isEditing) {
                                                        setSelectedThreadId(thread.threadId);
                                                    }
                                                }}
                                            >
                                                {/* ✅ Editing Mode */}
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            className="flex-1 p-2 text-sm bg-transparent border-none outline-none placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                            autoFocus
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    updateThread(thread.threadId, { content: editText, updatedAt: new Date().toISOString() });
                                                                    setEditingThreadId(null);
                                                                } else if (e.key === "Escape") {
                                                                    setEditingThreadId(null);
                                                                }
                                                            }}
                                                        />
                                                        <Button
                                                            size="icon"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateThread(thread.threadId, { content: editText, updatedAt: new Date().toISOString() });
                                                                setEditingThreadId(null);
                                                            }}
                                                            disabled={!editText.trim()}
                                                            className="h-8 w-8 rounded-full bg-black hover:bg-gray-800 text-white shrink-0"
                                                        >
                                                            <ArrowUp className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    /* ✅ Normal View */
                                                    <div className="space-y-3">
                                                        {/* Main Comment */}
                                                        <div className="flex items-start gap-2">
                                                            <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 border border-gray-200 mt-0.5">
                                                                <NextImage src={thread.avatar || thread.userAvatar} alt={thread.name || thread.userName} width={24} height={24} className="h-full w-full object-cover" unoptimized />
                                                            </div>

                                                            <div className="min-w-0 flex-1 relative">
                                                                <div className="flex items-center justify-between mb-0.5">
                                                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate pr-2">
                                                                        {thread.name || thread.userName}
                                                                    </span>
                                                                </div>

                                                                <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                                                                    {thread.content}
                                                                </p>

                                                                {/* Timestamp + Hover Buttons */}
                                                                <div className="absolute right-0 top-[-2px]">
                                                                    <span className="group-hover:hidden text-[10px] text-gray-400 bg-white dark:bg-gray-800 px-1 rounded">
                                                                        {format(new Date(thread.createdAt), "MMM d")}
                                                                    </span>

                                                                    <div className="hidden group-hover:block bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-600 rounded-md p-0.5 z-20">
                                                                        <CommentActionButtons
                                                                            isOwner={String(thread.userId) === String(currentUser.id)}
                                                                            isResolved={thread.resolved}
                                                                            canEditDoc={canEdit}
                                                                            onResolve={() => handleResolveThread(thread.threadId)}
                                                                            onReopen={() => handleReopenThread(thread.threadId)}
                                                                            onReply={() => setReplyingToThreadId(thread.threadId)}
                                                                            onEdit={() => {
                                                                                setEditingThreadId(thread.threadId);
                                                                                setEditText(thread.content);
                                                                            }}
                                                                            onDelete={() => handleDeleteThread(thread.threadId)}
                                                                            variant="floating"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* ✅ Existing Replies */}
                                                        {thread.replies.length > 0 && (
                                                            <div className="space-y-2 pl-8 border-l-2 border-gray-200 dark:border-gray-600">
                                                                {thread.replies.map((reply) => (
                                                                    <div key={reply.replyId} className="flex items-start gap-2 group/reply">
                                                                        <div className="h-5 w-5 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                                                            <NextImage src={(reply as any).authorAvatar || reply.userAvatar || reply.avatar} alt={(reply as any).authorName || reply.userName || reply.name} width={20} height={20} className="h-full w-full object-cover" unoptimized />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                                {(reply as any).authorName || reply.userName || reply.name}
                                                                            </div>
                                                                            <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                                                                                {reply.content}
                                                                            </p>
                                                                        </div>
                                                                        {String(reply.userId) === String(currentUser.id) && (
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleDeleteReply(thread.threadId, reply.replyId);
                                                                                }}
                                                                                className="h-6 w-6 p-0 opacity-0 group-hover/reply:opacity-100"
                                                                            >
                                                                                <Trash2 className="h-3 w-3" />
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* ✅ Reply Form */}
                                                        {replyingToThreadId === thread.threadId && (
                                                            <div className="pl-8 space-y-2" onClick={(e) => e.stopPropagation()}>
                                                                <textarea
                                                                    autoFocus
                                                                    value={replyText}
                                                                    onChange={(e) => setReplyText(e.target.value)}
                                                                    placeholder="Reply..."
                                                                    className="w-full text-sm p-2 border border-gray-300 dark:border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    rows={2}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                                            e.preventDefault();
                                                                            handleSubmitFloatingReply(thread.threadId);
                                                                        }
                                                                    }}
                                                                />
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setReplyingToThreadId(null);
                                                                            setReplyText("");
                                                                        }}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleSubmitFloatingReply(thread.threadId)}
                                                                        disabled={!replyText.trim()}
                                                                    >
                                                                        Reply
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                            }
                        </div>

                    </div>
                </div>
            </div>

            {/* Sidebars (Comments / Version History) */}
            {showSidebar && (
                <CommentSidebar
                    threads={threads}
                    selectedThreadId={selectedThreadId}
                    onSelectThread={setSelectedThreadId}
                    onResolveThread={handleResolveThread}
                    onDeleteThread={handleDeleteThread}
                    onReopenThread={handleReopenThread}
                    onEditThread={(threadId, newContent) => updateThread(threadId, { content: newContent, updatedAt: new Date().toISOString() })}
                    onAddReply={handleAddReply}
                    onDeleteReply={handleDeleteReply}
                    currentUserId={currentUser.id}
                    canEdit={canEdit}
                />
            )}

            <VersionHistoryDialog
                open={showVersionHistory}
                onOpenChange={setShowVersionHistory}
                versions={versions}
                isLoading={isLoadingVersions}
                onRestore={onRestoreVersion}
                isRestoring={isRestoringVersion}
                canRestore={canRestore}
            />

            {/* File Picker Wrapper */}
            <FilePickerWrapper editor={editor} projectId={projectId} />
        </div>
    );
}