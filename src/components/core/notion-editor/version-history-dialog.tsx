"use client";

import { useState } from "react";
import { DocVersionDTO } from "@/model/document";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, RotateCcw, Clock, Save, UserCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface VersionHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    versions: DocVersionDTO[];
    isLoading?: boolean;
    onRestore: (versionId: number) => void;
    isRestoring?: boolean;
}

const reasonLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    AUTO_30MIN: {
        label: "Auto-save (30 min)",
        icon: <Clock className="h-3 w-3" />,
    },
    SESSION_END: {
        label: "Session ended",
        icon: <Save className="h-3 w-3" />,
    },
    RESTORED: {
        label: "Restored version",
        icon: <RotateCcw className="h-3 w-3" />,
    },
    BEFORE_RESTORE: {
        label: "Before restore",
        icon: <History className="h-3 w-3" />,
    },
};

export function VersionHistoryDialog({
                                         open,
                                         onOpenChange,
                                         versions,
                                         isLoading,
                                         onRestore,
                                         isRestoring,
                                     }: VersionHistoryDialogProps) {
    const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

    const handleRestore = () => {
        if (selectedVersion !== null) {
            onRestore(selectedVersion);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Version History
                    </DialogTitle>
                    <DialogDescription>
                        View and restore previous versions of this document. Restoring will
                        create a backup of the current version first.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
                    </div>
                ) : versions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No version history available yet.</p>
                        <p className="text-sm mt-1">
                            Versions are created automatically every 30 minutes.
                        </p>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-2">
                                {versions.map((version, index) => {
                                    const reasonInfo = reasonLabels[version.reason] || {
                                        label: version.reason,
                                        icon: <Clock className="h-3 w-3" />,
                                    };

                                    return (
                                        <div
                                            key={version.versionId}
                                            onClick={() => setSelectedVersion(version.versionId)}
                                            className={cn(
                                                "p-3 rounded-lg border cursor-pointer transition-colors",
                                                selectedVersion === version.versionId
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            )}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={version.createdByAvatar} />
                                                        <AvatarFallback>
                                                            {version.createdByName?.charAt(0) || (
                                                                <UserCircle className="h-4 w-4" />
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                              <span className="font-medium">
                                Version {version.versionNumber}
                              </span>
                                                            {index === 0 && (
                                                                <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                  Latest
                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            {version.createdByName || "Unknown user"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        {reasonInfo.icon}
                                                        {reasonInfo.label}
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {format(
                                                            new Date(version.createdAt),
                                                            "MMM d, yyyy h:mm a"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRestore}
                                disabled={selectedVersion === null || isRestoring}
                            >
                                {isRestoring ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Restoring...
                                    </>
                                ) : (
                                    <>
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Restore Selected
                                    </>
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}