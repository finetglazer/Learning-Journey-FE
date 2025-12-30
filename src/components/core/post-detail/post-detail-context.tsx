"use client";

import { Post } from "@/model/post";
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { notFound } from "next/navigation";
import { finalize, Observable, map } from "rxjs";
import { toast } from "sonner";

export interface PostDetailContextProps {
    postDetailData: Post | null;
    setPostDetailData: Dispatch<SetStateAction<Post | null>>;
    isFetching: boolean;
    updateAnswerAcceptedStatus: (answerId: number) => void;
    hasMoreAnswers: boolean;
    onHasMoreAnswer: (isReload?: boolean) => void;
    addComment: (targetType: "POST" | "ANSWER" | "COMMENT", targetId: number, content: string) => void;
    deleteComment: (commentId: number) => void;
    updateComment: (commentId: number, content: string) => void;
    answerSort: 'newest' | 'most_helpful';
    setAnswerSort: (sort: 'newest' | 'most_helpful') => void;
    updateAnswer: (answerId: number, content: any) => Observable<any>;
    userId: number | null;
    email: string;
}

export const PostDetailContext = createContext<PostDetailContextProps>({
    postDetailData: null,
    setPostDetailData: () => { },
    isFetching: false,
    updateAnswerAcceptedStatus: () => { },
    hasMoreAnswers: true,
    onHasMoreAnswer: () => { },
    addComment: () => { },
    deleteComment: () => { },
    updateComment: () => { },
    answerSort: 'most_helpful',
    setAnswerSort: () => { },
    updateAnswer: () => new Observable(),
    userId: null,
    email: "",
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
        email,
    } = useContext<AppContextProps>(AppContext);

    const onHasMoreAnswer = useCallback((isReload?: boolean) => {
        if (!postRepository || !postId || isFetchingAnswers) return;

        setIsFetchingAnswers(true);

        postRepository.getAnswers(postId, isReload ? 1 : answerPage + 1, 10, answerSort.toUpperCase())
            .pipe(finalize(() => setIsFetchingAnswers(false)))
            .subscribe({
                next: (res) => {
                    const newAnswers = res?.data?.answers || [];
                    if (newAnswers.length > 0) {
                        setPostDetailData(prev => {
                            if (!prev) return null;
                            if (isReload) {
                                return {
                                    ...prev,
                                    answers: newAnswers
                                }
                            }
                            return {
                                ...prev,
                                answers: [...(prev.answers || []), ...newAnswers]
                            };
                        });
                        setAnswerPage(prev => isReload ? 1 : prev + 1);
                    }
                    if (newAnswers.length < 10) {
                        setHasMoreAnswers(false);
                    }
                },
                error: (err) => { }
            });
    }, [
        postRepository,
        postId,
        answerPage,
        hasMoreAnswers,
        isFetchingAnswers,
        answerSort
    ]);

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

    const deleteComment = useCallback((commentId: number) => {
        if (!postRepository || !userId) return;

        const sub = postRepository.deleteComment(userId, commentId).subscribe({
            next: (res) => {
                if (res?.status) {
                    toast.success(res?.msg || res?.message);
                    setPostDetailData(prev => {
                        if (!prev) return null;
                        return {
                            ...prev,
                            comments: (prev.comments || []).filter(c => c.commentId !== commentId)
                        };
                    });
                } else {
                    toast.error(res?.msg || res?.message);
                }
            },
            error: (err) => {
                toast.error("Failed to delete comment");
                console.error(err);
            }
        });

        return () => sub.unsubscribe();
    }, [postRepository, userId]);

    const updateComment = useCallback((commentId: number, content: string) => {
        if (!postRepository || !userId) return;

        const sub = postRepository.updateComment(userId, commentId, content).subscribe({
            next: (res) => {
                if (res?.status) {
                    toast.success(res?.msg || res?.message);
                    setPostDetailData(prev => {
                        if (!prev) return null;
                        return {
                            ...prev,
                            comments: (prev.comments || []).map(c =>
                                c.commentId === commentId ? { ...c, content } : c
                            )
                        };
                    });
                } else {
                    toast.error(res?.msg || res?.message);
                }
            },
            error: (err) => {
                toast.error("Failed to update comment");
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
        }

    }, [
        postRepository,
        postId,
        userId,
    ]);

    const updateAnswer = useCallback((answerId: number, content: any) => {
        if (!postRepository || !userId) return new Observable();

        return postRepository.updateAnswer(userId, answerId, { content }).pipe(
            map((res) => {
                if (res?.status) {
                    setPostDetailData((prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            answers: (prev.answers || []).map((ans) =>
                                ans.answerId === answerId ? { ...ans, content } : ans
                            ),
                        };
                    });
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
                return res;
            })
        );
    }, [postRepository, userId]);

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
                            authorEmail: res.data.author.email,
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
        setPostDetailData,
        isFetching,
        updateAnswerAcceptedStatus,
        hasMoreAnswers,
        onHasMoreAnswer,
        addComment,
        deleteComment,
        updateComment,
        answerSort,
        setAnswerSort,
        updateAnswer,
        userId,
        email
    };
};