"use client";

import { useContext } from "react";
import { PostPageBodySkeleton } from "./post-page-body-skeleton";
import { PostPageContext, PostPageContextInterface } from "./post-page-context";
import { PostItem } from "./post-item";
import { EmptyData } from "../project-management/empty-data";
import { CreatePostModal } from "./create-post-modal";
import { Button } from "@/components/ui/button";
import SpinnerLoader from "../loader/spinner-loader";

export const PostPageBody = () => {
    const {
        posts,
        isFetching,
        isCreateNewPost,
        setIsCreateNewPost,
        page,
        showMore,
        showLess,
        hasMore,
    } = useContext<PostPageContextInterface>(PostPageContext);

    return (
        <>
            {(isFetching && posts.length === 0) && (
                <PostPageBodySkeleton />
            )}

            {(!isFetching && posts.length === 0) && (
                <EmptyData
                    title="No posts found"
                    message="You haven't added any posts yet. Add one to get started."
                />
            )}

            {(posts.length > 0) && (
                <div className="flex flex-col gap-2 mt-8">
                    {posts.map((post) => (
                        <PostItem key={post.postId} post={post} />
                    ))}

                    {isFetching ? (
                        <div className="flex justify-center mt-6 mb-8">
                            <SpinnerLoader message="Fetching posts..." />
                        </div>
                    ) : (
                        <div className="flex justify-center gap-4 mt-6 mb-8">
                            {hasMore && (
                                <Button className="cursor-pointer" variant="outline" onClick={showMore}>
                                    Show More
                                </Button>
                            )}
                            {page > 1 && (
                                <Button className="cursor-pointer" variant="ghost" onClick={showLess}>
                                    Show Less
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {(isCreateNewPost) && (
                <CreatePostModal
                    open={isCreateNewPost}
                    onClose={() => setIsCreateNewPost(false)}
                />
            )}
        </>
    );
}