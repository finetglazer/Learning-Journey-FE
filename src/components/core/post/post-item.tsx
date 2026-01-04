import { Post } from "@/model/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, toDayJs } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

interface PostItemProps {
    post: Post;
    showStats?: boolean;
}

export function PostItem({ post, showStats = true }: PostItemProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
            {/* Left Column: Stats */}
            {showStats && (
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1 w-full sm:w-28 shrink-0 text-xs sm:text-sm text-muted-foreground">
                    <div className="whitespace-nowrap">
                        <span className="font-medium text-foreground">{post.score}</span> votes
                    </div>
                    <div
                        className={cn(
                            "whitespace-nowrap px-2 py-0.5 rounded border",
                            post.answerCount > 0 && "border-transparent",
                            post.isSolved && "border-green-500 text-green-600 bg-green-50/50",
                        )}
                    >
                        <span className="font-medium">{post.answerCount}</span> answers
                    </div>
                    <div className="whitespace-nowrap">
                        <span className="font-medium text-foreground">{post.viewCount}</span> views
                    </div>
                </div>
            )}

            {/* Right Column: Main Content */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
                {/* Title */}
                <h3 className="text-lg font-normal text-blue-600 hover:text-blue-800 cursor-pointer line-clamp-2 leading-tight"
                    onClick={() => router.push(`/posts/${post.postId}`)}
                >
                    {post.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                    {post.preview}
                </p>

                {/* Bottom Row: Tags and User Info */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-auto">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded shadow-sm whitespace-nowrap"
                            >
                                {tag}
                            </span>
                        ))}
                        {post.tags.length > 3 && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="px-2 py-1 bg-teal-100/50 text-teal-800 text-xs rounded shadow-sm whitespace-nowrap flex items-center justify-center cursor-pointer hover:bg-teal-100 transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="flex flex-col gap-1">
                                        {post.tags.slice(3).map((tag) => (
                                            <span key={tag} className="text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0 ml-auto sm:ml-0">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={post.authorAvatar} alt={post.authorName} />
                            <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-blue-500 hover:underline cursor-pointer">
                            {post.authorName}
                        </span>
                        <span>created {toDayJs(post.createdAt, 0).fromNow()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
