"use client";

import { PostDetailBody } from "@/components/core/post-detail/post-detail-body";
import { PostDetailContext, usePostDetailHook } from "@/components/core/post-detail/post-detail-context";
import { PostDetailHeader } from "@/components/core/post-detail/post-detail-header";
import { useParams } from "next/navigation";
import SpinnerLoader from "@/components/core/loader/spinner-loader";

export default function PostDetailPage() {
    const params = useParams();
    const postId = Number(params.id);
    const contextValue = usePostDetailHook(postId);

    return (
        <PostDetailContext.Provider value={contextValue}>
            <div className="container mx-auto py-10">
                {contextValue.isFetching ? (
                    <div className="flex h-[50vh] w-full items-center justify-center">
                        <SpinnerLoader message="Fetching post details..." />
                    </div>
                ) : (
                    <>
                        <PostDetailHeader />
                        <PostDetailBody />
                    </>
                )}
            </div>
        </PostDetailContext.Provider>
    )
}