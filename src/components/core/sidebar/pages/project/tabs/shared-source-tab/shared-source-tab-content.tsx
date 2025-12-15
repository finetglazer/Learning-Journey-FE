"use client";

import SpinnerLoader from "@/components/core/loader/spinner-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FILE_EXTENSION } from "@/const/consts";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { cn, uuid4 } from "@/lib/utils";
import { debounce, isEqual } from "lodash";
import { Plus, Search, Upload } from "lucide-react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { TeamProjectContext, TeamProjectContextProps } from "../../team-project-context";
import { FileExplorerTable } from "./components/file-explorer-table";
import { SharedSourceContext, SharedSourceContextProps } from "./shared-source-context";
import { FileNode } from "@/model/project-management";

export const SharedSourceTabContent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingFilesStatus, setUploadingFilesStatus] = useState<{
        uploadingId: string,
        state: 'uploading' | 'success' | 'error'
    }[]>([]);

    const {
        getFiles,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const {
        userId,
        projectRepository,
    } = useContext<AppContextProps>(AppContext);

    const {
        onAddFolder,
        editingFile,
        isLoading,
        setIsLoading,
        currentFolderId,
        setCurrentFolderId,
        currentPath,
        setCurrentPath,
        onUploadFile,
        setFiles,
    } = useContext<SharedSourceContextProps>(SharedSourceContext);

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

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const onUploadFileFinish = (uploadingId: string, state: 'success' | 'error', savedFile?: FileNode) => {
        setUploadingFilesStatus((prev) => {
            return prev.map(item => {
                if (item.uploadingId === uploadingId) {
                    return {
                        ...item,
                        state: state
                    };
                }
                return item;
            });
        });

        if (isEqual(state, 'error')) {
            setFiles((prev) => {
                return prev.filter(item => !isEqual(item.uploadingId, uploadingId))
            })
            return;
        }
        setFiles((prev: FileNode[]) => {
            return prev.map(item => {
                if (isEqual(item.uploadingId, uploadingId)) {
                    return {
                        ...savedFile as FileNode,
                        uploadingId: undefined,
                    }
                }
                return item;
            });
        });
    };

    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!projectRepository) {
            return;
        }
        if (files.length > 0) {
            files.forEach((file: File, i: number) => {
                const uplId = uuid4();
                setUploadingFilesStatus((prev) => {
                    return [...prev, {
                        uploadingId: uplId,
                        state: 'uploading'
                    }]
                });
                setFiles((prev: FileNode[]) => {
                    return [...prev, {
                        nodeId: -100 - i,
                        parentNodeId: currentFolderId,
                        name: file.name,
                        sizeBytes: file.size,
                        extension: file.name.split('.').pop(),
                        type: 'STATIC_FILE',
                        createdByUserId: userId,
                        uploadingId: uplId,
                    } as FileNode]
                });

                onUploadFile(file, uplId, onUploadFileFinish);
            });
        }
        // Reset the input so the same file can be selected again
        e.target.value = '';
    };

    return (
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
                <div className="flex items-center gap-2">
                    {(!isLoading) && (
                        <Button
                            className={cn("bg-teal-500 hover:bg-teal-600 flex gap-2 items-center text-white cursor-pointer shadow-md",
                                !!editingFile && "opacity-50 cursor-not-allowed"
                            )}
                            disabled={!!editingFile}
                            onClick={handleUploadClick}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            <span>Upload file</span>
                        </Button>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFilesChange}
                        className="hidden"
                        multiple
                        max={5}
                        accept={FILE_EXTENSION.map(ext => `.${ext}`).join(",")}
                    />
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
    )
}