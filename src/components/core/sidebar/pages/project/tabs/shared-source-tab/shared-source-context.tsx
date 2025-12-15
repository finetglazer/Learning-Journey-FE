import { dayJsToISOString, toDayJs } from "@/lib/utils";
import { FileNode } from "@/model/project-management";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { TeamProjectContext, TeamProjectContextProps } from "../../team-project-context";

export interface SharedSourceContextProps {
    editingFile: FileNode | null;
    setEditingFile: (file: FileNode | null) => void;
    files: FileNode[];
    setFiles: (files: FileNode[]) => void;
    isAddingFolder: boolean;
    setIsAddingFolder: (isAddingFolder: boolean) => void;
    onAddFolder: () => void;
    onCancelAddFolder: () => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
};

export const SharedSourceContext = createContext<SharedSourceContextProps>({
    editingFile: null,
    setEditingFile: () => { },
    files: [],
    setFiles: () => { },
    isAddingFolder: false,
    setIsAddingFolder: () => { },
    onAddFolder: () => { },
    onCancelAddFolder: () => { },
    isLoading: false,
    setIsLoading: () => { },
});

export const useSharedSourceHook = (): SharedSourceContextProps => {
    const [editingFile, setEditingFile] = useState<FileNode | null>(null);
    const [files, setFiles] = useState<FileNode[]>([]);
    const [isAddingFolder, setIsAddingFolder] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        files: originalFiles,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const onAddFolder = useCallback(() => {
        const newFolder: FileNode = {
            nodeId: -99,
            name: "New Folder",
            type: 'FOLDER',
            sizeBytes: 0,
            createdAt: dayJsToISOString(toDayJs(undefined, 0)),
            updatedAt: dayJsToISOString(toDayJs(undefined, 0)),
            projectId: 0,
            parentNodeId: 0,
            extension: null,
            storageReference: null,
            createdByUserId: null
        };
        setFiles([newFolder, ...files]);
        setIsAddingFolder(true);
    }, []);

    const onCancelAddFolder = useCallback(() => {
        setIsAddingFolder(false);
        setEditingFile(null);
    }, []);

    useEffect(() => {
        setFiles(originalFiles);
        setIsLoading(false);
    }, [originalFiles]);

    return {
        editingFile,
        setEditingFile,
        files,
        setFiles,
        isAddingFolder,
        setIsAddingFolder,
        onAddFolder,
        onCancelAddFolder,
        isLoading,
        setIsLoading,
    }
};