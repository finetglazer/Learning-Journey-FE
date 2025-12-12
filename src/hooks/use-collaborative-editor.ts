"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { HocuspocusProvider } from "@hocuspocus/provider";
import * as Y from "yjs";
import { AwarenessUser, CommentThread } from "@/model/document";

// ✅ 1. Define the User interface
interface CollaborativeUser {
    name: string;
    avatar: string;
    color: string;
    id: string;
}

interface UseCollaborativeEditorOptions {
    storageRef: string;
    // ✅ 2. Add user to options
    user: CollaborativeUser | null;
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

export function useCollaborativeEditor(
    options: UseCollaborativeEditorOptions
): UseCollaborativeEditorReturn {
    // ✅ 3. Destructure user
    const { storageRef, user, onSynced, onDisconnect, onError } = options;

    const onSyncedRef = useRef(onSynced);
    const onDisconnectRef = useRef(onDisconnect);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onSyncedRef.current = onSynced;
        onDisconnectRef.current = onDisconnect;
        onErrorRef.current = onError;
    }, [onSynced, onDisconnect, onError]);

    const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
    const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isSynced, setIsSynced] = useState(false);
    const [awarenessUsers, setAwarenessUsers] = useState<AwarenessUser[]>([]);
    const [threads, setThreadsState] = useState<CommentThread[]>([]);

    const providerRef = useRef<HocuspocusProvider | null>(null);
    const docRef = useRef<Y.Doc | null>(null);

    // ✅ 4. New Effect: Update awareness whenever the 'user' or 'provider' changes
    useEffect(() => {
        const currentProvider = providerRef.current;
        console.log("Updating awareness for user:", user);
        if (currentProvider && user) {
            // ✅ Fix: Add '?.' before setLocalStateField
            currentProvider.awareness?.setLocalStateField("user", {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                color: user.color,
            });
        }
    }, [user, provider]);

    useEffect(() => {
        if (!storageRef || typeof window === "undefined") return;

        const token = localStorage.getItem("accessToken");

        if (!token) {
            onErrorRef.current?.(new Error("No access token found"));
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
                    onSyncedRef.current?.();
                }
            },
            onDisconnect: () => {
                console.log("Disconnected from Hocuspocus");
                setIsConnected(false);
                setIsSynced(false);
                onDisconnectRef.current?.();
            },
            onAuthenticationFailed: ({ reason }: { reason: string }) => {
                console.error("Authentication failed:", reason);
                onErrorRef.current?.(new Error(reason));
            },
        });

        providerRef.current = hocuspocusProvider;

        const awareness = hocuspocusProvider.awareness;

        // Listen for other users joining/leaving
        const awarenessChangeHandler = () => {
            if (!awareness) return;
            const states = awareness.getStates();
            const users: AwarenessUser[] = [];

            console.log("Awareness states changed:", states);

            states.forEach((state: any, clientId: number) => {
                if (state.user) {
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
            // Register the listener
            awareness.on("change", awarenessChangeHandler);

            // ✅ 5. Set Initial State immediately if user is already available
            if (user) {
                awareness.setLocalStateField("user", {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    color: user.color,
                });
            }
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

            hocuspocusProvider.destroy();
            doc.destroy();

            providerRef.current = null;
            docRef.current = null;

            setProvider(null);
            setYdoc(null);
            setIsConnected(false);
            setIsSynced(false);
        };
    }, [storageRef]); // Removed user from dependency to avoid reconnecting on user update

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