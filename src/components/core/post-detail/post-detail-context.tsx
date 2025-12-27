"use client";

import { Post } from "@/model/post";
import { createContext, useContext, useEffect, useState } from "react";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { notFound } from "next/navigation";
import { finalize, forkJoin, of } from "rxjs";
import { catchError } from "rxjs/operators";

export interface PostDetailContextProps {
    postDetailData: Post | null;
    isFetching: boolean;
}

export const PostDetailContext = createContext<PostDetailContextProps>({
    postDetailData: null,
    isFetching: false,
});

export const usePostDetailHook = (postId: number): PostDetailContextProps => {
    const [postDetailData, setPostDetailData] = useState<Post | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    const {
        postRepository,
        userId,
    } = useContext<AppContextProps>(AppContext);

    useEffect(() => {
        if (!postRepository || !postId || !userId) {
            return;
        }
        setIsFetching(true);

        const sub = forkJoin({
            post: postRepository.getPostDetail(userId, postId),
            answers: postRepository.getAnswers(postId).pipe(catchError(() => of({ data: [] }))),
            comments: postRepository.getComments("POST", postId).pipe(catchError(() => of({ data: [] }))),
        })
            .pipe(finalize(() => setIsFetching(false)))
            .subscribe({
                next: ({ post, answers, comments }) => {
                    if (post?.data) {
                        setPostDetailData({
                            ...post.data,
                            authorName: post.data.author.name,
                            authorAvatar: post.data.author.avatar,
                            authorId: post.data.author.userId,
                            answers: answers?.data?.answers || [],
                            comments: comments?.data?.comments || [],
                        });
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
    };
};