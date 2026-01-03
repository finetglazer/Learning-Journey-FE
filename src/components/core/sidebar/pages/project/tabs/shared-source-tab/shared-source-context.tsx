import { dayJsToISOString, toDayJs } from "@/lib/utils";
import { FileNode } from "@/model/project-management";
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { TeamProjectContext, TeamProjectContextProps } from "../../team-project-context";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { toast } from "sonner";
import { AlertMessage } from "@/components/core/alert-modal/alert-modal";
import { finalize } from "rxjs";

export interface SharedSourceContextProps {
    editingFile: FileNode | null;
    setEditingFile: (file: FileNode | null) => void;
    files: FileNode[];
    setFiles: Dispatch<SetStateAction<FileNode[]>>;
    isAddingFolder: boolean;
    isAddingDocument: boolean;
    setIsAddingFolder: (isAddingFolder: boolean) => void;
    setIsAddingDocument: (isAddingDocument: boolean) => void;
    onAddFolder: () => void;
    onAddDocument: () => void;
    onConfirmAddDocument: (name: string) => void;
    onCancelAddOrEdit: () => void;
    onConfirmAddFolder: (folderName: string) => void;
    onConfirmEditFileName: (fileName: string) => void;
    onConfirmDeleteFile: (selectedNodeId: number) => void;
    onUploadFile: (file: File, uploadingId: string, onFinish?: (uploadingId: string, state: 'success' | 'error', savedFile?: FileNode) => void) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    alertMessage: AlertMessage | null;
    setAlertMessage: Dispatch<SetStateAction<AlertMessage | null>>;
    currentFolderId: number | null;
    setCurrentFolderId: Dispatch<SetStateAction<number | null>>;
    currentPath: FileNode[];
    setCurrentPath: Dispatch<SetStateAction<FileNode[]>>;
    onMoveFile: (nodeId: number, targetFolderId: number) => void;
    selectedNodeId: number | null;
    setSelectedNodeId: Dispatch<SetStateAction<number | null>>;
};

export const SharedSourceContext = createContext<SharedSourceContextProps>({
    editingFile: null,
    setEditingFile: () => { },
    files: [],
    setFiles: () => { },
    isAddingFolder: false,
    isAddingDocument: false,
    setIsAddingFolder: () => { },
    setIsAddingDocument: () => { },
    onAddFolder: () => { },
    onAddDocument: () => { },
    onConfirmAddDocument: () => { },
    onCancelAddOrEdit: () => { },
    onConfirmAddFolder: () => { },
    onUploadFile: () => { },
    isLoading: false,
    setIsLoading: () => { },
    alertMessage: null,
    setAlertMessage: () => { },
    onConfirmEditFileName: () => { },
    onConfirmDeleteFile: () => { },
    currentFolderId: null,
    setCurrentFolderId: () => { },
    currentPath: [],
    setCurrentPath: () => { },
    onMoveFile: () => { },
    selectedNodeId: null,
    setSelectedNodeId: () => { },
});

