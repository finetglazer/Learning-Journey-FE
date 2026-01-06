"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FILE_PREVIEWABLE } from "@/const/consts";
import { cn } from "@/lib/utils";
import DocViewer, { DocViewerRenderers, IDocument } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { Download, ExternalLink, FileWarning, Loader2, X } from "lucide-react";
import { useMemo, useState } from "react";

export interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string;
    fileName: string;
    fileExtension: string;
    width?: string;
    height?: string;
}

// Custom loading component
const CustomLoadingRenderer = () => (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-gray-500 text-sm">Loading preview...</p>
    </div>
);

// Custom error/unsupported component
const CustomNoRenderer = ({ fileName }: { fileName: string }) => (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 p-8">
        <FileWarning className="h-16 w-16 text-amber-500" />
        <div className="text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Preview not available</h3>
            <p className="text-gray-500 text-sm max-w-md">
                Unable to preview &quot;{fileName}&quot;. This file type may not be supported for preview.
                You can download the file to view it locally.
            </p>
        </div>
    </div>
);

export function FilePreviewModal({
    isOpen,
    onClose,
    fileUrl,
    fileName,
    fileExtension,
    width = '95vw',
    height = '90vh',
}: FilePreviewModalProps) {
    const [isLoading, setIsLoading] = useState(true);

    const isPreviewSupported = useMemo(() => {
        return FILE_PREVIEWABLE.includes(fileExtension?.toLowerCase() || '');
    }, [fileExtension]);

    const documents: IDocument[] = useMemo(() => {
        if (!fileUrl) return [];
        return [{
            uri: fileUrl,
            fileName: fileName,
            fileType: fileExtension?.toLowerCase(),
        }];
    }, [fileUrl, fileName, fileExtension]);

    const handleDownload = async () => {
        if (!fileUrl) return;

        try {
            // Fetch the file as blob to force download (works for cross-origin files)
            const response = await fetch(fileUrl);
            const blob = await response.blob();

            // Create a temporary URL for the blob
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the blob URL
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            // Fallback: open in new tab if fetch fails (e.g., CORS issues)
            console.error('Download failed, opening in new tab:', error);
            window.open(fileUrl, '_blank');
        }
    };

    const handleOpenInNewTab = () => {
        if (!fileUrl) return;
        window.open(fileUrl, '_blank');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className={cn(
                    "max-w-5xl p-0 overflow-hidden flex flex-col",
                    "bg-white dark:bg-gray-900 rounded-xl shadow-2xl"
                )}
                style={{ width, height, maxWidth: width }}
                showCloseButton={false}
            >
                {/* Header */}
                <DialogHeader className="flex flex-row items-center justify-between px-6 py-2 border-b bg-gray-50 dark:bg-gray-800 shrink-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                            {fileName}
                        </DialogTitle>
                        {fileExtension && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full uppercase">
                                {fileExtension}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenInNewTab}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer h-8"
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span className="hidden sm:inline">Open</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer h-8"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Download</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                onClose();
                            }}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer h-8 w-8"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 bg-gray-100 dark:bg-gray-950 min-h-0 relative">
                    <style>
                        {`
                            #react-doc-viewer {
                                height: 100% !important;
                            }
                            #react-doc-viewer #proxy-renderer {
                                height: 100% !important;
                                overflow: auto !important;
                            }
                            #react-doc-viewer #proxy-renderer > div {
                                height: 100% !important;
                            }
                        `}
                    </style>
                    {isPreviewSupported && documents.length > 0 ? (
                        <div className="absolute inset-0 flex flex-col">
                            <DocViewer
                                documents={documents}
                                pluginRenderers={DocViewerRenderers}
                                config={{
                                    header: {
                                        disableHeader: true,
                                        disableFileName: true,
                                    },
                                    loadingRenderer: {
                                        overrideComponent: CustomLoadingRenderer,
                                    },
                                    noRenderer: {
                                        overrideComponent: () => <CustomNoRenderer fileName={fileName} />,
                                    },
                                }}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                }}
                            />
                        </div>
                    ) : (
                        <div className="h-full">
                            <CustomNoRenderer fileName={fileName} />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default FilePreviewModal;
