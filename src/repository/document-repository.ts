import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BaseRepository } from "./base-repository";
import {
    NotionDocDTO,
    DocVersionDTO,
    CreateNotionDocRequest,
    DocumentDTO,
} from "@/model/document";

interface BaseResponse<T> {
    status: number;
    msg: string;
    data: T;
};

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export class DocumentRepository extends BaseRepository {
    constructor(userId: number) {
        super(userId, BASE_API_URL);
    }

    /**
     * Create a new Notion document
     */
    createDocument(
        projectId: number,
        request: CreateNotionDocRequest
    ): Observable<BaseResponse<NotionDocDTO>> {
        return this.http
            .post<BaseResponse<NotionDocDTO>>(
                `/pm/projects/${projectId}/files/document`,
                request
            )
            .pipe(map((response) => response.data));
    }

    /**
     * Get document details (for opening editor)
     */
    getDocumentDetails(nodeId: number): Observable<NotionDocDTO> {
        return this.http
            .get<BaseResponse<NotionDocDTO>>(`/pm/files/${nodeId}`)
            .pipe(map((response) => response.data.data)); // This returns NotionDocDTO
    }

    /**
     * Get version history for a document
     */
    getVersionHistory(nodeId: number): Observable<DocVersionDTO[]> {
        return this.http
            .get<BaseResponse<{ versions: DocVersionDTO[] }>>(
                `/pm/files/${nodeId}/history`
            )
            // OLD (Error):
            // .pipe(map((response) => response.data.versions));

            // NEW (Fixed):
            .pipe(map((response) => response.data.data.versions));
    }
    /**
     * Restore a specific version
     */
    // ✅ FIX: Change versionId type to string
    restoreVersion(nodeId: number, versionId: string): Observable<void> {
        return this.http
            .post<BaseResponse<void>>(
                `/pm/files/${nodeId}/history/${versionId}/restore`,
                {}
            )
            .pipe(map(() => undefined));
    }

    /**
     * Get snapshot content for preview
     */
    getSnapshotContent(
        nodeId: number,
        snapshotRef: string
    ): Observable<BaseResponse<DocumentDTO>> {
        return this.http
            .get<BaseResponse<DocumentDTO>>(
                `/pm/files/${nodeId}/snapshots/${snapshotRef}`
            )
            .pipe(map((response) => response.data));
    }

    updateDocument(nodeId: number, data: { name?: string }): Observable<BaseResponse<NotionDocDTO>> {
        return this.http
            .patch<BaseResponse<NotionDocDTO>>(`/pm/files/${nodeId}`, data)
            .pipe(map((response) => response.data));
    }

    getSnapshotList(storageRef: string): Observable<any[]> {
        return this.http
            .get<BaseResponse<any[]>>(`/document/${storageRef}/snapshots`)
            .pipe(map((response) => {
                // Axios response -> Body (BaseResponse) -> Data field (The List)
                return response.data.data || [];
            }));
    }
}

export const documentRepositoryCons = (userId: number) => new DocumentRepository(userId);