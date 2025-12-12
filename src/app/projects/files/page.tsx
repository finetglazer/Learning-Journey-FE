"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { firstValueFrom } from "rxjs";
import dynamic from "next/dynamic";
import { useCollaborativeEditor } from "@/hooks/use-collaborative-editor";
import { documentRepository } from "@/repository/document-repository";
import { NotionDocDTO, DocVersionDTO } from "@/model/document";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import {useRef} from "react"

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

    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // 1. Prepare Current User Data (Memoized to prevent color flickering)
    const currentUser = useMemo(() => {
        if (!isMounted) return null;

        // Random color generator for the avatar border/cursor
        const colors = ["#f87171", "#fb923c", "#fbbf24", "#a3e635", "#34d399", "#22d3ee", "#818cf8", "#e879f9"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        console.log(localStorage.getItem("avatarUrl"));
        return {
            name: localStorage.getItem("displayName") || "Anonymous",
            avatar: localStorage.getItem("avatarUrl") || "",
            color: randomColor,
            // Assuming userId is stored, otherwise fallback to random
            id: localStorage.getItem("userId") || `guest-${Math.random().toString(36).substr(2, 9)}`,
        };
    }, [isMounted]);

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

    // Initialize collaborative editor
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
        // ✅ PASS THE USER HERE (This property needs to be added to your hook)
        user: currentUser,
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

    // Check if editor is ready
    const isEditorReady = !!(provider && ydoc && document?.storageReference);

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

                        documentTitle={document.name}
                        createdBy={document.createdBy}
                        createdAt={document.createdAt}

                        onTitleChange={(newTitle) => {
                            // A. Update UI immediately (so it feels fast)
                            setDocument(prev => prev ? { ...prev, name: newTitle } : null);

                            // B. Clear any pending save
                            if (saveTimeoutRef.current) {
                                clearTimeout(saveTimeoutRef.current);
                            }

                            // C. Start a new timer (Save after 0.8 seconds of silence)
                            saveTimeoutRef.current = setTimeout(() => {
                                if (!nodeId) return;

                                console.log("Saving new title to database:", newTitle);

                                documentRepository.updateDocument(nodeId, { name: newTitle }).subscribe({
                                    next: () => console.log("Title saved successfully!"),
                                    error: (err) => toast.error("Failed to save title")
                                });
                            }, 800);
                        }}

                        onBack={() => router.back()}
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