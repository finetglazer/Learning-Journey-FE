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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, History, User, Calendar } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

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
    const [showComments, setShowComments] = useState(true);
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const [selectedThreadId, setSelectedThreadId] = useState<string>();
    const [isMounted, setIsMounted] = useState(false);
    const [title, setTitle] = useState(documentTitle);

    const [currentUser, setCurrentUser] = useState({
        id: "",
        name: "Anonymous",
        avatar: "",
    });

    // Read localStorage and set mounted state
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

    // Sync title with prop
    useEffect(() => {
        setTitle(documentTitle);
    }, [documentTitle]);

    // Extensions without CollaborationCursor
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
                    class:
                        "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert focus:outline-none max-w-none min-h-[500px] px-8 py-4",
                },
            },
        },
        [extensions, canEdit]
    );

    // Handle comment click in editor
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
                        setShowComments(true);
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

        const threadId = uuidv4();
        editor.chain().focus().setComment(threadId).run();

        const newThread: CommentThread = {
            threadId,
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            content: "",
            replies: [],
            resolved: false,
            orphaned: false,
            createdAt: new Date().toISOString(),
        };

        const content = window.prompt("Add your comment:");

        if (content) {
            newThread.content = content;
            addThread(newThread);
            setSelectedThreadId(threadId);
            setShowComments(true);
        } else {
            editor.chain().focus().unsetComment(threadId).run();
        }
    }, [editor, currentUser, addThread]);

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
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar - Back button and Avatars only */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-2">
                        <PresenceAvatars users={awarenessUsers} />
                    </div>
                </div>

                {/* Document Metadata Section */}
                <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <Input
                        type="text"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="<Title>"
                        className="text-3xl font-bold border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0 mb-4"
                        disabled={!canEdit}
                    />

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="font-medium">Created by</span>
                            <span>{createdBy}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">Created at</span>
                            <span>{format(new Date(createdAt), "d MMM, yyyy")}</span>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <Checkbox
                                id="show-comment"
                                checked={showComments}
                                onCheckedChange={(checked) => setShowComments(checked as boolean)}
                            />
                            <Label htmlFor="show-comment" className="cursor-pointer">
                                Show comment
                            </Label>
                        </div>
                    </div>
                </div>

                {/* Bubble Menu */}
                {editor && (
                    <EditorBubbleMenu
                        editor={editor}
                        onAddComment={handleAddComment}
                    />
                )}

                {/* Editor Content */}
                <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
                    <EditorContent editor={editor} />
                </div>
            </div>

            {/* Comment Sidebar */}
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

            {/* Version History Dialog */}
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