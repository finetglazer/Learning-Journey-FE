// Document content structure (Tiptap JSON)
export interface TiptapNode {
    type: string;
    attrs?: Record<string, unknown>;
    content?: TiptapNode[];
    marks?: TiptapMark[];
    text?: string;
}

export interface TiptapMark {
    type: string;
    attrs?: Record<string, unknown>;
}

export interface TiptapDocument {
    type: "doc";
    content: TiptapNode[];
}

// Comment system
export interface CommentReply {
    replyId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CommentThread {
    threadId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    replies: CommentReply[];
    resolved: boolean;
    resolvedBy?: string;
    resolvedAt?: string;
    orphaned: boolean;
    createdAt: string;
    updatedAt?: string;
}

// Document DTOs
export interface DocumentDTO {
    storageRef: string;
    content: TiptapDocument;
    threads: CommentThread[];
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface NotionDocDTO {
    nodeId: number;
    name: string;
    storageReference: string;
    role: "OWNER" | "MEMBER";
    createdAt: string;
    updatedAt: string;
}

// Version history
export interface DocVersionDTO {
    versionId: number;
    snapshotRef: string;
    versionNumber: number;
    createdBy: number;
    createdByName: string;
    createdByAvatar?: string;
    reason: "AUTO_30MIN" | "SESSION_END" | "RESTORED" | "BEFORE_RESTORE";
    createdAt: string;
}

// API responses
export interface DocumentAccessDTO {
    nodeId: number;
    projectId: number;
    role: "OWNER" | "MEMBER";
    canEdit: boolean;
    canDelete: boolean;
    userId: number;
    userName: string;
    userAvatar?: string;
}

// Create document request
export interface CreateNotionDocRequest {
    parentNodeId?: number;
    name: string;
}

// Awareness user (for presence)
export interface AwarenessUser {
    id: string;
    name: string;
    avatar?: string;
    color: string;
    cursor?: {
        anchor: number;
        head: number;
    };
}