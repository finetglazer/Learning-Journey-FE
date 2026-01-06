"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useContext, useEffect } from "react";
import { ChevronRight, Folder, Users, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppContext } from "@/hooks/app-context";
import { isNil } from "lodash";


interface SelectFolderModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect?: (folder: any) => void;
    projectsOnly?: boolean;
    invitedUserId?: number | string;
    savedProjectIds?: number[];
}

export const SelectFolderModal = ({ open, onOpenChange, onSelect, projectsOnly = false, invitedUserId, savedProjectIds = [] }: SelectFolderModalProps) => {
    // History stack keeps track of navigation. Empty array means root (projects list).
    const [history, setHistory] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { projectRepository } = useContext(AppContext);

    // Fetch projects when modal opens
    useEffect(() => {
        if (open && projectRepository) {
            setIsLoading(true);
            const finalize = () => setIsLoading(false);

            if (invitedUserId) {
                projectRepository.getInviteableProjects(invitedUserId).subscribe({
                    next: (res) => {
                        if (res?.data) {
                            setProjects(res?.data || []);
                        }
                        finalize();
                    },
                    error: (err) => {
                        console.error("Failed to fetch inviteable projects", err);
                        setProjects([]);
                        finalize();
                    }
                });
            } else {
                projectRepository.getProjects().subscribe({
                    next: (res) => {
                        if (res?.status) {
                            setProjects(res?.data?.projects || []);
                        }
                        finalize();
                    },
                    error: (err) => {
                        console.error("Failed to fetch projects", err);
                        setProjects([]);
                        finalize();
                    }
                });
            }
        }
    }, [open, projectRepository, invitedUserId]);

    // Current parent is the last item in history
    const currentParent = history.length > 0 ? history[history.length - 1] : null;

    // Determine items to display
    const items = useMemo(() => {
        if (!currentParent) {
            return projects;
        }
        return currentParent.folders || currentParent.children || [];
    }, [currentParent, projects]);

    const handleSingleClick = (item: any) => {
        setSelectedItem(item);
    };

    const handleDoubleClick = (item: any) => {
        if (projectsOnly) return;

        // Only navigate if it's a project (root level) or a folder with children/folders
        if (item.folders || (item.children && item.children.length >= 0)) {
            setHistory((prev) => [...prev, item]);
            setSelectedItem(null); // Clear selection when entering a new folder
        }
    };

    const handleDoubleProjectClick = (item: any) => {
        if (projectsOnly) return;

        // Only navigate if it's a project (root level) or a folder with children/folders
        if (item.folders || (item.children && item.children.length >= 0)) {
            setHistory((prev) => [...prev, item]);
            setSelectedItem(null); // Clear selection when entering a new folder
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        // Navigate back to a specific point in history
        setHistory((prev) => prev.slice(0, index + 1));
        setSelectedItem(null);
    };

    const handleRootBreadcrumbClick = () => {
        setHistory([]);
        setSelectedItem(null);
    };

    const handleSave = () => {
        if (onSelect && selectedItem) {
            onSelect(selectedItem);
        }
        onOpenChange(false);
    };

    const getIcon = (item: any) => {
        // If at root level, show user/group icon based on privacy, else show folder icon
        if (!currentParent) {
            // It's a project
            return <Users className="h-5 w-5 text-muted-foreground" />;
        }
        return <Folder className="h-5 w-5 text-muted-foreground" />;
    };

    const isSelected = (item: any) => {
        return (selectedItem?.id === item.id && !isNil(selectedItem?.id)) || (selectedItem?.projectId === item.projectId && !isNil(selectedItem?.projectId));
    };

    const isSaved = (item: any) => {
        const id = item.id || item.projectId;
        return savedProjectIds.includes(id);
    };

    const getButtonText = () => {
        if (projectsOnly && invitedUserId) return "Invite to this project";

        if (selectedItem && isSaved(selectedItem)) {
            return "Unsave from this project";
        }

        return projectsOnly ? "Save to this project" : "Save in this folder";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {(history.length === 0 || projectsOnly) ? "Your projects" : (
                            <div className="flex items-center flex-wrap gap-1 text-xl font-normal">
                                <span
                                    className="hover:underline cursor-pointer font-semibold text-foreground"
                                    onClick={handleRootBreadcrumbClick}
                                >
                                    Your projects
                                </span>
                                {history.map((item, index) => (
                                    <div key={item.id} className="flex items-center gap-1">
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        <span
                                            className={cn(
                                                "cursor-pointer hover:underline",
                                                index === history.length - 1 ? "font-semibold text-foreground" : ""
                                            )}
                                            onClick={() => handleBreadcrumbClick(index)}
                                        >
                                            {item.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="min-h-[300px] border rounded-md">
                    <div className="p-2 flex flex-col gap-1">
                        {isLoading ? (
                            <div className="flex items-center justify-center min-h-[200px]">
                                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                            </div>
                        ) : items.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-xl">
                                This folder is empty
                            </div>
                        ) : (
                            (items || []).map((item: any) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleSingleClick(item)}
                                    onDoubleClick={() => handleDoubleProjectClick(item)}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors select-none",
                                        isSelected(item) ? "bg-gray-200" : "hover:bg-accent/50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {getIcon(item)}
                                        <span className="text-xl font-medium">{item.name || item.projectName}</span>
                                    </div>
                                    {isSaved(item) && <Check className="h-5 w-5 text-green-500" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!selectedItem}
                        onClick={handleSave}
                        className={cn(
                            "cursor-pointer text-white",
                            selectedItem && isSaved(selectedItem)
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-emerald-500 hover:bg-emerald-600"
                        )}
                    >
                        {getButtonText()}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
