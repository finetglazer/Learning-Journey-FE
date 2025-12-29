"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Comment } from "@/model/post";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/hooks/app-context";
import { PostDetailContext, PostDetailContextProps } from "./post-detail-context";

const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const { addComment } = useContext<PostDetailContextProps>(PostDetailContext);

    const handleReplySubmit = () => {
        if (!replyContent.trim()) return;
        addComment("COMMENT", comment.commentId, replyContent);
        setIsReplying(false);
        setReplyContent("");
    };

    return (
        <div className={`flex gap-3 ${isReply ? "ml-12 mt-4" : "mt-6"}`}>
            {/* Avatar */}
            {!isReply && (
                <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
            )}

            <div className="flex-1">
                {/* Header: Name, Time, Reply Info */}
                <div className="flex items-center gap-2 text-sm mb-1">
                    {!isReply ? (
                        <>
                            <span className="font-medium text-blue-500">{comment.author.name}</span>
                            <span className="text-gray-500 text-xs">
                                created {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        </>
                    ) : (
                        // Reply header
                        <div className="flex items-center gap-2 w-full justify-between">
                            {/* Styling bit specific to proper threading if needed, but standard is fine */}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="text-gray-700 text-sm leading-relaxed">
                    {comment.content}
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-3 text-xs font-medium text-blue-500">
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="hover:underline cursor-pointer"
                        >
                            Reply
                        </button>
                        {!isReply && (
                            <>
                                <button className="hover:underline cursor-pointer">Edit</button>
                                <button className="text-gray-400 hover:text-red-500 hover:underline cursor-pointer">Delete</button>
                            </>
                        )}
                    </div>

                    {isReply && (
                        <div className="flex items-center gap-2 justify-end text-xs text-gray-500">
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={comment.author.avatar} />
                                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-blue-500">{comment.author.name}</span>
                            <span>created {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                            {comment.replyPreview && (
                                <span className="truncate max-w-[150px]" title={comment.replyPreview}>
                                    reply to "{comment.replyPreview.substring(0, 20)}..."
                                </span>
                            )}
                        </div>
                    )}
                </div>

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
    const LIMIT = 5; // Batch size for fetching
    const { postDetailData } = useContext<PostDetailContextProps>(PostDetailContext);
    const { postRepository } = useContext(AppContext);

    const [isOpen, setIsOpen] = useState(true);
    const [comments, setComments] = useState<Comment[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // Assume true initially or check count
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const commentCount = comments.reduce((acc, curr) => acc + 1 + (curr.replies?.length || 0), 0);

    // Initialize comments from postDetailData (Page 1)
    useEffect(() => {
        if (postDetailData) {
            const initialComments = (postDetailData?.comments || []).filter(comment =>
                targetType === 'POST' ? comment.postId === targetId : comment.answerId === targetId
            );
            setComments(initialComments);
            setPage(1);
        }
    }, [postDetailData, targetType, targetId]);

    const handleLoadMore = () => {
        if (!postRepository) return;
        setIsLoadingMore(true);
        postRepository.getComments(targetType, targetId, page + 1, LIMIT)
            .subscribe({
                next: (res) => {
                    const newComments = res?.comments || [];
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

    return (
        <div>
            {/* Section Header */}
            <div
                className="flex items-center gap-2 cursor-pointer w-fit mb-6 hover:opacity-80 transition-opacity"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="text-gray-500 font-medium text-sm">
                    {/* Assuming dynamic count */}
                    &lt;{commentCount} comments&gt;
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
            </div>

            {/* Comments List */}
            {isOpen && (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.commentId}>
                            <CommentItem comment={comment} />
                            {/* Nested Replies */}
                            {comment.replies?.map((reply) => (
                                <CommentItem key={reply.commentId} comment={reply} isReply={true} />
                            ))}
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
