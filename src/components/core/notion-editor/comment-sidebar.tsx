"use client";

import { useState } from "react";
import { CommentThread, CommentReply } from "@/model/document";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    CheckCircle,
    MessageCircle,
    Edit2,
    Trash2,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface CommentSidebarProps {
    threads: CommentThread[];
    selectedThreadId?: string;
    onSelectThread: (threadId: string) => void;
    onResolveThread: (threadId: string) => void;
    onDeleteThread: (threadId: string) => void;
    onAddReply: (threadId: string, content: string) => void;
    onDeleteReply: (threadId: string, replyId: string) => void;
    currentUserId: string;
    canEdit?: boolean;
}

export function CommentSidebar({
                                   threads,
                                   selectedThreadId,
                                   onSelectThread,
                                   onResolveThread,
                                   onDeleteThread,
                                   onAddReply,
                                   onDeleteReply,
                                   currentUserId,
                                   canEdit = true,
                               }: CommentSidebarProps) {
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [showResolved, setShowResolved] = useState(false);

    const activeThreads = threads.filter((t) => !t.resolved && !t.orphaned);
    const resolvedThreads = threads.filter((t) => t.resolved || t.orphaned);

    const displayedThreads = showResolved ? resolvedThreads : activeThreads;

    const handleSubmitReply = (threadId: string) => {
        if (!replyContent.trim()) return;
        onAddReply(threadId, replyContent.trim());
        setReplyContent("");
        setReplyingTo(null);
    };

    return (
        <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Comments
                    </h3>
                    <span className="text-sm text-gray-500">
            {activeThreads.length} active
          </span>
                </div>

                {/* Toggle buttons */}
                <div className="flex gap-2">
                    <Button
                        variant={!showResolved ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowResolved(false)}
                        className="flex-1"
                    >
                        Active ({activeThreads.length})
                    </Button>
                    <Button
                        variant={showResolved ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowResolved(true)}
                        className="flex-1"
                    >
                        Resolved ({resolvedThreads.length})
                    </Button>
                </div>
            </div>

            {/* Thread list */}
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-2">
                    {displayedThreads.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">
                                {showResolved ? "No resolved comments" : "No active comments"}
                            </p>
                        </div>
                    ) : (
                        displayedThreads.map((thread) => (
                            <ThreadCard
                                key={thread.threadId}
                                thread={thread}
                                isSelected={selectedThreadId === thread.threadId}
                                onSelect={() => onSelectThread(thread.threadId)}
                                onResolve={() => onResolveThread(thread.threadId)}
                                onDelete={() => onDeleteThread(thread.threadId)}
                                isReplyingTo={replyingTo === thread.threadId}
                                onStartReply={() => setReplyingTo(thread.threadId)}
                                onCancelReply={() => {
                                    setReplyingTo(null);
                                    setReplyContent("");
                                }}
                                replyContent={replyContent}
                                onReplyContentChange={setReplyContent}
                                onSubmitReply={() => handleSubmitReply(thread.threadId)}
                                onDeleteReply={(replyId) =>
                                    onDeleteReply(thread.threadId, replyId)
                                }
                                currentUserId={currentUserId}
                                canEdit={canEdit}
                            />
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

interface ThreadCardProps {
    thread: CommentThread;
    isSelected: boolean;
    onSelect: () => void;
    onResolve: () => void;
    onDelete: () => void;
    isReplyingTo: boolean;
    onStartReply: () => void;
    onCancelReply: () => void;
    replyContent: string;
    onReplyContentChange: (content: string) => void;
    onSubmitReply: () => void;
    onDeleteReply: (replyId: string) => void;
    currentUserId: string;
    canEdit: boolean;
}

function ThreadCard({
                        thread,
                        isSelected,
                        onSelect,
                        onResolve,
                        onDelete,
                        isReplyingTo,
                        onStartReply,
                        onCancelReply,
                        replyContent,
                        onReplyContentChange,
                        onSubmitReply,
                        onDeleteReply,
                        currentUserId,
                        canEdit,
                    }: ThreadCardProps) {
    const isOwner = thread.userId === currentUserId;

    return (
        <div
            className={cn(
                // ✅ ADD 'group' class here
                "rounded-lg border p-3 cursor-pointer transition-colors group relative",
                isSelected
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50",
                thread.orphaned && "opacity-60"
            )}
            onClick={onSelect}
        >
            {/* Thread header */}
            <div className="flex items-start gap-3 mb-2">
                <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={thread.userAvatar} />
                    <AvatarFallback className="text-xs">
                        {thread.userName.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {thread.userName}
                        </div>
                        {/* ✅ MOVED ACTIONS HERE & ADDED HOVER CLASSES */}
                        {canEdit && !thread.resolved && (
                            <div
                                className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                                    onClick={onResolve}
                                    title="Resolve"
                                >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                                    onClick={onDelete}
                                    title="Edit"
                                >
                                    <Edit2 className="h-3.5 w-3.5 text-gray-500" />
                                </Button>
                                {isOwner && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                                        onClick={onDelete}
                                        title="Delete"
                                    >
                                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>


                    {/* ✅ FIX: Added 'break-all' to force long strings to wrap */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-words break-all whitespace-pre-wrap">
                        {thread.content}
                    </p>
                </div>
            </div>

            {/* Status badges */}
            {(thread.resolved || thread.orphaned) && (
                <div className="flex gap-2 mb-2">
                    {thread.resolved && (
                        <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Resolved
            </span>
                    )}
                    {thread.orphaned && (
                        <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
              Text deleted
            </span>
                    )}
                </div>
            )}

            {/* Replies */}
            {thread.replies.length > 0 && (
                <div className="mt-3 space-y-2 border-l-2 border-gray-200 dark:border-gray-600 pl-3">
                    {thread.replies.map((reply) => (
                        <ReplyCard
                            key={reply.replyId}
                            reply={reply}
                            canDelete={reply.userId === currentUserId && canEdit}
                            onDelete={() => onDeleteReply(reply.replyId)}
                        />
                    ))}
                </div>
            )}

            {/* Reply form */}
            {!thread.resolved && !thread.orphaned && canEdit && (
                <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                    {isReplyingTo ? (
                        <div className="space-y-2">
                            <Textarea
                                value={replyContent}
                                onChange={(e) => onReplyContentChange(e.target.value)}
                                placeholder="Write a reply..."
                                className="min-h-[60px] text-sm"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={onSubmitReply}>
                                    Reply
                                </Button>
                                <Button size="sm" variant="outline" onClick={onCancelReply}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onStartReply}
                            className="text-gray-500 text-xs"
                        >
                            Reply
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

interface ReplyCardProps {
    reply: CommentReply;
    canDelete: boolean;
    onDelete: () => void;
}

function ReplyCard({ reply, canDelete, onDelete }: ReplyCardProps) {
    return (
        <div className="group">
            <div className="flex items-start gap-2">
                <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarImage src={reply.userAvatar} />
                    <AvatarFallback className="text-xs">
                        {reply.userName.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        {reply.userName}
                    </div>
                    {/* ✅ FIX: Added 'break-all' here too */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 break-words break-all whitespace-pre-wrap">
                        {reply.content}
                    </p>
                </div>
                {canDelete && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                )}
            </div>
        </div>
    );
}