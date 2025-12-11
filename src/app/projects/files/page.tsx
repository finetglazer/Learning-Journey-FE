"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { firstValueFrom } from "rxjs";
import dynamic from "next/dynamic";
import { useCollaborativeEditor } from "@/hooks/use-collaborative-editor";
import { documentRepository } from "@/repository/document-repository";
import { NotionDocDTO, DocVersionDTO } from "@/model/document";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";

// Dynamically import the editor with SSR disabled
const NotionEditor = dynamic(
    () => import("@/components/core/notion-editor/editor").then((mod) => mod.NotionEditor),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-2" />
                    <p className="text-gray-500">Loading editor...</p>
                </div>
            </div>
        )
    }
);

export default function DocumentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const nodeId = Number(searchParams.get("id"));

    const [document, setDocument] = useState<NotionDocDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Version history state
    const [versions, setVersions] = useState<DocVersionDTO[]>([]);
    const [isLoadingVersions, setIsLoadingVersions] = useState(false);
    const [isRestoringVersion, setIsRestoringVersion] = useState(false);

    // Set mounted state
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Load document details
    useEffect(() => {
        const loadDocument = async () => {
            if (!nodeId || isNaN(nodeId)) {
                setIsLoading(false);
                setError("Invalid Document ID");
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                const doc = await firstValueFrom(
                    documentRepository.getDocumentDetails(nodeId)
                );

                setDocument(doc);
            } catch (err: any) {
                console.error("Failed to load document:", err);
                setError(err.message || "Failed to load document");
                toast.error("Failed to load document");
            } finally {
                setIsLoading(false);
            }
        };

        loadDocument();
    }, [nodeId]);

    // Initialize collaborative editor only when document is loaded
    const {
        provider,
        ydoc,
        isConnected,
        isSynced,
        awarenessUsers,
        threads,
        addThread,
        updateThread,
        deleteThread,
    } = useCollaborativeEditor({
        storageRef: document?.storageReference || "",
        onError: (error) => {
            if (error.message !== "No access token found") {
                toast.error(`Connection error: ${error.message}`);
            }
        },
    });

    // Load version history
    const handleLoadVersions = useCallback(async () => {
        if (!nodeId) return;
        try {
            setIsLoadingVersions(true);
            const versionList = await firstValueFrom(
                documentRepository.getVersionHistory(nodeId)
            );
            setVersions(versionList);
        } catch (err) {
            console.error("Failed to load versions:", err);
            toast.error("Failed to load version history");
        } finally {
            setIsLoadingVersions(false);
        }
    }, [nodeId]);

    // Restore version
    const handleRestoreVersion = useCallback(
        async (versionId: number) => {
            if (!nodeId) return;
            try {
                setIsRestoringVersion(true);
                await firstValueFrom(
                    documentRepository.restoreVersion(nodeId, versionId)
                );

                toast.success("Version restored successfully");
                window.location.reload();
            } catch (err) {
                console.error("Failed to restore version:", err);
                toast.error("Failed to restore version");
            } finally {
                setIsRestoringVersion(false);
            }
        },
        [nodeId]
    );

    const canEdit = document?.role === "OWNER" || document?.role === "MEMBER";

    // Check if editor is ready - provider and ydoc must both be non-null
    const isEditorReady = !!(provider && ydoc && document?.storageReference);

    // --- RENDER STATES ---

    // Don't render anything meaningful until mounted (avoids hydration issues)
    if (!isMounted) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4" />
                    <p className="text-gray-500">Initializing...</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4" />
                    <p className="text-gray-500">Loading document...</p>
                </div>
            </div>
        );
    }

    if (error || !document) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
                <div className="text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Document not found</h2>
                    <p className="text-gray-500 mb-4">
                        {error || "The document you're looking for doesn't exist."}
                    </p>
                    <Button onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Document header */}
            <header className="flex items-center gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <h1 className="font-semibold text-lg">{document.name}</h1>
                </div>

                {!canEdit && (
                    <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                        View only
                    </span>
                )}
            </header>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
                {isEditorReady ? (
                    <NotionEditor
                        provider={provider}
                        ydoc={ydoc}
                        isConnected={isConnected}
                        isSynced={isSynced}
                        awarenessUsers={awarenessUsers}
                        threads={threads}
                        addThread={addThread}
                        updateThread={updateThread}
                        deleteThread={deleteThread}
                        canEdit={canEdit}
                        versions={versions}
                        isLoadingVersions={isLoadingVersions}
                        onLoadVersions={handleLoadVersions}
                        onRestoreVersion={handleRestoreVersion}
                        isRestoringVersion={isRestoringVersion}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-2" />
                            <p className="text-gray-500">Connecting to collaboration server...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}