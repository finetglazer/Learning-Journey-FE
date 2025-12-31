"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { ArrowUp, ChevronDown, ChevronUp, Flag } from "lucide-react";
import { useContext, useState } from "react";
import { PostDetailComment } from "./post-detail-comment";
import { PostDetailContext, PostDetailContextProps } from "./post-detail-context";
import { PostDetailQuestion } from "./post-detail-question";
import { PostDetailAnswerEditor } from "./post-detail-answer-editor";
import { RichTextRenderer } from "../rich-text/rich-text-renderer";
import { PostDetailAnswerEditForm } from "./post-detail-answer-edit-form";
import { AuthorHoverInfo } from "./author-hover-info";
import { CreatePostModal } from "../post/create-post-modal";
import { CreatePostModel } from "@/model/create-post-model";
import { toast } from "sonner";
import { AppContext } from "@/hooks/app-context";


export const PostDetailBody = () => {
    const {
        postDetailData,
        updateAnswerAcceptedStatus,
        hasMoreAnswers,
        onHasMoreAnswer,
        addComment,
        answerSort,
        setAnswerSort,
        userId: currentUserId,
        setPostDetailData,
        onVotePost,
        onVoteAnswer,
    } = useContext<PostDetailContextProps>(PostDetailContext);

    const { postRepository } = useContext(AppContext);

    const [isQuestionCommentOpen, setIsQuestionCommentOpen] = useState(false);
    const [replyingToAnswerId, setReplyingToAnswerId] = useState<number | null>(null);
    const [commentContent, setCommentContent] = useState("");
    const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleUpdatePost = (model: CreatePostModel) => {
        if (!postRepository || !currentUserId || !postDetailData) return;

        postRepository.updatePost(currentUserId, postDetailData.postId, model).subscribe({
            next: (res: any) => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg || "Post updated successfully");
                    setIsEditModalOpen(false);
                    setPostDetailData({
                        ...postDetailData,
                        title: model.title,
                        content: model.content,
                        tags: model.tags
                    });
                }
                else {
                    toast.error(res?.msg || res?.message || "Failed to update post");
                }
            },
            error: (err) => {
                console.error(err);
                toast.error("Failed to update post");
            }
        });
    };

    const handleSubmitComment = (targetType: "POST" | "ANSWER", targetId: number) => {
        if (!commentContent.trim()) return;
        addComment(targetType, targetId, commentContent);
        setCommentContent("");
        if (targetType === "POST") setIsQuestionCommentOpen(false);
        if (targetType === "ANSWER") setReplyingToAnswerId(null);
    };

    if (!postDetailData) return null;

    return (
        <div className="flex gap-10 mt-6">
            {/* Left Column: Vote Counter */}
            <div className="flex flex-col items-center gap-1 mt-5">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 cursor-pointer"
                    onClick={() => onVotePost('UPVOTE')}
                >
                    <ChevronUp className={`h-8 w-8 ${postDetailData.userVote === 1 ? 'text-orange-500' : 'text-gray-500'}`} />
                </Button>

                <span className="text-2xl font-semibold text-gray-700">
                    {postDetailData.stats.score}
                </span>

                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-10 w-10 cursor-pointer"
                    onClick={() => onVotePost('DOWNVOTE')}
                >
                    <ChevronDown className={`h-8 w-8 ${postDetailData.userVote === -1 ? 'text-red-500' : 'text-gray-500'}`} />
                </Button>
            </div>

            {/* Right Column: Question Content + Comments */}
            <div className="flex-1 min-w-0">
                <PostDetailQuestion />

                {/* Actions Row */}
                <div className="flex items-center gap-4 mt-2 mb-6">
                    <button
                        className="text-gray-500 text-sm font-medium hover:text-blue-500 cursor-pointer"
                        onClick={() => {
                            setIsQuestionCommentOpen(prev => !prev);
                        }}
                    >
                        Comment
                    </button>
                    {currentUserId === postDetailData.authorId && (
                        <button
                            className="text-gray-500 text-sm font-medium hover:text-blue-500 cursor-pointer"
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            Edit
                        </button>
                    )}
                    <button className="text-gray-500 text-sm font-medium hover:text-red-500 cursor-pointer">
                        Delete
                    </button>
                </div>

                {/* Comment Input */}
                {isQuestionCommentOpen && (
                    <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                        <Textarea
                            placeholder="Only text type allowed for comments"
                            className="resize-none min-h-[50px] border-gray-300 text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                            autoFocus
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmitComment('POST', postDetailData.postId);
                                }
                            }}
                        />
                        <div className="flex justify-end mt-2">
                            <Button
                                size="sm"
                                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
                                onClick={() => handleSubmitComment('POST', postDetailData.postId)}
                            >
                                Post Comment
                            </Button>
                        </div>
                    </div>
                )}

                {/* Question Comments Section */}
                <PostDetailComment targetType="POST" targetId={postDetailData.postId} />

                {/* Answers Header Separator */}
                <div className="flex items-center justify-between mt-10 border-b pb-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-700">
                        {postDetailData.stats.answerCount} answers
                    </h3>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            className={`gap-2 cursor-pointer transition-colors ${answerSort === "newest"
                                ? "bg-teal-500 text-white hover:bg-teal-600"
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                                }`}
                            onClick={() => setAnswerSort("newest")}
                        >
                            <Flag className="h-4 w-4" />
                            Newest
                        </Button>
                        <Button
                            variant="ghost"
                            className={`gap-2 cursor-pointer transition-colors ${answerSort === "most_helpful"
                                ? "bg-teal-500 text-white hover:bg-teal-600"
                                : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                                }`}
                            onClick={() => setAnswerSort("most_helpful")}
                        >
                            <ArrowUp className="h-4 w-4" />
                            Most helpful
                        </Button>
                    </div>
                </div>
                {/* Answers List */}
                <div className="space-y-10">
                    {postDetailData?.answers?.map((answer) => {
                        const isAuthor = currentUserId === answer.author.userId;
                        return (
                            <div key={answer.answerId} className="flex gap-6">
                                {/* Answer Vote Counter */}
                                <div className="flex flex-col items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full h-10 w-10 cursor-pointer"
                                        onClick={() => onVoteAnswer(answer.answerId, 'UPVOTE')}
                                    >
                                        <ChevronUp className={`h-8 w-8 ${answer.userVote === 1 ? 'text-orange-500' : 'text-gray-500'}`} />
                                    </Button>

                                    <span className="text-xl font-semibold text-gray-700">
                                        {answer.score}
                                    </span>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full h-10 w-10 cursor-pointer"
                                        onClick={() => onVoteAnswer(answer.answerId, 'DOWNVOTE')}
                                    >
                                        <ChevronDown className={`h-8 w-8 ${answer.userVote === -1 ? 'text-red-500' : 'text-gray-500'}`} />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full h-10 w-10 cursor-pointer mt-2"
                                        onClick={() => updateAnswerAcceptedStatus(answer.answerId)}
                                    >
                                        {answer.isAccepted ? (
                                            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center shadow-sm">
                                                <span className="text-white text-lg font-bold">✓</span>
                                            </div>
                                        ) : (
                                            <div className="h-8 w-8 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors" />
                                        )}
                                    </Button>
                                </div>

                                {/* Answer Content */}
                                <div className="flex-1 min-w-0">
                                    {editingAnswerId === answer.answerId ? (
                                        <div className="mb-4">
                                            <PostDetailAnswerEditForm
                                                answerId={answer.answerId}
                                                initialContent={answer.content}
                                                onCancel={() => setEditingAnswerId(null)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-gray-800 leading-relaxed mb-4">
                                            <RichTextRenderer content={answer.content} />
                                        </div>
                                    )}

                                    {/* Answer Metadata / Actions */}
                                    {editingAnswerId !== answer.answerId && (
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    className="text-blue-500 text-sm hover:underline cursor-pointer"
                                                    onClick={() => {
                                                        setReplyingToAnswerId(replyingToAnswerId === answer.answerId ? null : answer.answerId);
                                                        setCommentContent("");
                                                    }}
                                                >
                                                    Comment
                                                </button>
                                                {isAuthor && (
                                                    <>
                                                        <button
                                                            className="text-blue-500 text-sm hover:underline cursor-pointer"
                                                            onClick={() => setEditingAnswerId(answer.answerId)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button className="text-gray-400 text-sm hover:text-red-500 hover:underline cursor-pointer">
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 justify-end">
                                                <Avatar className="h-5 w-5">
                                                    <AvatarImage src={answer.author.avatar} />
                                                    <AvatarFallback>{answer.author.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <AuthorHoverInfo
                                                    author={answer.author}
                                                    currentUserId={currentUserId}
                                                    className="text-sm"
                                                />
                                                <span className="text-xs text-gray-500">
                                                    created {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Answer Comment Input */}
                                    {replyingToAnswerId === answer.answerId && (
                                        <div className="mb-4 animate-in fade-in slide-in-from-top-2">
                                            <Textarea
                                                placeholder="Write a comment..."
                                                className="resize-none min-h-[50px] border-gray-300 text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                                                autoFocus
                                                value={commentContent}
                                                onChange={(e) => setCommentContent(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSubmitComment('ANSWER', answer.answerId);
                                                    }
                                                }}
                                            />
                                            <div className="flex justify-end mt-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
                                                    onClick={() => handleSubmitComment('ANSWER', answer.answerId)}
                                                >
                                                    Post Comment
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Answer Comments List */}
                                    <PostDetailComment targetType="ANSWER" targetId={answer.answerId} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {hasMoreAnswers && (
                    <div className="flex justify-center mt-8">
                        <Button
                            variant="outline"
                            className="bg-white hover:bg-gray-50 text-blue-600 border-blue-200 cursor-pointer min-w-[200px]"
                            onClick={onHasMoreAnswer as any}
                        >
                            Load more answers
                        </Button>
                    </div>
                )}

                <div className="mt-12 mb-20">
                    <PostDetailAnswerEditor />
                </div>
            </div>

            {isEditModalOpen && (
                <CreatePostModal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialData={{
                        title: postDetailData.title,
                        content: postDetailData.content,
                        tags: postDetailData.tags
                    }}
                    onSubmit={handleUpdatePost}
                />
            )}
        </div>
    );
};
