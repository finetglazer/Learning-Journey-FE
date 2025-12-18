export interface Post {
    id: number;
    title: string;
    content: string;
    votes: number;
    answers: number;
    views: number;
    tags: string[];
    author: {
        name: string;
        avatar: string;
    };
    createdAt: string;
    haveSolution: boolean;
    attachments?: {
        name: string;
        url: string;
        type: string;
        isAdded?: boolean;
    }[];
};