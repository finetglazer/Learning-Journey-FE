"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import dayjs from "dayjs";
import { Bookmark, Briefcase, CheckCircle2, Eye } from "lucide-react";
import { useContext, useState } from "react";
import { PostDetailContext, PostDetailContextProps } from "./post-detail-context";
import { SelectFolderModal } from "./select-folder-modal";
import { AuthorHoverInfo } from "./author-hover-info";
import { AppContext } from "@/hooks/app-context";
import { toast } from "sonner";
import { cn, toDayJs } from "@/lib/utils";

export const PostDetailHeader = () => {
    const { postDetailData, setPostDetailData } = useContext<PostDetailContextProps>(PostDetailContext);
    const { postRepository, userId } = useContext(AppContext);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

    if (!postDetailData) return null;

    const handleToggleSaveStatusToProject = (item: any) => {
        if (!postRepository || !userId) {
            return;
        }
        const sub = postRepository?.updateSaveStatus(
            userId,
            postDetailData?.postId,
            {
                target: "PROJECT",
                projectId: item.id,
                wannaSave: (postDetailData?.savedToProjectIds || []).includes(item.id) ? false : true,
            }
        ).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    setPostDetailData({
                        ...postDetailData,
                        savedToProjectIds: (postDetailData?.savedToProjectIds || []).includes(item.id) ? (postDetailData?.savedToProjectIds || []).filter(id => id !== item.id) : [...(postDetailData?.savedToProjectIds || []), item.id]
                    });
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { }
        });

        return () => {
            sub.unsubscribe();
        };
    };

    const handleTogglePrivateSaveStatus = () => {
        if (!postRepository || !userId) return;

        const isCurrentlySaved = postDetailData.isSaved;

        postRepository.updateSaveStatus(userId, postDetailData.postId, {
            target: "PRIVATE",
            wannaSave: !isCurrentlySaved
        }).subscribe({
            next: (res) => {
                if (res?.status) {
                    toast.success(res?.msg || (isCurrentlySaved ? "Unsaved privately" : "Saved privately"));
                    setPostDetailData({
                        ...postDetailData,
                        isSaved: !isCurrentlySaved
                    });
                } else {
                    toast.error(res?.msg || "Failed to update save status");
                }
            },
            error: (err) => {
                console.error(err);
                const message = err?.response?.data?.msg || err?.response?.data?.message || "Failed to update save status";
                toast.error(message);
            }
        });
    };

    return (
        <>
            <div className="flex w-full justify-between items-start gap-4">
                <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                        <Avatar className="h-14 w-14 cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all">
                            <AvatarImage src={postDetailData.authorAvatar} alt={postDetailData.authorName} />
                            <AvatarFallback>{postDetailData.authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <AuthorHoverInfo
                            author={{
                                userId: postDetailData.authorId,
                                name: postDetailData.authorName,
                                avatar: postDetailData.authorAvatar,
                                email: postDetailData.authorEmail
                            } as any}
                            currentUserId={userId}
                            className="text-sm text-muted-foreground font-medium max-w-[80px] truncate text-center"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 pt-0.5">
                        <h1 className="text-3xl font-bold leading-tight text-foreground">
                            {postDetailData.title}
                        </h1>

                        <div className="flex items-center gap-3 text-base text-muted-foreground">
                            <span>Created at {toDayJs(postDetailData.createdAt, 0).format("HH:mm")}</span>
                            <div className="flex items-center gap-1">
                                <Eye className="h-5 w-5" />
                                <span>{postDetailData.stats.viewCount}</span>
                            </div>
                            {postDetailData.stats.isSolved && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-100" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-lg">Has exact solution</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        disabled={!userId}
                        onClick={handleTogglePrivateSaveStatus}
                        className={cn("text-muted-foreground cursor-pointer hover:text-foreground h-14 w-14 p-0", postDetailData.isSaved && "text-blue-500")}
                    >
                        <Bookmark className={cn("size-6", postDetailData.isSaved && "fill-current")} />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="text-muted-foreground cursor-pointer hover:text-foreground h-14 w-14 p-0">
                                <Briefcase className="size-6" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => setIsFolderModalOpen(true)} className="text-md cursor-pointer">
                                Save to your project
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleTogglePrivateSaveStatus} className="text-md cursor-pointer">
                                {postDetailData.isSaved ? "Unsave privately" : "Save privately"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <SelectFolderModal
                open={isFolderModalOpen}
                onOpenChange={setIsFolderModalOpen}
                onSelect={handleToggleSaveStatusToProject}
                savedProjectIds={postDetailData.savedToProjectIds}
            />
        </>
    );
};