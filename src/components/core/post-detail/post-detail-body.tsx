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


export const PostDetailBody = () => {
    const { postDetailData } = useContext<PostDetailContextProps>(PostDetailContext);
    const [isQuestionCommentOpen, setIsQuestionCommentOpen] = useState(false);
    const [replyingToAnswerId, setReplyingToAnswerId] = useState<number | null>(null);

    if (!postDetailData) return null;

    return (
        <div className="flex gap-10 mt-6">
            {/* Left Column: Vote Counter */}
            <div className="flex flex-col items-center gap-1 mt-5">
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 cursor-pointer">
                    <ChevronUp className="h-8 w-8 text-gray-500" />
                </Button>

                <span className="text-2xl font-semibold text-gray-700">
                    {postDetailData.stats.score}
                </span>

                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 cursor-pointer">
                    <ChevronDown className="h-8 w-8 text-gray-500" />
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
                    <button className="text-gray-500 text-sm font-medium hover:text-blue-500 cursor-pointer">
                        Edit
                    </button>
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
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    setIsQuestionCommentOpen(false);
                                }
                            }}
                        />
                        <div className="flex justify-end mt-2">
                            <Button
                                size="sm"
                                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
                                onClick={() => setIsQuestionCommentOpen(false)}
                            >
                                Post Comment
                            </Button>
                        </div>
                    </div>
                )}

                {/* Question Comments Section */}
                <PostDetailComment comments={(postDetailData?.comments || []).filter(comment => comment.answerId === null)} />

                {/* Answers Header Separator */}
                <div className="flex items-center justify-between mt-10 border-b pb-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-700">
                        {postDetailData.stats.answerCount} answers
                    </h3>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 h-9 px-4 font-medium text-sm cursor-pointer"
                        >
                            <Flag className="mr-2 h-4 w-4" /> Newest
                        </Button>
                        <Button
                            variant="ghost"
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 h-9 px-4 font-medium text-sm cursor-pointer"
                        >
                            <ArrowUp className="mr-2 h-5 w-5" /> Most helpful
                        </Button>
                    </div>
                </div>
                {/* Answers List */}
                <div className="space-y-10">
                    {(postDetailData?.answers || []).map((answer) => (
                        <div key={answer.id} className="flex gap-6">
                            {/* Answer Vote Counter */}
                            <div className="flex flex-col items-center gap-1">
                                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 cursor-pointer">
                                    <ChevronUp className="h-8 w-8 text-gray-500" />
                                </Button>

                                <span className="text-xl font-semibold text-gray-700">
                                    {answer.score}
                                </span>

                                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 cursor-pointer">
                                    <ChevronDown className="h-8 w-8 text-gray-500" />
                                </Button>

                                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 cursor-pointer mt-2">
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
                                <div className="text-gray-800 leading-relaxed mb-4">
                                    {answer.content}
                                </div>

                                {/* Answer Metadata / Actions */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <button
                                            className="text-blue-500 text-sm hover:underline cursor-pointer"
                                            onClick={() => setReplyingToAnswerId(replyingToAnswerId === answer.answerId ? null : answer.answerId)}
                                        >
                                            Comment
                                        </button>
                                        <button
                                            className="text-blue-500 text-sm hover:underline cursor-pointer"
                                            onClick={() => setIsQuestionCommentOpen(false)}
                                        >
                                            Edit
                                        </button>
                                        <button className="text-gray-400 text-sm hover:text-red-500 hover:underline cursor-pointer">
                                            Delete
                                        </button>
                                    </div>

                                    {/* Author Card (Right aligned) */}
                                    <div className="flex items-center gap-3 bg-blue-50/50 p-2 rounded-lg border border-blue-100 min-w-[200px]">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={answer.author.avatar} />
                                            <AvatarFallback>{answer.author.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-900">{answer.author.name}</span>
                                            {answer.author.email && (
                                                <span className="text-xs text-gray-500">{answer.author.email}</span>
                                            )}
                                            <span className="text-xs text-gray-400 mt-1">
                                                answered {formatDistanceToNow(answer.createdAt, { addSuffix: true })}
                                            </span>
                                        </div>
                                        <Button className="ml-auto bg-emerald-300 hover:bg-emerald-400 text-emerald-900 text-xs h-7 px-2 cursor-pointer rounded shadow-sm">
                                            Invite to your project
                                        </Button>
                                    </div>
                                </div>

                                {/* Answer Comment Input */}
                                {replyingToAnswerId === answer.answerId && (
                                    <div className="mb-4 animate-in fade-in slide-in-from-top-2">
                                        <Textarea
                                            placeholder="Write a comment..."
                                            className="resize-none min-h-[50px] border-gray-300 text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    setReplyingToAnswerId(null);
                                                }
                                            }}
                                        />
                                        <div className="flex justify-end mt-2">
                                            <Button
                                                size="sm"
                                                className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white"
                                                onClick={() => setReplyingToAnswerId(null)}
                                            >
                                                Post Comment
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Answer Comments */}
                                <PostDetailComment comments={(postDetailData.comments || []).filter(comment => comment.answerId === answer.answerId)} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 mb-20">
                    <PostDetailAnswerEditor />
                </div>
            </div>
        </div>
    );
};
