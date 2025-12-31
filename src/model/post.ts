export type PostStatus = string;

export interface PostStats {
    score: number;
    viewCount: number;
    answerCount: number;
    isSolved: boolean;
}

export interface PostAuthor {
    userId: number;
    name: string;
    avatar: string;
    email: string;
}

export interface Answer {
    answerId: number;
    content: Record<string, any>;
    author: PostAuthor;
    score: number;
    isAccepted: boolean;
    createdAt: string;
    updatedAt: string;
    userVote?: number;
}

export interface Comment {
    commentId: number;
    content: string;
    author: PostAuthor;
    parentCommentId?: number;
    replyPreview?: string;
    postId?: number;
    answerId?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Post {
    postId: number;
    userId: number;
    title: string;
    preview: string;

    // Author information
    authorId: number;
    authorName: string;
    authorAvatar: string;
    authorEmail: string;

    tags: string[];

    // Statistics
    stats: PostStats;

    createdAt: string;
    status: PostStatus;

    // Optional fields for Post Detail
    content?: Record<string, any>;
    attachments?: {
        name: string;
        url: string;
        type: string;
        isAdded?: boolean;
    }[];
    answers?: Answer[];
    comments?: Comment[];
    userVote?: number;
    isSaved?: boolean;
    savedToProjectIds?: number[];
}