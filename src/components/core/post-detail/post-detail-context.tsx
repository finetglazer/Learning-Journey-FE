"use client";

import { Post } from "@/model/post";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { notFound } from "next/navigation";
import { finalize } from "rxjs";
import { toast } from "sonner";

export interface PostDetailContextProps {
    postDetailData: Post | null;
    isFetching: boolean;
    updateAnswerAcceptedStatus: (answerId: number) => void;
    hasMoreAnswers: boolean;
    onHasMoreAnswer: (isReload?: boolean) => void;
    addComment: (targetType: "POST" | "ANSWER" | "COMMENT", targetId: number, content: string) => void;
    answerSort: 'newest' | 'most_helpful';
    setAnswerSort: (sort: 'newest' | 'most_helpful') => void;
}

export const PostDetailContext = createContext<PostDetailContextProps>({
    postDetailData: null,
    isFetching: false,
    updateAnswerAcceptedStatus: () => { },
    hasMoreAnswers: true,
    onHasMoreAnswer: () => { },
    addComment: () => { },
    answerSort: 'most_helpful',
    setAnswerSort: () => { },
});

export const usePostDetailHook = (postId: number): PostDetailContextProps => {
    const [postDetailData, setPostDetailData] = useState<Post | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMoreAnswers, setHasMoreAnswers] = useState(true);
    const [answerPage, setAnswerPage] = useState(1);
    const [isFetchingAnswers, setIsFetchingAnswers] = useState(false);
    const [answerSort, setAnswerSort] = useState<'newest' | 'most_helpful'>('most_helpful');

    const {
        postRepository,
        userId,
    } = useContext<AppContextProps>(AppContext);


    const onHasMoreAnswer = useCallback((isReload?: boolean) => {
        if (!postRepository || !postId || isFetchingAnswers) return;

        setIsFetchingAnswers(true);

        postRepository.getAnswers(postId, isReload ? 1 : answerPage + 1, 10, answerSort.toUpperCase())
            .pipe(finalize(() => setIsFetchingAnswers(false)))
            .subscribe({
                next: (res) => {
                    const newAnswers = res?.answers || [];
                    if (newAnswers.length > 0) {
                        setPostDetailData(prev => {
                            if (!prev) return null;
                            if (isReload) {
                                return newAnswers;
                            }
                            return {
                                ...prev,
                                answers: [...(prev.answers || []), ...newAnswers]
                            };
                        });
                        setAnswerPage(prev => prev + 1);
                    }
                    if (newAnswers.length < 10) {
                        setHasMoreAnswers(false);
                    }
                },
                error: (err) => console.error(err)
            });
    }, [postRepository, postId, answerPage, hasMoreAnswers, isFetchingAnswers, answerSort]);

    const addComment = useCallback((targetType: "POST" | "ANSWER" | "COMMENT", targetId: number, content: string) => {
        if (!postRepository || !userId) return;

        const request = {
            targetType,
            targetId,
            content
        };

        const sub = postRepository.addComment(userId, request).subscribe({
            next: (res) => {
                if (res) {
                    if (res?.status) {
                        toast.success(res?.msg || res?.message);
                        setPostDetailData(prev => {
                            if (!prev) return null;
                            const newComment = res.data;
                            return {
                                ...prev,
                                comments: [...(prev.comments || []), newComment]
                            };
                        });
                    }
                    else {
                        toast.error(res?.msg || res?.message);
                    }
                }
            },
            error: (err) => {
                toast.error("Failed to add comment");
                console.error(err);
            }
        });

        return () => sub.unsubscribe();
    }, [postRepository, userId]);


    const updateAnswerAcceptedStatus = useCallback((answerId: number) => {
        if (!postRepository || !postId || !userId) {
            return;
        }
        const sub = postRepository.switchAnswerAcceptStatus(userId, answerId)
            .subscribe({
                next: res => {
                    if (res?.status) {
                        setPostDetailData((prev) => {
                            if (!prev) return prev;
                            return {
                                ...prev,
                                answers: (prev?.answers || []).map((answer) => {
                                    return {
                                        ...answer,
                                        isAccepted: answer.answerId === answerId ? !answer.isAccepted : false,
                                    }
                                }),
                            };
                        });
                    }
                    else {
                        toast.error(res?.message || res?.msg);
                    }
                },
                error: (err) => { },
            });

        return () => {
            sub.unsubscribe();
        };
    }, [
        postRepository,
        postId,
        userId,
    ]);

    useEffect(() => {
        onHasMoreAnswer(true);
    }, [answerSort]);

    useEffect(() => {
        if (!postRepository || !postId || !userId) {
            return;
        }
        setIsFetching(true);

        const sub = postRepository.getPostDetail(userId, postId)
            .pipe(finalize(() => setIsFetching(false)))
            .subscribe({
                next: (res) => {
                    if (res?.data) {
                        setPostDetailData({
                            ...res.data,
                            authorName: res.data.author.name,
                            authorAvatar: res.data.author.avatar,
                            authorId: res.data.author.userId,
                            // Answers and Comments are now included in the main response
                            answers: res.data.answers || [],
                            comments: res.data.comments || [],
                        });
                        // Check if initial answers < 10 to set hasMoreAnswers?
                        // User requested true at first, but logical to set false if < 10.
                        // Stick to user request "true at first" for useState, but update here?
                        // Let's safe update it if clearly no more.
                        if ((res.data.answers || []).length < 10) {
                            setHasMoreAnswers(false);
                        }
                    } else {
                        notFound();
                    }
                },
                error: (err) => {
                    console.error(err);
                    notFound();
                },
            });

        return () => {
            sub.unsubscribe();
        };
    }, [
        postId,
        userId,
        postRepository,
    ]);

    return {
        postDetailData,
        isFetching,
        updateAnswerAcceptedStatus,
        hasMoreAnswers,
        onHasMoreAnswer,
        addComment,
        answerSort,
        setAnswerSort
    };
};