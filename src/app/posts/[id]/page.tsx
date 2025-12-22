"use client";

import { PostDetailBody } from "@/components/core/post-detail/post-detail-body";
import { PostDetailContext, usePostDetailHook } from "@/components/core/post-detail/post-detail-context";
import { PostDetailHeader } from "@/components/core/post-detail/post-detail-header";

export default function PostDetailPage() {
    return (
        <PostDetailContext.Provider value={usePostDetailHook()}>
            <div className="container mx-auto py-10">
                <PostDetailHeader />
                <PostDetailBody />
            </div>
        </PostDetailContext.Provider>
    )
}