export const useSharedSourceHook = (): SharedSourceContextProps => {
    const [editingFile, setEditingFile] = useState<FileNode | null>(null);
    const [files, setFiles] = useState<FileNode[]>([]);
    const [isAddingFolder, setIsAddingFolder] = useState<boolean>(false);
    const [isAddingDocument, setIsAddingDocument] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
    const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
    const [currentPath, setCurrentPath] = useState<FileNode[]>([]);
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
    const {
        files: originalFiles,
        selectedProject,
        getFiles,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const {
        projectRepository,
    } = useContext<AppContextProps>(AppContext);

    const onAddFolder = useCallback(() => {
        const newFolder: FileNode = {
            nodeId: -99,
            name: "New Folder",
            type: 'FOLDER',
            sizeBytes: 0,
            createdAt: dayJsToISOString(toDayJs(undefined, 0)),
            updatedAt: dayJsToISOString(toDayJs(undefined, 0)),
            projectId: 0,
            parentNodeId: currentFolderId,
            extension: null,
            storageReference: null,
            createdByUserId: null,
            createdBy: "",
        };
        setFiles([newFolder, ...files]);
        setEditingFile(newFolder);
        setIsAddingFolder(true);
    }, [files, currentFolderId]);

    const onAddDocument = useCallback(() => {
        const newDoc: FileNode = {
            nodeId: -98,
            name: "New Document",
            type: 'NOTION_DOC',
            sizeBytes: 0,
            createdAt: dayJsToISOString(toDayJs(undefined, 0)),
            updatedAt: dayJsToISOString(toDayJs(undefined, 0)),
            projectId: 0,
            parentNodeId: currentFolderId,
            extension: null,
            storageReference: null,
            createdByUserId: null,
            createdBy: "",
        };
        setFiles([newDoc, ...files]);
        setEditingFile(newDoc);
        setIsAddingDocument(true);
    }, [files, currentFolderId]);

    const onConfirmEditFileName = useCallback((fileName: string) => {
        if (!editingFile || !projectRepository) {
            return;
        }
        const subscription = projectRepository.updateTitleDocument({
            nodeId: editingFile?.nodeId,
        }, {
            name: fileName,
        })
            .pipe(finalize(() => {
                getFiles?.("", currentFolderId);
            }))
            .subscribe({
                next: res => {
                    if (res?.status) {
                        toast.success(res?.msg || res?.message);
                        onCancelAddOrEdit();
                    }
                    else {
                        setAlertMessage({
                            type: "error",
                            title: res?.msg || res?.message,
                            description: res?.data,
                        });
                    }
                },
                error: (err) => {
                    const errors = err?.response?.data?.data;
                    const message = err?.response?.data?.msg || err?.response?.data?.message;
                    setAlertMessage({
                        type: "error",
                        title: message,
                        description: errors,
                    });
                }
            });

        return () => {
            subscription.unsubscribe();
        }
    }, [editingFile, projectRepository, getFiles, currentFolderId]);

    const onCancelAddOrEdit = useCallback(() => {
        setIsAddingFolder(false);
        setIsAddingDocument(false);
        setEditingFile(null);
        // Remove the temporary folder from the list
        setFiles(files.filter(f => f.nodeId !== -99 && f.nodeId !== -98));
    }, [files]);

    const onConfirmAddFolder = useCallback((folderName: string) => {
        if (!projectRepository || !selectedProject) {
            return;
        }

        if (!folderName.trim()) {
            return;
        }

        const subscription = projectRepository.createFolder(
            { projectId: selectedProject.id },
            { name: folderName.trim(), parent_node_id: currentFolderId }
        )
            .pipe(finalize(() => {
                getFiles?.("", currentFolderId);
            }))
            .subscribe({
                next: (res) => {
                    if (res?.status) {
                        toast.success(res?.message || res?.msg || "Folder created successfully");
                        setIsAddingFolder(false);
                        setEditingFile(null);
                    } else {
                        setAlertMessage({
                            type: "error",
                            title: res?.msg || res?.message,
                            description: res?.data,
                        });
                    }
                },
                error: (err) => {
                    const errors = err?.response?.data?.data;
                    const message = err?.response?.data?.msg || err?.response?.data?.message;
                    setAlertMessage({
                        type: "error",
                        title: message,
                        description: errors,
                    });
                }
            });

        return () => {
            subscription.unsubscribe();
        }
    }, [projectRepository, selectedProject, getFiles, currentFolderId]);

    const onConfirmAddDocument = useCallback((name: string) => {
        if (!projectRepository || !selectedProject) {
            return;
        }

        if (!name.trim()) {
            return;
        }

        const subscription = projectRepository.createNotionDocument(
            { projectId: selectedProject.id },
            { name: name.trim(), parentNodeId: currentFolderId }
        )
            .pipe(finalize(() => {
                getFiles?.("", currentFolderId);
            }))
            .subscribe({
                next: (res) => {
                    if (res?.status) {
                        toast.success(res?.message || res?.msg || "Document created successfully");
                        setIsAddingDocument(false);
                        setEditingFile(null);
                    } else {
                        setAlertMessage({
                            type: "error",
                            title: res?.msg || res?.message,
                            description: res?.data,
                        });
                    }
                },
                error: (err) => {
                    const errors = err?.response?.data?.data;
                    const message = err?.response?.data?.msg || err?.response?.data?.message;
                    setAlertMessage({
                        type: "error",
                        title: message,
                        description: errors,
                    });
                }
            });

        return () => {
            subscription.unsubscribe();
        }
    }, [projectRepository, selectedProject, getFiles, currentFolderId]);

    const onConfirmDeleteFile = useCallback((deleteNodeId: number) => {
        if (!projectRepository || !selectedProject) {
            return;
        }
        const subscription = projectRepository.deleteFileNode({
            projectId: selectedProject.id,
            nodeId: deleteNodeId,
        })
            .pipe(finalize(() => {
                getFiles?.("", currentFolderId);
            }))
            .subscribe({
                next: (res) => {
                    if (res?.status) {
                        toast.success(res?.message || res?.msg || "File deleted successfully");
                        if (deleteNodeId === selectedNodeId) {
                            setSelectedNodeId(null);
                        }
                    } else {
                        toast.error(res?.message || res?.msg);
                    }
                },
                error: (err) => { }
            });

        return () => {
            subscription.unsubscribe();
        }
    }, [projectRepository, getFiles, currentFolderId, selectedProject]);

    const onUploadFile = useCallback((file: File, uploadingId: string, onFinish?: (uploadingId: string, state: 'success' | 'error', savedFile?: FileNode) => void) => {
        if (!projectRepository || !selectedProject) {
            return;
        }
        const subscription = projectRepository.uploadFile({
            projectId: selectedProject.id,
            parentNodeId: currentFolderId,
        }, file)
            .subscribe({
                next: res => {
                    if (res?.status) {
                        onFinish?.(uploadingId, 'success', res?.data);
                    }
                    if (!res?.status) {
                        onFinish?.(uploadingId, 'error');
                    }
                },
                error: err => {
                    onFinish?.(uploadingId, 'error');
                }
            });

        return () => {
            subscription.unsubscribe();
        }

    }, [projectRepository, selectedProject, currentFolderId]);

    const onMoveFile = useCallback((nodeId: number, targetFolderId: number) => {
        if (!projectRepository || !selectedProject) {
            return;
        }

        const subscription = projectRepository.moveFileNode({
            projectId: selectedProject.id,
            nodeId: nodeId
        }, {
            new_parent_id: targetFolderId < 0 ? null : targetFolderId
        })
            .pipe(finalize(() => {
                getFiles?.("", currentFolderId);
            }))
            .subscribe({
                next: (res) => {
                    if (res?.status) {
                        toast.success(res?.message || res?.msg || "Moved file successfully");
                    } else {
                        toast.error(res?.message || res?.msg || "Failed to move file");
                    }
                },
                error: (err) => {
                    toast.error("Failed to move file");
                }
            });

        return () => {
            subscription.unsubscribe();
        }
    }, [projectRepository, selectedProject, currentFolderId, getFiles]);

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
        onAddDocument,
        onConfirmAddDocument,
        isAddingDocument,
        setIsAddingDocument,
        onCancelAddOrEdit,
        onConfirmAddFolder,
        isLoading,
        setIsLoading,
        alertMessage,
        setAlertMessage,
        onConfirmEditFileName,
        onConfirmDeleteFile,
        onUploadFile,
        currentFolderId,
        setCurrentFolderId,
        currentPath,
        setCurrentPath,
        onMoveFile,
        selectedNodeId,
        setSelectedNodeId,
    }
};