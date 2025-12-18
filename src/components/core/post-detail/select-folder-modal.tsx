"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { projects } from "./index";
import { useState, useMemo } from "react";
import { ChevronRight, Folder, Users, Lock, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectFolderModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect?: (folder: any) => void;
    projectsOnly?: boolean;
}

export const SelectFolderModal = ({ open, onOpenChange, onSelect, projectsOnly = false }: SelectFolderModalProps) => {
    // History stack keeps track of navigation. Empty array means root (projects list).
    const [history, setHistory] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    // Current parent is the last item in history
    const currentParent = history.length > 0 ? history[history.length - 1] : null;

    // Determine items to display
    const items = useMemo(() => {
        if (!currentParent) {
            return projects;
        }
        return currentParent.folders || currentParent.children || [];
    }, [currentParent]);

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
            if (item.privacy === 'public') return <Users className="h-5 w-5 text-muted-foreground" />;
            if (item.privacy === 'private') return <Lock className="h-5 w-5 text-muted-foreground" />;
            return <Briefcase className="h-5 w-5 text-muted-foreground" />;
        }
        return <Folder className="h-5 w-5 text-muted-foreground" />;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {(history.length === 0 || projectsOnly) ? "Your projects" : (
                            <div className="flex items-center flex-wrap gap-1 text-base font-normal">
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
                        {items.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                This folder is empty
                            </div>
                        ) : (
                            items.map((item: any) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleSingleClick(item)}
                                    onDoubleClick={() => handleDoubleProjectClick(item)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors select-none",
                                        selectedItem?.id === item.id ? "bg-gray-200" : "hover:bg-accent/50"
                                    )}
                                >
                                    {getIcon(item)}
                                    <span className="text-sm font-medium">{item.name}</span>
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
                        className="bg-emerald-500 cursor-pointer hover:bg-emerald-600 text-white"
                    >
                        {projectsOnly ? "Save to this project" : "Save in this folder"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
