"use client";

import { useEffect, useState, useCallback, useContext, useMemo, useRef } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { firstValueFrom } from "rxjs";
import dynamic from "next/dynamic";
import { useCollaborativeEditor } from "@/hooks/use-collaborative-editor";
import { NotionDocDTO, DocVersionDTO } from "@/model/document";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { toast } from "sonner";
import { AppContextProps, AppContext } from "@/hooks/app-context";


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
    // ✅ 2. Get the ID safely using the hook
    // Make sure your folder is named [fileId]. If it is [id], change this to params.id
    const params = useParams();
    const fileId = params.fileId as string;
    const searchParams = useSearchParams();
    const router = useRouter();

    const {
        documentRepository,
        userRepository, // Get repo from context (contains auth token)
        displayName,
        setDisplayName, // Needed to update UI
        avatarUrl,
        setAvatarUrl,   // Needed to update UI
        userId,
    } = useContext<AppContextProps>(AppContext);

    // FIX ID READING: Read from ?id=23
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
    const [isRestoring, setIsRestoring] = useState(false);

    // Set mounted state
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // ✅ STEP 3: Update currentUser to use fresh context values
    const currentUser = useMemo(() => {
        if (!isMounted) return null;

        const colors = ["#f87171", "#fb923c", "#fbbf24", "#a3e635", "#34d399", "#22d3ee", "#818cf8", "#e879f9"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        return {
            name: displayName || "Anonymous", // Updates automatically when setDisplayName is called
            avatar: avatarUrl || "",          // Updates automatically when setAvatarUrl is called
            color: randomColor,
            id: userId ? String(userId) : `guest-${Math.random().toString(36).substr(2, 9)}`,
        };
    }, [isMounted, displayName, avatarUrl, userId]);

    // Load document details
    useEffect(() => {
        if (!documentRepository) {
            return;
        }
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
    }, [nodeId, documentRepository]);


    // ✅ STEP 2: Auto-Fetch User Profile (Debug Version)
    useEffect(() => {
        // Only run if we are logged in (userId) but missing display info
        if (userId && (!displayName || !avatarUrl)) {
            console.log("Fetching user details for:", userId);

            userRepository?.getProfile().subscribe({
                next: (res) => {
                    console.log("[DEBUG] API Response:", res); // 👈 Check this log in Console!

                    // Handle different response structures
                    // 1. Sometimes response is { status: 1, data: { ... } }
                    // 2. Sometimes response is just { ... }
                    const data = res?.data || res;

                    if (data) {
                        // Check all possible name fields
                        const name = data.fullName || data.full_name || data.name || data.username || "Unknown User";
                        const avatar = data.avatar || data.avatarUrl || data.avatar_url || "";

                        console.log("[DEBUG] Setting User:", { name, avatar });

                        // Update Context -> Updates currentUser -> Updates Awareness
                        setDisplayName(name);
                        setAvatarUrl(avatar);
                    }
                },
                error: (err) => console.error("Failed to fetch user profile", err)
            });
        }
    }, [userId, displayName, avatarUrl, userRepository, setDisplayName, setAvatarUrl]);

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

    // ✅ 3. Update the load function to use 'document.storageReference'
    const handleLoadVersions = () => {
        // Fix: Use the storageReference from the loaded document instead of params
        const storageRef = document?.storageReference;

        if (!storageRef) {
            console.error("No storage reference found");
            return;
        }

        setIsLoadingVersions(true);

        documentRepository?.getSnapshotList(storageRef).subscribe({
            next: (data) => {
                setVersions(data); // Update the list
                setIsLoadingVersions(false);
            },
            error: (err) => {
                console.error("Failed to load history:", err);
                setIsLoadingVersions(false);
            }
        });
    };

    // Restore version
    // Import provider if available, or just use window reload

    const handleRestoreVersion = useCallback(async (versionId: string) => {
        if (!nodeId || !documentRepository) return;

        try {
            setIsRestoring(true);

            // 1. Disconnect Hocuspocus to prevent "Ghost" overwrites
            if (provider) {
                provider.disconnect();
            }

            // 2. Optional: Wait a moment for the server to register the disconnect
            // (Helps if Hocuspocus has a debounce on clearing memory)
            await new Promise(resolve => setTimeout(resolve, 500));

            // 🛑 FIX: Use firstValueFrom to actually execute the Observable
            await firstValueFrom(documentRepository.restoreVersion(nodeId, versionId));

            toast.success("Version restored successfully");

            // 3. Reload to clear memory and fetch fresh data from DB
            window.location.reload();

        } catch (error) {
            console.error("Failed to restore version:", error);
            toast.error("Failed to restore version");

            // Reconnect if failed so user isn't stuck
            if (provider) provider.connect();
            setIsRestoring(false);
        }
    }, [nodeId, documentRepository, provider]);



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

                                documentRepository?.updateDocument(nodeId, { name: newTitle }).subscribe({
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