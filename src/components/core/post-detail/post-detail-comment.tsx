"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AppContext } from "@/hooks/app-context";
import { Comment, PostAuthor } from "@/model/post";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { PostDetailContext, PostDetailContextProps } from "./post-detail-context";
import { AlertMessage, AlertModal } from "../alert-modal/alert-modal";
import { toast } from "sonner";
// Local AuthorHoverInfo removed used from import
import { AuthorHoverInfo } from "./author-hover-info";

const CommentItem = ({ comment, onUpdate }: { comment: Comment, onUpdate: (id: number, content: string) => void }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

    const { addComment, deleteComment, userId } = useContext<PostDetailContextProps>(PostDetailContext);

    const handleReplySubmit = () => {
        if (!replyContent.trim()) return;
        addComment("COMMENT", comment.commentId, replyContent);
        setIsReplying(false);
        setReplyContent("");
    };

    const handleDelete = () => {
        setAlertMessage({
            title: "Are you sure you want to delete this comment?",
            description: "This action cannot be undone.",
            type: "warning",
            proceedAnyway: () => deleteComment(comment.commentId),
        });
    };

    const handleUpdate = () => {
        if (!editContent.trim()) return;
        onUpdate(comment.commentId, editContent);
        setIsEditing(false);
    };

    return (
        <div className="mt-1 border-b border-gray-100 pb-1 last:border-0">
            <div className="flex-1">
                {/* Content */}
                {isEditing ? (
                    <div className="mb-2">
                        <Input
                            className="text-sm h-9 mb-2"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs cursor-pointer"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(comment.content);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                className="h-7 px-2 text-xs cursor-pointer"
                                onClick={handleUpdate}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-700 text-sm leading-relaxed mb-1">
                        {comment.content}
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-xs font-medium text-blue-500">
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="hover:underline cursor-pointer"
                        >
                            Reply
                        </button>
                        {comment.author.userId === userId && (
                            <>
                                <button
                                    className="hover:underline cursor-pointer"
                                    onClick={() => {
                                        setIsEditing(true);
                                        setEditContent(comment.content);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-gray-400 hover:text-red-500 hover:underline cursor-pointer"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2 justify-end text-xs text-gray-500">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-blue-500"><AuthorHoverInfo author={comment.author} currentUserId={userId} /></span>
                        <span>created {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                        {comment.replyPreview && (
                            <span className="truncate max-w-[200px] text-gray-400" title={comment.replyPreview}>
                                reply to "{comment.replyPreview.length > 30 ? comment.replyPreview.substring(0, 30) + '...' : comment.replyPreview}"
                            </span>
                        )}
                    </div>
                </div>

                {alertMessage && (
                    <AlertModal
                        alertMessage={alertMessage}
                        onClose={() => setAlertMessage(null)}
                    />
                )}

                {/* Reply Input */}
                {isReplying && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                        <Textarea
                            placeholder="Write a reply..."
                            className="text-sm min-h-[80px]"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <Button variant="ghost" className="cursor-pointer" size="sm" onClick={() => setIsReplying(false)}>Cancel</Button>
                            <Button size="sm" className="cursor-pointer" onClick={handleReplySubmit}>Reply</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export function PostDetailComment({
    targetType,
    targetId,
}: {
    targetType: 'POST' | 'ANSWER';
    targetId: number;
}) {
    const LIMIT = 2; // Batch size for fetching
    const { postDetailData, setPostDetailData, } = useContext<PostDetailContextProps>(PostDetailContext);
    const { postRepository, userId } = useContext(AppContext);

    const [isOpen, setIsOpen] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // Assume true initially or check count
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Initialize comments from postDetailData (Page 1)
    useEffect(() => {
        if (postDetailData) {
            const initialComments = (postDetailData?.comments || []).filter(comment =>
                targetType === 'POST' ? comment.postId === targetId : comment.answerId === targetId
            );
            setComments(initialComments);
            setPage(1);
        }
    }, [postDetailData?.comments, targetType, targetId]);

    const handleLoadMore = () => {
        if (!postRepository) return;
        setIsLoadingMore(true);
        postRepository.getComments(targetType, targetId, page + 1, LIMIT)
            .subscribe({
                next: (res) => {
                    const newComments = res?.data?.comments || [];
                    if (newComments.length > 0) {
                        setComments(prev => [...prev, ...newComments]);
                        setPage(prev => prev + 1);
                    }
                    if (newComments.length < LIMIT) {
                        setHasMore(false);
                    }
                    setIsLoadingMore(false);
                },
                error: (err) => {
                    console.error("Failed to load more comments", err);
                    setIsLoadingMore(false);
                }
            });
    };

    const handleUpdateComment = (commentId: number, content: string) => {
        if (!postRepository || !userId) return;

        postRepository.updateComment(userId, commentId, content).subscribe({
            next: (res) => {
                if (res?.status) {
                    toast.success(res?.msg || "Updated comment successfully");
                    setPostDetailData(prev => {
                        if (!prev) return null;
                        return {
                            ...prev,
                            comments: prev.comments?.map(c => c.commentId === commentId ? { ...c, content } : c) || []
                        };
                    });
                } else {
                    toast.error(res?.msg || "Failed to update comment");
                }
            },
            error: (err) => {
                console.error(err);
                toast.error("Failed to update comment");
            }
        });
    };

    return (
        <div>
            {/* Section Header */}
            <div
                className="flex items-center gap-2 cursor-pointer w-fit mb-6 hover:opacity-80 transition-opacity"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="text-gray-500 font-medium text-sm">
                    {/* Assuming dynamic count */}
                    &lt;{comments.length} comments&gt;
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
            </div>

            {/* Comments List */}
            {isOpen && (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.commentId}>
                            <CommentItem
                                comment={comment}
                                onUpdate={handleUpdateComment}
                            />
                        </div>
                    ))}

                    {(hasMore && comments.length > 0) && (
                        <div className="pt-4">
                            <button
                                className="text-gray-500 text-sm hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                            >
                                {isLoadingMore ? "Loading..." : "Show more comments"}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
