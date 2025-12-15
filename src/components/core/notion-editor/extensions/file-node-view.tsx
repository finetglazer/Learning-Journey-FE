import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import React from "react";
import { cn } from "@/lib/utils";

// Helper functions (moved from file-node.tsx)
const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getIconPath = (ext: string | null, type: string): string => {
    if (type === 'NOTION_DOC') {
        return '/note.png';
    }
    switch (ext?.toLowerCase()) {
        case 'pdf':
            return '/pdf.png';
        case 'xls':
        case 'xlsx':
            return '/xls.png';
        case 'jpg':
        case 'jpeg':
            return '/jpg.png';
        case 'png':
            return '/png.png';
        case 'doc':
        case 'docx':
            return '/doc.png';
        case 'zip':
            return '/zip.png';
        case 'rar':
            return '/rar.png';
        case 'txt':
            return '/txt.png';
        case 'ppt':
        case 'pptx':
            return '/ppt.png';
        default:
            return '/file.svg';
    }
};

export const FileNodeView: React.FC<NodeViewProps> = (props) => {
    const { node } = props;
    const { name, extension, sizeBytes, storageReference, nodeType } = node.attrs;

    const handleOpen = () => {
        if (storageReference) {
            window.open(storageReference, '_blank');
        }
    };

    return (
        <NodeViewWrapper className="file-node-wrapper">
            <div
                className={cn(
                    "flex items-center gap-3 px-4 py-3 my-2",
                    "bg-gray-50 dark:bg-gray-800",
                    "border border-gray-200 dark:border-gray-700",
                    "rounded-lg transition-colors",
                    storageReference ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" : ""
                )}
                contentEditable={false}
                onClick={handleOpen}
            >
                <img
                    src={getIconPath(extension, nodeType)}
                    alt={`${extension || 'file'} icon`}
                    className="w-8 h-8"
                />

                <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {name}{extension ? `.${extension}` : ''}
                    </p>
                </div>

                {sizeBytes && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(sizeBytes)}
                    </span>
                )}
            </div>
        </NodeViewWrapper>
    );
};
