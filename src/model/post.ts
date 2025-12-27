export type PostStatus = string;

export interface PostStats {
    score: number;
    viewCount: number;
    answerCount: number;
    isSolved: boolean;
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

    tags: string[];

    // Statistics
    stats: PostStats;

    createdAt: string;
    status: PostStatus;

    // Optional fields for Post Detail
    content?: string;
    attachments?: {
        name: string;
        url: string;
        type: string;
        isAdded?: boolean;
    }[];
    answers?: any[];
    comments?: any[];
}