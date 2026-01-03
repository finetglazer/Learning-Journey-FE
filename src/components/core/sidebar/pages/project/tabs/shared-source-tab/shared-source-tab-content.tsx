"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SpinnerLoader from "@/components/core/loader/spinner-loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FILE_EXTENSION } from "@/const/consts";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { cn, uuid4 } from "@/lib/utils";
import { debounce, isEqual } from "lodash";
import { ChevronDown, FileIcon, Folder, Plus, Search, Upload } from "lucide-react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { TeamProjectContext, TeamProjectContextProps } from "../../team-project-context";
import { FileExplorerTable } from "./components/file-explorer-table";
import { SharedSourceContext, SharedSourceContextProps } from "./shared-source-context";
import { FileNode } from "@/model/project-management";

import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";

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
        onAddDocument,
        editingFile,
        isLoading,
        setIsLoading,
        currentFolderId,
        setCurrentFolderId,
        currentPath,
        setCurrentPath,
        onUploadFile,
        setFiles,
        onMoveFile,
        files,
        selectedNodeId,
        setAlertMessage,
        onConfirmDeleteFile,
    } = useContext<SharedSourceContextProps>(SharedSourceContext);

    // Configure sensors to differentiate between click and drag
    // Require a movement of 8 pixels before a drag starts
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete') {
                if (editingFile) return;

                // Check if focused element is an input (like search)
                const activeTag = document.activeElement?.tagName.toLowerCase();
                if (activeTag === 'input' || activeTag === 'textarea') return;

                if (selectedNodeId) {
                    const node = files.find(f => f.nodeId === selectedNodeId);
                    // Check if node exists and is not a SHARED_FOLDER (Shared posts)
                    // Also excluding sticky nodes (nodeId < 0 usually, specifically -1 is sticky header often)
                    if (node && node.type !== 'SHARED_FOLDER' && !isEqual(node.nodeId, -1)) {
                        const isFolder = node.type === 'FOLDER';
                        setAlertMessage({
                            type: "warning",
                            title: "Delete " + (isFolder ? "folder" : "file"),
                            description: "Are you sure you want to delete this " + (isFolder ? "folder" : "file") + "?",
                            proceedAnyway: () => onConfirmDeleteFile(node.nodeId),
                            useCancel: true,
                        });
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNodeId, files, editingFile, setAlertMessage, onConfirmDeleteFile]);

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
                    } as any as FileNode]
                });

                onUploadFile(file, uplId, onUploadFileFinish);
            });
        }
        // Reset the input so the same file can be selected again
        e.target.value = '';
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            return;
        }

        const activeId = active.id;
        const overId = over.id;
        if (activeId !== overId) {
            onMoveFile(Number(activeId), Number(overId));
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        className={cn("bg-purple-600 hover:bg-purple-700 flex gap-2 items-center text-white cursor-pointer shadow-md",
                                            !!editingFile && "opacity-50 cursor-not-allowed"
                                        )}
                                        disabled={!!editingFile}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        <span>New</span>
                                        <ChevronDown className="h-4 w-4 ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[160px]">
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => onAddFolder()}
                                    >
                                        <Folder className="h-4 w-4 mr-2" />
                                        Folder
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => onAddDocument()}
                                    >
                                        <FileIcon className="h-4 w-4 mr-2" />
                                        Document Note
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
        </DndContext>
    )
}