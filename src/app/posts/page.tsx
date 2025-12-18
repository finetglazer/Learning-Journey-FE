"use client";
import { PostPageBody } from "@/components/core/post/post-page-body";
import { PostPageHeader } from "@/components/core/post/post-page-header";
import { PostPageContext, usePostPageHooks } from "@/components/core/post/post-page-context";

export default function PostsPage() {
    return (
        <PostPageContext.Provider value={usePostPageHooks()}>
            <div className="container mx-auto py-10">
                <PostPageHeader />
                <PostPageBody />
            </div>
        </PostPageContext.Provider>
    );
}
