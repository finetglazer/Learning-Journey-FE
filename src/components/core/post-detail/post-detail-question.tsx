"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, FileCode, MoreHorizontal } from "lucide-react";
import { useContext, useState } from "react";
import { PostDetailContext, PostDetailContextProps } from "./post-detail-context";
import { SelectFolderModal } from "./select-folder-modal";
import { RichTextRenderer } from "../rich-text/rich-text-renderer";
import { FilePreviewModal } from "../file-preview/file-preview-modal";
import { FILE_PREVIEWABLE } from "@/const/consts";

export const PostDetailQuestion = () => {
    const { postDetailData } = useContext<PostDetailContextProps>(PostDetailContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<{ url: string; name: string; extension: string } | null>(null);

    const handleFileClick = (file: { name: string; url: string }) => {
        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        if (FILE_PREVIEWABLE.includes(extension)) {
            setPreviewFile({
                url: file.url,
                name: file.name,
                extension: extension
            });
        } else {
            window.open(file.url, '_blank');
        }
    };

    if (!postDetailData) return null;

    return (
        <div className="flex flex-col gap-6 py-6">
            <div className="text-xl leading-relaxed text-foreground whitespace-pre-wrap">
                <RichTextRenderer content={postDetailData.content} />
            </div>

            {postDetailData.files && postDetailData.files.length > 0 && (
                <div className="flex flex-col gap-3">
                    {postDetailData.files.map((file, index) => (
                        <div key={index} className="flex cursor-pointer items-center gap-4 group">
                            <div
                                className="flex items-center gap-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                                onClick={() => handleFileClick(file)}
                            >
                                <FileCode className="size-8" />
                                <span className="text-lg font-medium text-foreground max-w-[200px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[500px] truncate" title={file.name}>
                                    {file.name}
                                </span>
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
                                    className="h-10 text-sm cursor-pointer font-medium bg-secondary/50 hover:bg-secondary transition-colors"
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
                        {tag}
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
                                        <span key={index} className="text-sm font-medium">{tag}</span>
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

            {previewFile && (
                <FilePreviewModal
                    isOpen={!!previewFile}
                    onClose={() => setPreviewFile(null)}
                    fileUrl={previewFile.url}
                    fileName={previewFile.name}
                    fileExtension={previewFile.extension}
                />
            )}
        </div>
    );
};
