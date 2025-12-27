
import { CreatePostModel } from "@/model/create-post-model";
import { Post } from "@/model/post";
import { Observable, map } from "rxjs";
import { BaseRepository } from "./base-repository";

const BASE_API_URL = "/api/forum";

export interface VoteRequest {
    voteType: "UPVOTE" | "DOWNVOTE" | "UNVOTE";
}

export interface UpdateSavePostStatusRequest {
    isSaved: boolean;
}

export interface CreateAnswerRequest {
    content: string;
}

export interface CreateCommentRequest {
    targetType: "POST" | "ANSWER" | "COMMENT";
    targetId: number;
    content: string;
}

export class PostRepository extends BaseRepository {
    constructor(userId: number) {
        super(userId);
    }

    // --- 1. FORUM FEED & SEARCH ---

    public getPosts = (
        userId: number,
        page: number = 1,
        limit: number = 10,
        filter: string = "ALL",
        sort: string = "NEWEST",
        search?: string
    ): Observable<any> => {
        const params: any = { page, limit, filter, sort };
        if (search) params.search = search;

        return this.http
            .get(`${BASE_API_URL}/posts`, {
                headers: { "X-User-Id": userId },
                params,
            })
            .pipe(map((response) => response?.data));
    };

    public createPost = (userId: number, request: CreatePostModel): Observable<Post> => {
        return this.http
            .post(`${BASE_API_URL}/posts`, request, {
                headers: { "X-User-Id": userId },
            })
            .pipe(map((response) => response?.data));
    };

    // --- 2. POST DETAIL & ACTIONS ---

    public getPostDetail = (userId: number, postId: number): Observable<any> => {
        return this.http
            .get(`${BASE_API_URL}/posts/${postId}`, {
                headers: { "X-User-Id": userId },
            })
            .pipe(map((response) => response?.data));
    };

    public votePost = (userId: number, postId: number, request: VoteRequest): Observable<any> => {
        return this.http
            .post(`${BASE_API_URL}/posts/${postId}/vote`, request, {
                headers: { "X-User-Id": userId },
            })
            .pipe(map((response) => response?.data));
    };

    public markAsSolved = (userId: number, postId: number, isSolved: boolean): Observable<any> => {
        return this.http
            .put(
                `${BASE_API_URL}/posts/${postId}/solve`,
                { isSolved },
                { headers: { "X-User-Id": userId } }
            )
            .pipe(map((response) => response?.data));
    };

    public deletePost = (userId: number, postId: number): Observable<any> => {
        return this.http
            .delete(`${BASE_API_URL}/posts/${postId}`, {
                headers: { "X-User-Id": userId },
            })
            .pipe(map((response) => response?.data));
    };

    public updateSaveStatus = (
        userId: number,
        postId: number,
        request: UpdateSavePostStatusRequest
    ): Observable<any> => {
        return this.http
            .put(`${BASE_API_URL}/posts/${postId}/save`, request, {
                headers: { "X-User-Id": userId },
            })
            .pipe(map((response) => response?.data));
    };

    // --- 3. ANSWERS MANAGEMENT ---

    public getAnswers = (
        postId: number,
        page: number = 1,
        limit: number = 10,
        sort: string = "NEWEST"
    ): Observable<any> => {
        return this.http
            .get(`${BASE_API_URL}/posts/${postId}/answers`, {
                params: { page, limit, sort },
            })
            .pipe(map((response) => response?.data));
    };

    public submitAnswer = (
        userId: number,
        postId: number,
        request: CreateAnswerRequest
    ): Observable<any> => {
        return this.http
            .post(`${BASE_API_URL}/posts/${postId}/answers`, request, {
                headers: { "X-User-Id": userId },
            })
            .pipe(map((response) => response?.data));
    };

    public acceptAnswer = (userId: number, answerId: number): Observable<any> => {
        return this.http
            .put(
                `${BASE_API_URL}/answers/${answerId}/accept`,
                {},
                { headers: { "X-User-Id": userId } }
            )
            .pipe(map((response) => response?.data));
    };

    public voteAnswer = (
        userId: number,
        answerId: number,
        request: VoteRequest
    ): Observable<any> => {
        return this.http
            .post(`${BASE_API_URL}/answers/${answerId}/vote`, request, {
                headers: { "X-User-Id": userId },
            })
            .pipe(map((response) => response?.data));
    };

    public deleteAnswer = (userId: number, answerId: number): Observable<any> => {
        return this.http
            .delete(`${BASE_API_URL}/answers/${answerId}`, {
                headers: { "X-User-Id": userId },
            })
            .pipe(map((response) => response?.data));
    };

    // --- 4. COMMENTS MANAGEMENT ---

    public getComments = (
        targetType: string,
        targetId: number,
        page: number = 1,
        limit: number = 10
    ): Observable<any> => {
        return this.http
            .get(`${BASE_API_URL}/comments`, {
                params: { targetType, targetId, page, limit },
            })
            .pipe(map((response) => response?.data));
    };

    public addComment = (userId: number, request: CreateCommentRequest): Observable<any> => {
        return this.http
            .post(`${BASE_API_URL}/comments`, request, {
                headers: { "X-User-Id": userId },
            })
            .pipe(map((response) => response?.data));
    };

    public deleteComment = (userId: number, commentId: number): Observable<any> => {
        return this.http
            .delete(`${BASE_API_URL}/comments/${commentId}`, {
                headers: { "X-User-Id": userId },
            })
            .pipe(map((response) => response?.data));
    };

    // --- 5. UTILITIES ---

    public searchTags = (query: string): Observable<any> => {
        return this.http
            .get(`${BASE_API_URL}/tags/search`, {
                params: { query },
            })
            .pipe(map((response) => response?.data));
    };
}

export const postRepositoryCons = (userId: number) => new PostRepository(userId);
