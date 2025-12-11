"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
}

// Generate stable color on client side only
function getStableColor(userId: string): string {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
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
    const [isMounted, setIsMounted] = useState(false);

    // Store user info in state - only read localStorage after mount
    const [currentUser, setCurrentUser] = useState({
        id: "",
        name: "Anonymous",
        avatar: "",
        color: "#4ECDC4"
    });

    // Read localStorage ONLY on client side after mount
    useEffect(() => {
        setIsMounted(true);
        const userId = localStorage.getItem("userId") || "";
        const displayName = localStorage.getItem("displayName") || "Anonymous";
        const avatarUrl = localStorage.getItem("avatarUrl") || "";

        setCurrentUser({
            id: userId,
            name: displayName,
            avatar: avatarUrl,
            color: getStableColor(userId || "anonymous")
        });
    }, []);

    // Patch provider.doc for Tiptap compatibility - only after mount
    useEffect(() => {
        if (provider && !(provider as any).doc) {
            (provider as any).doc = ydoc;
        }
    }, [provider, ydoc]);

    // Memoize extensions to prevent recreation
    const extensions = useMemo(() => {
        const baseExtensions = [
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
        ];

        // Only add collaboration extensions when mounted and provider/ydoc are ready
        if (isMounted && ydoc && provider) {
            baseExtensions.push(
                Collaboration.configure({
                    document: ydoc,
                }),
                CollaborationCursor.configure({
                    provider: provider,
                    user: {
                        name: currentUser.name,
                        color: currentUser.color,
                    },
                })
            );
        }

        return baseExtensions;
    }, [ydoc, provider, isMounted, currentUser.name, currentUser.color]);

    const editor = useEditor(
        {
            immediatelyRender: false,
            extensions,
            editable: canEdit,
            editorProps: {
                attributes: {
                    class:
                        "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert focus:outline-none max-w-none min-h-[500px] px-8 py-4",
                },
            },
        },
        [extensions, canEdit]
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
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
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
    }, [editor, currentUser, addThread]);

    // Resolve thread handler
    const handleResolveThread = useCallback(
        (threadId: string) => {
            // Remove mark from editor
            editor?.chain().focus().unsetComment(threadId).run();

            // Update thread
            updateThread(threadId, {
                resolved: true,
                resolvedBy: currentUser.id,
                resolvedAt: new Date().toISOString(),
            });
        },
        [editor, updateThread, currentUser.id]
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

    // Don't render until mounted to avoid hydration issues
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
                    currentUserId={currentUser.id}
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