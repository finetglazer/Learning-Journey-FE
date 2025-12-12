"use client";

import {useEffect, useState, useCallback, useMemo, useRef} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Collaboration from "@tiptap/extension-collaboration";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import { CommentMark } from "./extensions/comment-mark";
import { SlashCommands } from "./extensions/slash-commands";
import { EditorBubbleMenu } from "./bubble-menu";
import { CommentSidebar } from "./comment-sidebar";
import { PresenceAvatars } from "./presence-avatars";
import { VersionHistoryDialog } from "./version-history-dialog";
import { CommentThread, DocVersionDTO, AwarenessUser } from "@/model/document";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, MessageSquare, Clock, ArrowUp } from "lucide-react";import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import {cn} from "@/lib/utils";


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
    onRestoreVersion: (versionId: number) => void;
    isRestoringVersion: boolean;
    documentTitle?: string;
    onTitleChange?: (title: string) => void;
    createdBy?: string;
    createdAt?: string;
    onBack?: () => void;
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
                                 documentTitle = "",
                                 onTitleChange,
                                 createdBy = "Jane Doe",
                                 createdAt = new Date().toISOString(),
                                 onBack,
                             }: NotionEditorProps) {
    const [threadPositions, setThreadPositions] = useState<Record<string, number>>({});
    const commentFormRef = useRef<HTMLDivElement>(null);
    const [commentFormTop, setCommentFormTop] = useState(0); // Y-position for the form
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [showSidebar, setShowSidebar] = useState(false); // Controls the right panel
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const [selectedThreadId, setSelectedThreadId] = useState<string>();
    const [isMounted, setIsMounted] = useState(false);
    const [title, setTitle] = useState(documentTitle);

    const [currentUser, setCurrentUser] = useState({
        id: "",
        name: "Anonymous",
        avatar: "",
    });

    useEffect(() => {
        setIsMounted(true);
        const userId = localStorage.getItem("userId") || "";
        const displayName = localStorage.getItem("displayName") || "Anonymous";
        const avatarUrl = localStorage.getItem("avatarUrl") || "";

        setCurrentUser({
            id: userId,
            name: displayName,
            avatar: avatarUrl,
        });
    }, []);

    useEffect(() => {
        setTitle(documentTitle);
    }, [documentTitle]);

    const extensions = useMemo(
        () => [
            StarterKit.configure({
                history: false,
            } as any),
            Placeholder.configure({
                placeholder: 'Type "/" for commands...',
            }),
            Underline,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableCell,
            TableHeader,
            CommentMark,
            SlashCommands,
            BubbleMenuExtension,
            Collaboration.configure({
                document: ydoc,
            }),
        ],
        [ydoc]
    );

    const editor = useEditor(
        {
            immediatelyRender: false,
            extensions,
            editable: canEdit,
            editorProps: {
                attributes: {
                    // Padding is handled by the parent container now
                    class: "prose prose-lg dark:prose-invert focus:outline-none max-w-none min-h-[500px]",
                },
            },
        },
        [extensions, canEdit]
    );

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

    // Handle comment click
    useEffect(() => {
        if (!editor || !editor.view || editor.isDestroyed) return;

        try {
            const editorElement = editor.view.dom;
            if (!editorElement) return;

            const handleClick = (event: MouseEvent) => {
                const target = event.target as HTMLElement;
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

    const handleAddComment = useCallback(() => {
        if (!editor || editor.state.selection.empty) return;

        // 1. Calculate the position of the selection
        const { from } = editor.state.selection;
        const startPos = editor.view.coordsAtPos(from);

        // Get the editor's bounding box to calculate relative position
        const editorDom = editor.view.dom;
        const editorRect = editorDom.getBoundingClientRect();

        // Calculate 'top' relative to the editor container
        // We adjust by window.scrollY if needed, but since our container scrolls,
        // we might need to rely on the relative offset.
        // For now, let's use a simplified relative calculation:
        const relativeTop = startPos.top - editorRect.top + editorDom.offsetTop;

        setCommentFormTop(relativeTop); // Save the position
        setIsCommenting(true);
        // setShowSidebar(true); // Don't open sidebar yet, we want the gutter form
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
            userAvatar: currentUser.avatar,
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
                replyId: uuidv4(),
                userId: currentUser.id,
                userName: currentUser.name,
                userAvatar: currentUser.avatar,
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

    const handleOpenVersionHistory = () => {
        setShowVersionHistory(true);
        onLoadVersions();
    };

    const handleTitleChange = (newTitle: string) => {
        setTitle(newTitle);
        onTitleChange?.(newTitle);
    };

    // ✅ NEW: Enhanced Positioning & Collision Logic
    const updateCommentPositions = useCallback(() => {
        if (!editor) return;

        const editorDom = editor.view.dom;
        const editorRect = editorDom.getBoundingClientRect();
        const rawPositions: { threadId: string; top: number }[] = [];

        // 1. Calculate ideal positions
        threads.forEach((thread) => {
            if (thread.resolved) return;
            const element = editorDom.querySelector(`span[data-thread-id="${thread.threadId}"]`);
            if (element) {
                const rect = element.getBoundingClientRect();
                // Simple relative calculation
                const relativeTop = rect.top - editorRect.top + editorDom.offsetTop;
                rawPositions.push({ threadId: thread.threadId, top: relativeTop });
            }
        });

        // 2. Sort by vertical position (text order)
        rawPositions.sort((a, b) => a.top - b.top);

        // 3. Prevent Overlap (Stacking Logic)
        const finalPositions: Record<string, number> = {};
        let lastBottom = -1;
        const CARD_HEIGHT_ESTIMATE = 100; // Estimated height of a card + gap (adjust if needed)

        rawPositions.forEach((pos) => {
            let actualTop = pos.top;

            // If this card would overlap with the previous one, push it down
            if (actualTop < lastBottom) {
                actualTop = lastBottom + 10; // 10px gap between stacked cards
            }

            finalPositions[pos.threadId] = actualTop;
            // Update the "floor" for the next card
            lastBottom = actualTop + CARD_HEIGHT_ESTIMATE;
        });

        setThreadPositions(finalPositions);
    }, [editor, threads]);

    // Update positions whenever the document changes or selection updates
    useEffect(() => {
        if (!editor) return;

        // Initial calculation
        setTimeout(updateCommentPositions, 100);

        editor.on("update", updateCommentPositions);
        editor.on("selectionUpdate", updateCommentPositions);

        // Also update on window resize
        window.addEventListener("resize", updateCommentPositions);

        return () => {
            editor.off("update", updateCommentPositions);
            editor.off("selectionUpdate", updateCommentPositions);
            window.removeEventListener("resize", updateCommentPositions);
        };
    }, [editor, updateCommentPositions]);

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
                            <EditorContent editor={editor} />
                        </div>

                        {/* 3. The Right Gutter (Reserved Space for Comments) */}
                        {/* ✅ FIX: Changed 'pt-12' to just 'relative' to align 0-to-0 with the editor */}
                        <div className="hidden xl:block w-[300px] shrink-0 pr-6 relative">

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
                                // ✅ FIX: Sort threads by position so they render top-to-bottom
                                threads
                                    .filter(t => !t.resolved && threadPositions[t.threadId] !== undefined)
                                    .sort((a, b) => threadPositions[a.threadId] - threadPositions[b.threadId])
                                    .map((thread) => (
                                        <div
                                            key={thread.threadId}
                                            onClick={() => { setSelectedThreadId(thread.threadId); setShowSidebar(true); }}
                                            className="absolute left-0 w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all z-10"
                                            style={{ top: `${threadPositions[thread.threadId]}px` }}
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className="h-6 w-6 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                                    <img src={thread.userAvatar} className="h-full w-full object-cover" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                        {thread.userName}
                                                    </span>
                                                        <span className="text-[10px] text-gray-400">
                                                        {format(new Date(thread.createdAt), "MMM d")}
                                                    </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">
                                                        {thread.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
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
            />
        </div>
    );
}