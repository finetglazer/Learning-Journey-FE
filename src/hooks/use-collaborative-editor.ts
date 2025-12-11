"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import { AwarenessUser, CommentThread } from "@/model/document";

interface UseCollaborativeEditorOptions {
    storageRef: string;
    onSynced?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Error) => void;
}

interface UseCollaborativeEditorReturn {
    provider: HocuspocusProvider | null;
    ydoc: Y.Doc | null;
    isConnected: boolean;
    isSynced: boolean;
    awarenessUsers: AwarenessUser[];
    threads: CommentThread[];
    setThreads: (threads: CommentThread[]) => void;
    addThread: (thread: CommentThread) => void;
    updateThread: (threadId: string, updates: Partial<CommentThread>) => void;
    deleteThread: (threadId: string) => void;
}

// Generate random color for user cursor
function getRandomColor(): string {
    const colors = [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FFEAA7",
        "#DDA0DD",
        "#98D8C8",
        "#F7DC6F",
        "#BB8FCE",
        "#85C1E9",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

export function useCollaborativeEditor(
    options: UseCollaborativeEditorOptions
): UseCollaborativeEditorReturn {
    const { storageRef, onSynced, onDisconnect, onError } = options;

    const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
    const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isSynced, setIsSynced] = useState(false);
    const [awarenessUsers, setAwarenessUsers] = useState<AwarenessUser[]>([]);
    const [threads, setThreadsState] = useState<CommentThread[]>([]);

    const userColorRef = useRef(getRandomColor());

    // Initialize connection
    useEffect(() => {
        if (!storageRef) return;

        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId") || "";
        const userName = localStorage.getItem("displayName") || "Anonymous";
        const userAvatar = localStorage.getItem("avatarUrl") || "";

        if (!token) {
            onError?.(new Error("No access token found"));
            return;
        }

        const doc = new Y.Doc();
        const hocuspocusUrl =
            process.env.NEXT_PUBLIC_HOCUSPOCUS_URL || "ws://localhost:1234";

        const hocuspocusProvider = new HocuspocusProvider({
            url: hocuspocusUrl,
            name: storageRef,
            document: doc,
            token,
            onConnect: () => {
                console.log("Connected to Hocuspocus");
                setIsConnected(true);
            },
            onSynced: ({ state }: { state: boolean }) => {
                if (state) {
                    console.log("Document synced");
                    setIsSynced(true);

                    // Load threads from Y.Doc
                    const threadsMap = doc.getMap("threads");
                    const loadedThreads = Array.from(threadsMap.values()) as CommentThread[];
                    setThreadsState(loadedThreads);

                    onSynced?.();
                }
            },
            onDisconnect: () => {
                console.log("Disconnected from Hocuspocus");
                setIsConnected(false);
                setIsSynced(false);
                onDisconnect?.();
            },
            onAuthenticationFailed: ({ reason }: { reason: string }) => {
                console.error("Authentication failed:", reason);
                onError?.(new Error(reason));
            },
        });

        // --- SAFE AWARENESS HANDLING ---
        const awareness = hocuspocusProvider.awareness;

        // Define the handler logic
        const awarenessChangeHandler = () => {
            if (!awareness) return; // Double safety check inside handler

            const states = awareness.getStates();
            const users: AwarenessUser[] = [];

            states.forEach((state: any, clientId: number) => {
                if (state.user && clientId !== awareness.clientID) {
                    users.push({
                        id: state.user.id,
                        name: state.user.name,
                        avatar: state.user.avatar,
                        color: state.user.color,
                        cursor: state.cursor,
                    });
                }
            });

            setAwarenessUsers(users);
        };

        // Only attach if awareness exists (Fixes TS18047)
        if (awareness) {
            awareness.setLocalStateField("user", {
                id: userId,
                name: userName,
                avatar: userAvatar,
                color: userColorRef.current,
            });

            awareness.on("change", awarenessChangeHandler);
        }

        // Listen for thread changes
        const threadsMap = doc.getMap("threads");
        const threadsObserver = () => {
            const updatedThreads = Array.from(threadsMap.values()) as CommentThread[];
            setThreadsState(updatedThreads);
        };
        threadsMap.observe(threadsObserver);

        setProvider(hocuspocusProvider);
        setYdoc(doc);

        // Cleanup
        return () => {
            if (awareness) {
                awareness.off("change", awarenessChangeHandler);
            }
            threadsMap.unobserve(threadsObserver);
            hocuspocusProvider.destroy();
            doc.destroy();
            setProvider(null);
            setYdoc(null);
            setIsConnected(false);
            setIsSynced(false);
        };
    }, [storageRef, onSynced, onDisconnect, onError]);

    // Thread management functions
    const setThreads = useCallback(
        (newThreads: CommentThread[]) => {
            if (!ydoc) return;

            const threadsMap = ydoc.getMap("threads");
            ydoc.transact(() => {
                // Clear existing
                threadsMap.forEach((_, key) => threadsMap.delete(key));
                // Add new
                newThreads.forEach((thread) => {
                    threadsMap.set(thread.threadId, thread);
                });
            });
        },
        [ydoc]
    );

    const addThread = useCallback(
        (thread: CommentThread) => {
            if (!ydoc) return;

            const threadsMap = ydoc.getMap("threads");
            threadsMap.set(thread.threadId, thread);
        },
        [ydoc]
    );

    const updateThread = useCallback(
        (threadId: string, updates: Partial<CommentThread>) => {
            if (!ydoc) return;

            const threadsMap = ydoc.getMap("threads");
            const existing = threadsMap.get(threadId) as CommentThread | undefined;

            if (existing) {
                threadsMap.set(threadId, { ...existing, ...updates });
            }
        },
        [ydoc]
    );

    const deleteThread = useCallback(
        (threadId: string) => {
            if (!ydoc) return;

            const threadsMap = ydoc.getMap("threads");
            threadsMap.delete(threadId);
        },
        [ydoc]
    );

    return {
        provider,
        ydoc,
        isConnected,
        isSynced,
        awarenessUsers,
        threads,
        setThreads,
        addThread,
        updateThread,
        deleteThread,
    };
}