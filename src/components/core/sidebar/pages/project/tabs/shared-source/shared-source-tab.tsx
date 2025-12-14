"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileNode } from "@/model/project-management";
import { Plus, Search } from "lucide-react";
import { FileExplorerTable } from "./components/file-explorer-table";
import { useContext, useEffect, useMemo, useState } from "react";
import { TeamProjectContext, TeamProjectContextProps } from "../../team-project-context";
import { debounce } from "lodash";

const MOCK_ALL_NODES: FileNode[] = [
    {
        nodeId: -1,
        projectId: 1,
        parentNodeId: null,
        name: "Shared posts from the community",
        type: 'FOLDER',
        extension: null,
        sizeBytes: null,
        storageReference: null,
        createdByUserId: -1,
        createdAt: '2025-12-01T00:00:00Z',
        updatedAt: '2025-12-01T00:00:00Z',
    },
    { nodeId: 100, projectId: 1, parentNodeId: null, name: "Stakeholder management", type: 'FOLDER', extension: null, sizeBytes: null, storageReference: null, createdByUserId: 1, createdAt: '2025-12-11T00:00:00Z', updatedAt: '2025-12-11T00:00:00Z' },
    { nodeId: 101, projectId: 1, parentNodeId: null, name: "Nuclear theory", type: 'STATIC_FILE', extension: 'PDF', sizeBytes: 524288, storageReference: '...', createdByUserId: 1, createdAt: '2025-12-11T00:00:00Z', updatedAt: '2025-12-11T00:00:00Z' },
    { nodeId: 201, projectId: 1, parentNodeId: 100, name: "Q4 Roadmap", type: 'STATIC_FILE', extension: 'DOC', sizeBytes: 10240, storageReference: '...', createdByUserId: 1, createdAt: '2025-12-11T00:00:00Z', updatedAt: '2025-12-11T00:00:00Z' },
];

interface FileExplorerTableProps {
    // allNodes: FileNode[];
};

export function SharedSourceTab({ }: FileExplorerTableProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [files, setFiles] = useState<FileNode[]>([]);
    const {
        getFiles,
        files: originalFiles,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);


    const debouncedGetFiles = useMemo(() => {
        return debounce(() => getFiles(searchQuery), 100);
    }, [getFiles, searchQuery]);

    useEffect(() => {
        debouncedGetFiles();

        return () => {
            debouncedGetFiles.cancel();
        };
    }, [searchQuery, debouncedGetFiles]);

    useEffect(() => {
        setFiles(originalFiles);
    }, [originalFiles]);

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
                <Button className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-md">
                    <Plus className="mr-2 h-4 w-4" /> New file
                </Button>
            </div>

            <FileExplorerTable
                allNodes={files}
            />
        </div>
    );
};