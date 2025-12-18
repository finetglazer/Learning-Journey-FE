"use client";

import { Button } from "@/components/ui/button";
import { FileCode, MoreHorizontal, Check, CheckCircle2 } from "lucide-react";
import { useContext, useState } from "react";
import { PostDetailContext, PostDetailContextProps } from "./post-detail-context";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SelectFolderModal } from "./select-folder-modal";

export const PostDetailQuestion = () => {
    const { postDetailData } = useContext<PostDetailContextProps>(PostDetailContext);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!postDetailData) return null;

    return (
        <div className="flex flex-col gap-6 py-6">
            <div className="text-xl leading-relaxed text-foreground whitespace-pre-wrap">
                {postDetailData.content}
            </div>

            {postDetailData.attachments && postDetailData.attachments.length > 0 && (
                <div className="flex flex-col gap-3">
                    {postDetailData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-4 group">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <FileCode className="size-8" />
                                <span className="text-lg font-medium text-foreground">{file.name}</span>
                            </div>

                            {file.isAdded ? (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="p-2 bg-green-100 rounded-full">
                                                <Check className="size-5 text-green-600" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Added to your project</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <Button
                                    variant="secondary"
                                    className="h-10 text-sm font-medium bg-secondary/50 hover:bg-secondary transition-colors"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Add to your project
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
                {postDetailData.tags.slice(0, 3).map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center px-4 py-1.5 rounded-md text-base font-medium bg-emerald-100/80 text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                        #{tag}
                    </span>
                ))}

                {postDetailData.tags.length > 3 && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="p-2 hover:bg-muted rounded-full cursor-pointer transition-colors">
                                    <MoreHorizontal className="size-6 text-muted-foreground" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="flex flex-col gap-1">
                                    {postDetailData.tags.slice(3).map((tag, index) => (
                                        <span key={index} className="text-sm font-medium">#{tag}</span>
                                    ))}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>

            <SelectFolderModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                projectsOnly={true}
                onSelect={(project) => console.log("Added file(s) to project:", project)}
            />
        </div>
    );
};
