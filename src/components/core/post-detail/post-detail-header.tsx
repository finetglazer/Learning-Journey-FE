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

export const PostDetailHeader = () => {
    const { postDetailData } = useContext<PostDetailContextProps>(PostDetailContext);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

    if (!postDetailData) return null;

    return (
        <>
            <div className="flex w-full justify-between items-start gap-4">
                <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                        <Avatar className="h-14 w-14 cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all">
                            <AvatarImage src={postDetailData.authorAvatar} alt={postDetailData.authorName} />
                            <AvatarFallback>{postDetailData.authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground font-medium max-w-[80px] truncate text-center" title={postDetailData.authorName}>
                            {postDetailData.authorName}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-0.5">
                        <h1 className="text-3xl font-bold leading-tight text-foreground">
                            {postDetailData.title}
                        </h1>

                        <div className="flex items-center gap-3 text-base text-muted-foreground">
                            <span>Created at {dayjs(postDetailData.createdAt).format("HH:mm")}</span>
                            <div className="flex items-center gap-1">
                                <Eye className="h-5 w-5" />
                                <span>{postDetailData.viewCount}</span>
                            </div>
                            {postDetailData.isSolved && (
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
                    <Button variant="ghost" className="text-muted-foreground cursor-pointer hover:text-foreground h-14 w-14 p-0">
                        <Bookmark className="size-6" />
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
                            <DropdownMenuItem className="text-md cursor-pointer">
                                Save privately
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <SelectFolderModal
                open={isFolderModalOpen}
                onOpenChange={setIsFolderModalOpen}
                onSelect={(item) => console.log('Selected:', item)}
            />
        </>
    );
};