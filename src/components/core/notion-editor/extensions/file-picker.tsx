import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { X } from "lucide-react";
import { FileNode } from "@/model/project-management";
import { getFileIcon } from "@/lib/utils";

interface FilePickerProps {
    files: FileNode[];
    onSelect: (file: FileNode) => void;
    onClose?: () => void;
}

interface FilePickerRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const FilePicker = forwardRef<FilePickerRef, FilePickerProps>(
    ({ files, onSelect, onClose }, ref) => {
        const [selectedIndex, setSelectedIndex] = useState(0);
        const scrollContainerRef = useRef<HTMLDivElement>(null);

        // Reset selection when files change
        useEffect(() => {
            setSelectedIndex(0);
        }, [files]);

        // Handle keyboard navigation
        useImperativeHandle(ref, () => ({
            onKeyDown: ({ event }) => {
                if (event.key === "ArrowUp") {
                    setSelectedIndex((prev) => (prev - 1 + files.length) % files.length);
                    return true;
                }

                if (event.key === "ArrowDown") {
                    setSelectedIndex((prev) => (prev + 1) % files.length);
                    return true;
                }

                if (event.key === "Enter") {
                    const file = files[selectedIndex];
                    if (file) {
                        onSelect(file);
                    }
                    return true;
                }

                return false;
            },
        }));

        // Auto-scroll selected item into view
        useEffect(() => {
            const container = scrollContainerRef.current;
            if (!container) return;

            const selectedItem = container.querySelector(
                `[data-selected="true"]`
            ) as HTMLElement;

            if (selectedItem) {
                selectedItem.scrollIntoView({
                    block: "nearest",
                    behavior: "smooth",
                });
            }
        }, [selectedIndex]);

        const formatFileSize = (bytes: number | null): string => {
            if (!bytes) return "";
            if (bytes < 1024) return `${bytes} B`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        };

        if (files.length === 0) {
            return (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-80">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Select a file</span>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <div className="p-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            No files found
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div
                ref={scrollContainerRef}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-96 max-h-96 overflow-y-auto"
            >
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 flex justify-between items-center sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
                    <span>Select a file</span>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
                {files.map((file, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                        <button
                            key={`file-${file.nodeId}-${index}`}
                            onClick={() => onSelect(file)}
                            data-selected={isSelected}
                            className={`flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${isSelected
                                ? "bg-gray-100 dark:bg-gray-700"
                                : ""
                                }`}
                        >
                            <div className="flex items-center justify-center w-8 h-8 shrink-0">
                                {getFileIcon(file.extension, file.type, 32)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {file.name}
                                    {file.extension && `.${file.extension}`}
                                </p>
                            </div>
                            {file.sizeBytes && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                    {formatFileSize(file.sizeBytes)}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    }
);

FilePicker.displayName = "FilePicker";
