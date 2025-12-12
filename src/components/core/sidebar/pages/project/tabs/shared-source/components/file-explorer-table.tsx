"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileNode } from "@/model/project-management";
import { ChevronLeft, Folder, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { FileNodeRow } from "./file-node-row";
import { isEqual } from "lodash";

export interface FileExplorerTableProps {
    allNodes: FileNode[];
};

export const FileExplorerTable = ({
    allNodes,
}: FileExplorerTableProps) => {
    const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
    const [currentPath, setCurrentPath] = useState<FileNode[]>([]);

    const visibleNodes = useMemo(() => {
        return allNodes
            .filter(node => node.parentNodeId === currentFolderId)
            .sort((a, b) => {
                // Folders always come first
                if (a.type === 'FOLDER' && b.type !== 'FOLDER') return -1;
                if (a.type !== 'FOLDER' && b.type === 'FOLDER') return 1;
                // Then sort alphabetically
                return a.name.localeCompare(b.name);
            });
    }, [allNodes, currentFolderId]);

    const handleOpenFolder = useCallback((folder: FileNode) => {
        setCurrentFolderId(folder.nodeId);
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

    const handleDeleteNode = useCallback((nodeId: number) => {
        console.log(`Deleting node ID: ${nodeId}`);
        // Logic to show confirmation modal and call API...
    }, []);
    return (
        <>
            {/* Navigation / Back Button */}
            < div className="flex items-center gap-2 mb-4" >
                {currentFolderId !== null && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleGoBack}
                        className="text-blue-600 hover:bg-blue-50"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                )
                }
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
                                onDelete={handleDeleteNode}
                                isSticky={isEqual(node.nodeId, -1)}
                            />
                        ))}

                        {visibleNodes.length === 0 && currentFolderId !== null && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-gray-500 h-20">
                                    This folder is empty.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div >
        </>
    );
};