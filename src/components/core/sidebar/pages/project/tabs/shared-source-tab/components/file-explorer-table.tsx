"use client";

import { EmptyData } from "@/components/core/project-management/empty-data";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileNode } from "@/model/project-management";
import { isEqual } from "lodash";
import { ChevronLeft } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useContext, useMemo } from "react";
import { FileNodeRow } from "./file-node-row";
import { SharedSourceContext, SharedSourceContextProps } from "../shared-source-context";
import { AlertModal } from "@/components/core/alert-modal/alert-modal";

export interface FileExplorerTableProps {
    currentFolderId: number | null;
    setCurrentFolderId: Dispatch<SetStateAction<number | null>>;
    setCurrentPath: Dispatch<SetStateAction<FileNode[]>>;
    currentPath: FileNode[];
};

export const FileExplorerTable = ({
    currentFolderId,
    setCurrentFolderId,
    setCurrentPath,
    currentPath,
}: FileExplorerTableProps) => {
    const {
        files: allNodes,
        alertMessage,
        setAlertMessage,
        setSelectedNodeId,
    } = useContext<SharedSourceContextProps>(SharedSourceContext);

    const visibleNodes = useMemo(() => {
        return allNodes
            .filter(node => !currentFolderId || node.parentNodeId === currentFolderId)
            .sort((a, b) => {
                // Folders always come first
                if (a.nodeId < 0) return -1;
                if (b.nodeId < 0) return 1;
                if (a.type === 'SHARED_FOLDER') return -1;
                if (b.type === 'SHARED_FOLDER') return 1;
                if (a.type === 'FOLDER' && b.type !== 'FOLDER') return -1;
                if (a.type !== 'FOLDER' && b.type === 'FOLDER') return 1;
                // Then sort alphabetically
                return a.name.localeCompare(b.name);
            });
    }, [allNodes, currentFolderId]);

    const handleOpenFolder = useCallback((folder: FileNode) => {
        setCurrentFolderId(folder.nodeId);
        setSelectedNodeId(null);
        setCurrentPath(prev => [...prev, folder]);
    }, []);

    const handleGoBack = useCallback(() => {
        if (currentFolderId === null) return;

        // Find the parent ID of the current folder
        const currentFolder = currentPath.slice(-1)[0];
        if (currentFolder) {
            setCurrentFolderId(currentFolder.parentNodeId);
            // Remove the last folder from the path array
            setCurrentPath(prev => prev.slice(0, -1));
        } else {
            // Should theoretically not happen if logic is correct, but handles root fallback
            setCurrentFolderId(null);
            setCurrentPath([]);
        }
    }, [currentFolderId, currentPath]);

    return (
        <>
            {/* Navigation / Back Button */}
            < div className="flex items-center gap-2 mb-4" >
                {currentFolderId !== null && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleGoBack}
                        className="text-blue-600 hover:bg-blue-50 cursor-pointer"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                )}

                {/* Breadcrumb could go here */}
                {
                    currentFolderId !== null && (
                        <span className="text-sm text-gray-500">
                            / {currentPath.map(node => node.name).join(' / ')}
                        </span>
                    )
                }
            </div >

            {/* File List Table */}
            < div className="flex-1 overflow-auto rounded-lg border bg-white" >
                <Table>
                    <TableHeader className="sticky top-0 bg-gray-50 z-20">
                        <TableRow className="hover:bg-gray-50">
                            <TableHead className="w-1/2 pl-7">Name</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Date updated</TableHead>
                            <TableHead className="w-16 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visibleNodes.map(node => (
                            <FileNodeRow
                                key={node.nodeId}
                                node={node}
                                onOpenFolder={handleOpenFolder}
                                isSticky={isEqual(node.nodeId, -1)}
                            />
                        ))}

                        {visibleNodes.length === 0 && currentFolderId !== null && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-gray-500 h-20">
                                    <EmptyData
                                        title="This folder is empty"
                                        message="Add files to get started."
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div >

            {alertMessage && (
                <AlertModal
                    alertMessage={alertMessage}
                    onClose={() => setAlertMessage(null)}
                />
            )}
        </>
    );
};