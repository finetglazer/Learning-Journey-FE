"use client";

import { PostDetailContext, usePostDetailHook } from "@/components/core/post-detail/post-detail-context";
import { PostDetailHeader } from "@/components/core/post-detail/post-detail-header";
import { PostDetailQuestion } from "@/components/core/post-detail/post-detail-question";

export default function PostDetailPage() {
    return (
        <PostDetailContext.Provider value={usePostDetailHook()}>
            <div className="container mx-auto py-10">
                <PostDetailHeader />
                <PostDetailQuestion />
            </div>
        </PostDetailContext.Provider>
    )
}