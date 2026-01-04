import { PostItem } from "@/components/core/post/post-item";
import { Button } from "@/components/ui/button";
import { PostFeedDTO } from "@/model/project-management";
import { ChevronLeft } from "lucide-react";
import { useContext } from "react";
import { SharedSourceContext, SharedSourceContextProps } from "../shared-source-context";
import { Post } from "@/model/post";
import { EmptyData } from "@/components/core/project-management/empty-data";

interface SharedPostListProps {
    posts: PostFeedDTO[];
}

export function SharedPostList({ posts }: SharedPostListProps) {
    const {
        setCurrentFolderId,
        setCurrentPath,
    } = useContext<SharedSourceContextProps>(SharedSourceContext);

    const handleGoBack = () => {
        setCurrentFolderId(null);
        setCurrentPath([]);
    }

    const mapToPost = (dto: PostFeedDTO): Post => {
        return {
            postId: dto.postId,
            userId: dto.userId,
            title: dto.title,
            preview: dto.preview,
            authorId: dto.authorId,
            authorName: dto.authorName,
            authorAvatar: dto.authorAvatar,
            authorEmail: "", // Not provided in DTO
            tags: dto.tags,
            stats: {
                score: dto.score,
                viewCount: Number(dto.viewCount),
                answerCount: dto.answerCount,
                isSolved: dto.isSolved,
            },
            createdAt: dto.createdAt,
            status: dto.status,
            // Defaults as these are detail fields not needed for list item
            content: {},
            files: [],
            answers: [],
            comments: [],
        };
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header / Back Button */}
            <div className="flex items-center gap-2 mb-4 shrink-0">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGoBack}
                    className="text-blue-600 hover:bg-blue-50 cursor-pointer"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <span className="text-sm text-gray-500">
                    / Shared posts from the community
                </span>
            </div>

            {/* Post List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <EmptyData 
                            title="No shared posts found"
                            message="Start sharing your posts with the community"
                        />
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.postId} className="bg-white rounded-lg border border-gray-200">
                            <PostItem post={mapToPost(post)} showStats={false} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
