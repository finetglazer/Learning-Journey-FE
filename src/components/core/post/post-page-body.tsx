"use client";

import { useContext } from "react";
import { PostPageBodySkeleton } from "./post-page-body-skeleton";
import { PostPageContext, PostPageContextInterface } from "./post-page-context";
import { PostItem } from "./post-item";
import { EmptyData } from "../project-management/empty-data";
import { CreatePostModal } from "./create-post-modal";

export const PostPageBody = () => {
    const { 
        posts, 
        isFetching,
        isCreateNewPost,
        setIsCreateNewPost,
    } = useContext<PostPageContextInterface>(PostPageContext);

    return (
        <>
            {isFetching && (
                <PostPageBodySkeleton />
            )}

            {(!isFetching && posts.length === 0) && (
                <EmptyData
                    title="No posts found"
                    message="You haven't added any posts yet. Add one to get started."
                />
            )}

            {(!isFetching && posts.length > 0) && (
                <div className="flex flex-col gap-2 mt-8">
                    {posts.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
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