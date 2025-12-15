"use client";

import SpinnerLoader from "@/components/core/loader/spinner-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileNode } from "@/model/project-management";
import { debounce } from "lodash";
import { Plus, Search } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { TeamProjectContext, TeamProjectContextProps } from "../../team-project-context";
import { FileExplorerTable } from "./components/file-explorer-table";
import { SharedSourceContext, useSharedSourceHook } from "./shared-source-context";
import { cn } from "@/lib/utils";


export function SharedSourceTab() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
    const [currentPath, setCurrentPath] = useState<FileNode[]>([]);
    const {
        getFiles,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const {
        onAddFolder,
        editingFile,
        isLoading,
        setIsLoading,
    } = useSharedSourceHook();

    const debouncedGetFiles = useMemo(() => {
        return debounce(() => getFiles(searchQuery, currentFolderId), 100);
    }, [getFiles, searchQuery, currentFolderId]);

    useEffect(() => {
        setIsLoading(true);
        debouncedGetFiles();

        return () => {
            debouncedGetFiles.cancel();
        };
    }, [searchQuery, debouncedGetFiles, currentFolderId]);

    return (
        <SharedSourceContext.Provider value={useSharedSourceHook()}>
            <div className="w-full h-full bg-slate-50 flex flex-col p-6 font-sans">
                {/* Header: Search and New File Button */}
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search file"
                            className="pl-10 bg-white shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {(!isLoading) && (
                        <Button
                            className={cn("bg-purple-600 hover:bg-purple-700 flex gap-2 items-center text-white cursor-pointer shadow-md",
                                !!editingFile && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={!!editingFile}
                            onClick={() => {
                                onAddFolder();
                            }}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            <span>New folder</span>
                        </Button>
                    )}
                </div>
                {(isLoading) && (
                    <div className="flex justify-center items-center w-full">
                        <SpinnerLoader
                            sizeClass="24"
                            message="Getting files & folders..."
                        />
                    </div>
                )}

                {(!isLoading) && (
                    <FileExplorerTable
                        currentFolderId={currentFolderId}
                        setCurrentFolderId={setCurrentFolderId}
                        setCurrentPath={setCurrentPath}
                        currentPath={currentPath}
                    />
                )}
            </div>
        </SharedSourceContext.Provider>
    );
};