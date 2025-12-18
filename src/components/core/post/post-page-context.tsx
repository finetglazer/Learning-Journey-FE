"use client";

import { Post } from "@/model/post";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import {POSTS} from "./index.js";

export interface PostPageContextInterface {
    activeFilter: string | null;
    setActiveFilter: (filter: string | null) => void;
    posts: Post[];
    setPosts: Dispatch<SetStateAction<Post[]>>;
    isFetching: boolean;
    setIsFetching: Dispatch<SetStateAction<boolean>>;
    isCreateNewPost: boolean;
    setIsCreateNewPost: Dispatch<SetStateAction<boolean>>;
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
});

export const usePostPageHooks = (): PostPageContextInterface => {
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>(POSTS);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isCreateNewPost, setIsCreateNewPost] = useState<boolean>(false);
    return {
        activeFilter,
        setActiveFilter,
        posts,
        setPosts,
        isFetching,
        setIsFetching,
        isCreateNewPost,
        setIsCreateNewPost,
    };
};