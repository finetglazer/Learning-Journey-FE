"use client";

import { Post } from "@/model/post";
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { CreatePostModel } from "@/model/create-post-model";
import { AlertMessage } from "../alert-modal/alert-modal";
import { Observable, of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

export interface PostPageContextInterface {
    activeFilter: string | null;
    setActiveFilter: (filter: string | null) => void;
    posts: Post[];
    setPosts: Dispatch<SetStateAction<Post[]>>;
    isFetching: boolean;
    setIsFetching: Dispatch<SetStateAction<boolean>>;
    isCreateNewPost: boolean;
    setIsCreateNewPost: Dispatch<SetStateAction<boolean>>;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    page: number;
    showMore: () => void;
    showLess: () => void;
    hasMore: boolean;
    alertMessage: AlertMessage | null;
    setAlertMessage: Dispatch<SetStateAction<AlertMessage | null>>;
    onCreatePost: (body: CreatePostModel) => Observable<any>;
};

export const PostPageContext = createContext<PostPageContextInterface>({
    activeFilter: null,
    setActiveFilter: () => { },
    posts: [],
    setPosts: () => { },
    isFetching: false,
    setIsFetching: () => { },
    isCreateNewPost: false,
    setIsCreateNewPost: () => { },
    onCreatePost: () => of({}),
    searchTerm: "",
    setSearchTerm: () => { },
    page: 1,
    showMore: () => { },
    showLess: () => { },
    hasMore: false,
    alertMessage: null,
    setAlertMessage: () => { },
});

export const usePostPageHooks = (): PostPageContextInterface => {
    const { userId } = useContext(AppContext);
    const {
        postRepository,
    } = useContext<AppContextProps>(AppContext);
    const [activeFilter, setActiveFilterState] = useState<string | null>("ALL"); // Default to ALL or relevant filter
    const [posts, setPosts] = useState<Post[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isCreateNewPost, setIsCreateNewPost] = useState<boolean>(false);
    const [searchTerm, setSearchTermState] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

    const LIMIT = 5;

    const setActiveFilter = (filter: string | null) => {
        setActiveFilterState(filter);
        setPage(1);
    };

    const setSearchTerm = (term: string) => {
        setSearchTermState(term);
        setPage(1);
    }

    const showMore = () => {
        setPage(prev => prev + 1);
    }

    const showLess = () => {
        setPage(1);
        // Scroll to top or handle UI reset if needed, but page 1 fetch will replace posts
    }

    const onCreatePost = useCallback((body: CreatePostModel): Observable<any> => {
        if (!postRepository || !userId) {
            return of({});
        }
        return postRepository.createPost(userId, body).pipe(
            tap((res: any) => {
                if (res?.status) {
                    setPosts(prev => [...prev, res.data.post]);
                    setIsCreateNewPost(false);
                } else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.msg || res?.message,
                        description: res?.data,
                    });
                }
            }),
            catchError((err) => {
                const errors = err?.response?.data?.data;
                const message = err?.response?.data?.msg || err?.response?.data?.message;
                setAlertMessage({
                    type: "error",
                    title: message,
                    description: errors,
                });
                return throwError(() => err);
            })
        );
    }, [postRepository, userId]);

    useEffect(() => {
        setIsFetching(true);
        if (!postRepository) {
            return;
        }
        const sub = postRepository.getPosts(userId || 0, page, LIMIT, activeFilter || "ALL", "NEWEST", searchTerm)
            .subscribe({
                next: (res: any) => {
                    const newPosts = res?.data?.posts || [];

                    // If API doesn't return total, we can guess hasMore if newPosts.length === LIMIT
                    // But to be safe for "Show More" button visibility:
                    setHasMore(newPosts.length === LIMIT);

                    if (page === 1) {
                        setPosts(newPosts);
                    } else {
                        setPosts(prev => [...prev, ...newPosts]);
                    }
                    setIsFetching(false);
                },
                error: (err) => {
                    if (page === 1) setPosts([]);
                    setIsFetching(false);
                }
            });
        return () => sub.unsubscribe();
    }, [userId, activeFilter, searchTerm, page, postRepository]);

    return {
        activeFilter,
        setActiveFilter,
        posts,
        setPosts,
        isFetching,
        setIsFetching,
        onCreatePost,
        isCreateNewPost,
        setIsCreateNewPost,
        searchTerm,
        setSearchTerm,
        page,
        showMore,
        showLess,
        hasMore,
        alertMessage,
        setAlertMessage,
    };
};