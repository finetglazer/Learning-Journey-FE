"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { PostAuthor } from "@/model/post";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { SelectFolderModal } from "./select-folder-modal";
import { cn } from "@/lib/utils";
import { AppContext } from "@/hooks/app-context";

interface AuthorHoverInfoProps {
    author: PostAuthor;
    currentUserId: number | null;
    className?: string;
}

export const AuthorHoverInfo = ({ author, currentUserId, className }: AuthorHoverInfoProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { projectRepository } = useContext(AppContext);

    const handleInvite = (project: any) => {
        if (!projectRepository) return;

        // Ensure we have an email
        if (!author.email) {
            toast.error("User email is missing, cannot invite.");
            return;
        }

        projectRepository.addMemberToProject({
            projectId: project.id || project.projectId
        }, {
            email: author.email
        }).subscribe({
            next: (res) => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg || `Invited ${author.name} to ${project.name || project.projectName}`);
                    setIsModalOpen(false);
                } else {
                    toast.error(res?.message || res?.msg || "Failed to invite user");
                }
            },
            error: (err) => {
                console.error(err);
                const message = err?.response?.data?.msg || err?.response?.data?.message || "Failed to invite user";
                toast.error(message);
            }
        });
    };

    return (
        <>
            <HoverCard>
                <HoverCardTrigger asChild>
                    <span
                        className={cn("font-medium text-blue-500 cursor-pointer hover:underline", className)}
                    >
                        {author.name}
                    </span>
                </HoverCardTrigger>
                <HoverCardContent className="w-[450px] p-0 overflow-hidden border-none shadow-lg rounded-2xl">
                    <div className="bg-gray-100 p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-gray-200">
                                <AvatarImage src={author.avatar} />
                                <AvatarFallback>{author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900 leading-tight">{author.name}</span>
                                <span className="text-xs text-gray-500">{author.email || "Email not available"}</span>
                            </div>
                        </div>

                        {(currentUserId !== null && currentUserId !== author.userId) && (
                            <Button
                                size="sm"
                                className="bg-[#6EF8CD] hover:bg-[#5deebd] cursor-pointer text-gray-800 font-medium rounded-full px-6 h-9 transition-colors border-none shadow-none"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Invite to your project
                            </Button>
                        )}
                    </div>
                </HoverCardContent>
            </HoverCard>

            <SelectFolderModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                projectsOnly={true}
                invitedUserId={author.userId}
                onSelect={handleInvite}
            />
        </>
    );
};
