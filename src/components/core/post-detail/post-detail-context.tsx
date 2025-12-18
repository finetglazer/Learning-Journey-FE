"use client";

import { Post } from "@/model/post";
import { createContext, useState } from "react";
import { postDetail } from "./index";

export interface PostDetailContextProps {
    postDetailData: Post | null;
}

export const PostDetailContext = createContext<PostDetailContextProps>({
    postDetailData: null,
});

export const usePostDetailHook = (): PostDetailContextProps => {
    const [postDetailData, setPostDetailData] = useState<Post | null>(postDetail);

    return {
        postDetailData,
    };
};