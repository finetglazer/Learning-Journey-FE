"use client";

import React, { useEffect, useRef, useState, useContext } from "react";
import { FilePicker } from "./file-picker";
import { FileNode } from "@/model/project-management";
import { Editor } from "@tiptap/react";
import { TeamProjectContext } from "../../sidebar/pages/project/team-project-context";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { toast } from "sonner";

interface FilePickerWrapperProps {
    editor: Editor | null;
    projectId?: number | string; // Optional projectId prop
}

export function FilePickerWrapper({ editor, projectId }: FilePickerWrapperProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [files, setFiles] = useState<FileNode[]>([]);
    const [loading, setLoading] = useState(false);
    const filePickerRef = useRef<any>(null);
    const { selectedProject } = useContext(TeamProjectContext);
    const { projectRepository } = useContext<AppContextProps>(AppContext);

    useEffect(() => {
        const handleOpenFilePicker = (event: Event) => {
            const customEvent = event as CustomEvent;
            console.log("openFilePicker event received", customEvent.detail);
            if (customEvent.detail && customEvent.detail.editor === editor) {
                console.log("Opening file picker...");
                setIsOpen(true);
                fetchFiles();
            }
        };

        window.addEventListener("openFilePicker", handleOpenFilePicker);
        return () => {
            window.removeEventListener("openFilePicker", handleOpenFilePicker);
        };
    }, [editor, projectId]);

    const fetchFiles = async () => {
        // Use projectId prop if available, otherwise fallback to selectedProject from context
        const effectiveProjectId = projectId || selectedProject?.id;

        console.log("fetchFiles called", {
            projectRepository: !!projectRepository,
            projectIdProp: projectId,
            selectedProject: !!selectedProject,
            effectiveProjectId
        });

        if (!projectRepository) {
            console.error("Missing projectRepository");
            toast.error("Cannot fetch files: Repository not available");
            return;
        }

        if (!effectiveProjectId) {
            console.error("Missing projectId");
            toast.error("Cannot fetch files: Project ID not available");
            return;
        }

        setLoading(true);
        console.log("Fetching files for project:", effectiveProjectId);

        const subscription = projectRepository
            .getFilesForPicker({
                projectId: effectiveProjectId,
            })
            .subscribe({
                next: (res) => {
                    console.log("Files response:", res);
                    if (res?.status) {
                        setFiles(res?.data || []);
                        console.log("Files set:", res?.data?.length || 0, "files");
                    } else {
                        toast.error(res?.message || "Failed to fetch files");
                    }
                    setLoading(false);
                },
                error: (err) => {
                    console.error("Error fetching files:", err);
                    toast.error("Failed to fetch files");
                    setLoading(false);
                },
            });

        return () => {
            subscription.unsubscribe();
        };
    };

    const handleSelectFile = (file: FileNode) => {
        if (!editor || !editor.view || editor.isDestroyed) return;

        // 🛑 TEMPORARY FIX: Cast to 'any' to read snake_case properties
        // because your TypeScript interface likely defines them as camelCase.
        const rawFile = file as any;

        editor
            .chain()
            .focus()
            .setFileNode({
                name: rawFile.name,
                extension: rawFile.extension,

                // ✅ FIX 1: Use 'size_bytes' instead of 'sizeBytes'
                sizeBytes: rawFile.size_bytes,

                // ✅ FIX 2: For NOTION_DOC, use node_id; for STATIC_FILE, use storage_reference
                storageReference: rawFile.type === 'NOTION_DOC'
                    ? String(rawFile.node_id)
                    : (rawFile.storage_reference || ""),

                nodeType: rawFile.type,
            })
            .run();

        setIsOpen(false);
        setFiles([]);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) return false;

        if (event.key === "Escape") {
            setIsOpen(false);
            setFiles([]);
            return true;
        }

        return filePickerRef.current?.onKeyDown({ event }) || false;
    };

    useEffect(() => {
        if (!isOpen) return;

        const handler = (event: KeyboardEvent) => {
            if (handleKeyDown(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        document.addEventListener("keydown", handler);
        return () => {
            document.removeEventListener("keydown", handler);
        };
    }, [isOpen, files]);

    if (!isOpen || !editor || !editor.view || editor.isDestroyed) return null;

    // Position the file picker near the cursor
    const { from } = editor.state.selection;
    const coords = editor.view.coordsAtPos(from);

    return (
        <div
            style={{
                position: "fixed",
                top: `${coords.top + 20}px`,
                left: `${coords.left}px`,
                zIndex: 1000,
            }}
        >
            {loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-80 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        Loading files...
                    </p>
                </div>
            ) : (
                <FilePicker ref={filePickerRef} files={files} onSelect={handleSelectFile} />
            )}
        </div>
    );
}
