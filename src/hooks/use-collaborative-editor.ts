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

function getStableColor(userId: string): string {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
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

    // Store refs for cleanup
    const providerRef = useRef<HocuspocusProvider | null>(null);
    const docRef = useRef<Y.Doc | null>(null);

    useEffect(() => {
        // Don't initialize if no storageRef or if we're on the server
        if (!storageRef || typeof window === "undefined") return;

        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId") || "";
        const userName = localStorage.getItem("displayName") || "Anonymous";
        const userAvatar = localStorage.getItem("avatarUrl") || "";

        if (!token) {
            onError?.(new Error("No access token found"));
            return;
        }

        const doc = new Y.Doc();
        docRef.current = doc;

        const hocuspocusUrl = process.env.NEXT_PUBLIC_HOCUSPOCUS_URL || "ws://localhost:1234";

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

        providerRef.current = hocuspocusProvider;

        // CRITICAL: Patch .doc for Tiptap CollaborationCursor compatibility
        // The CollaborationCursor extension looks for 'provider.doc', but Hocuspocus uses 'provider.document'
        (hocuspocusProvider as any).doc = doc;

        const awareness = hocuspocusProvider.awareness;
        const userColor = getStableColor(userId || "anonymous");

        const awarenessChangeHandler = () => {
            if (!awareness) return;
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

        if (awareness) {
            awareness.setLocalStateField("user", {
                id: userId,
                name: userName,
                avatar: userAvatar,
                color: userColor,
            });
            awareness.on("change", awarenessChangeHandler);
        }

        const threadsMap = doc.getMap("threads");
        const threadsObserver = () => {
            const updatedThreads = Array.from(threadsMap.values()) as CommentThread[];
            setThreadsState(updatedThreads);
        };
        threadsMap.observe(threadsObserver);

        setProvider(hocuspocusProvider);
        setYdoc(doc);

        return () => {
            if (awareness) {
                awareness.off("change", awarenessChangeHandler);
            }
            threadsMap.unobserve(threadsObserver);

            // Cleanup
            hocuspocusProvider.destroy();
            doc.destroy();

            providerRef.current = null;
            docRef.current = null;

            setProvider(null);
            setYdoc(null);
            setIsConnected(false);
            setIsSynced(false);
        };
    }, [storageRef, onSynced, onDisconnect, onError]);

    const setThreads = useCallback((newThreads: CommentThread[]) => {
        const doc = docRef.current;
        if (!doc) return;
        const threadsMap = doc.getMap("threads");
        doc.transact(() => {
            threadsMap.forEach((_, key) => threadsMap.delete(key));
            newThreads.forEach((thread) => threadsMap.set(thread.threadId, thread));
        });
    }, []);

    const addThread = useCallback((thread: CommentThread) => {
        const doc = docRef.current;
        if (!doc) return;
        const threadsMap = doc.getMap("threads");
        threadsMap.set(thread.threadId, thread);
    }, []);

    const updateThread = useCallback((threadId: string, updates: Partial<CommentThread>) => {
        const doc = docRef.current;
        if (!doc) return;
        const threadsMap = doc.getMap("threads");
        const existing = threadsMap.get(threadId) as CommentThread | undefined;
        if (existing) {
            threadsMap.set(threadId, { ...existing, ...updates });
        }
    }, []);

    const deleteThread = useCallback((threadId: string) => {
        const doc = docRef.current;
        if (!doc) return;
        const threadsMap = doc.getMap("threads");
        threadsMap.delete(threadId);
    }, []);

    return { provider, ydoc, isConnected, isSynced, awarenessUsers, threads, setThreads, addThread, updateThread, deleteThread };
}