"use client";

import { useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {Table} from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";

import { CommentMark } from "./extensions/comment-mark";
import { SlashCommands } from "./extensions/slash-commands";
import { Toolbar } from "./toolbar";
import { CommentSidebar } from "./comment-sidebar";
import { PresenceAvatars } from "./presence-avatars";
import { VersionHistoryDialog } from "./version-history-dialog";
import { CommentThread, DocVersionDTO, AwarenessUser } from "@/model/document";
import { Button } from "@/components/ui/button";
import { History, PanelRightClose, PanelRight } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface NotionEditorProps {
    provider: HocuspocusProvider | null;
    ydoc: Y.Doc | null;
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
                             }: NotionEditorProps) {
    const [showComments, setShowComments] = useState(true);
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const [selectedThreadId, setSelectedThreadId] = useState<string>();

    // === FIX STARTS HERE ===
    // 1. Initialize with default values (safe for Server Side)
    const [currentUser, setCurrentUser] = useState({
        id: "",
        name: "Anonymous",
        avatar: ""
    });

    // 2. Read LocalStorage ONLY on the Client Side (after mount)
    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentUser({
                id: localStorage.getItem("userId") || "",
                name: localStorage.getItem("displayName") || "Anonymous",
                avatar: localStorage.getItem("avatarUrl") || ""
            });
        }
    }, []);

    const currentUserId = localStorage.getItem("userId") || "";
    const currentUserName = localStorage.getItem("displayName") || "Anonymous";
    const currentUserAvatar = localStorage.getItem("avatarUrl") || "";

    const editor = useEditor(
        {
            extensions: [
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
                ...(ydoc
                    ? [
                        Collaboration.configure({
                            document: ydoc,
                        }),
                        CollaborationCursor.configure({
                            provider,
                            user: {
                                name: currentUserName,
                                color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                            },
                        }),
                    ]
                    : []),
            ],
            editable: canEdit,
            editorProps: {
                attributes: {
                    class:
                        "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert focus:outline-none max-w-none min-h-[500px] px-8 py-4",
                },
            },
        },
        [ydoc, provider, canEdit]
    );

    // Handle comment click in editor
    useEffect(() => {
        if (!editor) return;

        const handleClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const commentElement = target.closest("[data-thread-id]");

            if (commentElement) {
                const threadId = commentElement.getAttribute("data-thread-id");
                if (threadId) {
                    setSelectedThreadId(threadId);
                    setShowComments(true);
                }
            }
        };

        const editorElement = editor.view.dom;
        editorElement.addEventListener("click", handleClick);

        return () => {
            editorElement.removeEventListener("click", handleClick);
        };
    }, [editor]);

    // Add comment handler
    const handleAddComment = useCallback(() => {
        if (!editor || editor.state.selection.empty) return;

        const threadId = uuidv4();

        // Apply comment mark to selection
        editor.chain().focus().setComment(threadId).run();

        // Create thread
        const newThread: CommentThread = {
            threadId,
            userId: currentUserId,
            userName: currentUserName,
            userAvatar: currentUserAvatar,
            content: "", // Will be filled by user
            replies: [],
            resolved: false,
            orphaned: false,
            createdAt: new Date().toISOString(),
        };

        // Open prompt for comment content
        const content = window.prompt("Add your comment:");

        if (content) {
            newThread.content = content;
            addThread(newThread);
            setSelectedThreadId(threadId);
            setShowComments(true);
        } else {
            // Remove mark if cancelled
            editor.chain().focus().unsetComment(threadId).run();
        }
    }, [editor, currentUserId, currentUserName, currentUserAvatar, addThread]);

    // Resolve thread handler
    const handleResolveThread = useCallback(
        (threadId: string) => {
            // Remove mark from editor
            editor?.chain().focus().unsetComment(threadId).run();

            // Update thread
            updateThread(threadId, {
                resolved: true,
                resolvedBy: currentUserId,
                resolvedAt: new Date().toISOString(),
            });
        },
        [editor, updateThread, currentUserId]
    );

    // Delete thread handler
    const handleDeleteThread = useCallback(
        (threadId: string) => {
            // Remove mark from editor
            editor?.chain().focus().unsetComment(threadId).run();

            // Delete thread
            deleteThread(threadId);
        },
        [editor, deleteThread]
    );

    // Add reply handler
    const handleAddReply = useCallback(
        (threadId: string, content: string) => {
            const thread = threads.find((t) => t.threadId === threadId);
            if (!thread) return;

            const newReply = {
                replyId: uuidv4(),
                userId: currentUserId,
                userName: currentUserName,
                userAvatar: currentUserAvatar,
                content,
                createdAt: new Date().toISOString(),
            };

            updateThread(threadId, {
                replies: [...thread.replies, newReply],
                updatedAt: new Date().toISOString(),
            });
        },
        [threads, updateThread, currentUserId, currentUserName, currentUserAvatar]
    );

    // Delete reply handler
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

    // Open version history
    const handleOpenVersionHistory = () => {
        setShowVersionHistory(true);
        onLoadVersions();
    };

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
            {/* Main editor area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-4">
                        {/* Connection status */}
                        <div className="flex items-center gap-2">
              <span
                  className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
              />
                            <span className="text-sm text-gray-500">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
                        </div>

                        {/* Presence avatars */}
                        <PresenceAvatars users={awarenessUsers} />
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Version history button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleOpenVersionHistory}
                        >
                            <History className="h-4 w-4 mr-2" />
                            History
                        </Button>

                        {/* Toggle comments sidebar */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowComments(!showComments)}
                        >
                            {showComments ? (
                                <PanelRightClose className="h-4 w-4" />
                            ) : (
                                <PanelRight className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Toolbar */}
                <Toolbar
                    editor={editor}
                    onAddComment={handleAddComment}
                    canEdit={canEdit}
                />

                {/* Editor content */}
                <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* Comments sidebar */}
            {showComments && (
                <CommentSidebar
                    threads={threads}
                    selectedThreadId={selectedThreadId}
                    onSelectThread={setSelectedThreadId}
                    onResolveThread={handleResolveThread}
                    onDeleteThread={handleDeleteThread}
                    onAddReply={handleAddReply}
                    onDeleteReply={handleDeleteReply}
                    currentUserId={currentUserId}
                    canEdit={canEdit}
                />
            )}

            {/* Version history dialog */}
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