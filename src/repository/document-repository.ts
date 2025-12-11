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
}

class DocumentRepository extends BaseRepository {
    constructor() {
        super();
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
                `/api/pm/projects/${projectId}/files/document`,
                request
            )
            .pipe(map((response) => response.data));
    }

    /**
     * Get document details (for opening editor)
     */
    getDocumentDetails(nodeId: number): Observable<NotionDocDTO> {
        return this.http
            .get<BaseResponse<NotionDocDTO>>(`/api/pm/files/${nodeId}`)
            .pipe(map((response) => response.data.data)); // This returns NotionDocDTO
    }

    /**
     * Get version history for a document
     */
    getVersionHistory(nodeId: number): Observable<DocVersionDTO[]> {
        return this.http
            .get<BaseResponse<{ versions: DocVersionDTO[] }>>(
                `/api/pm/files/${nodeId}/history`
            )
            // OLD (Error):
            // .pipe(map((response) => response.data.versions));

            // NEW (Fixed):
            .pipe(map((response) => response.data.data.versions));
    }
    /**
     * Restore a specific version
     */
    restoreVersion(nodeId: number, versionId: number): Observable<void> {
        return this.http
            .post<BaseResponse<void>>(
                `/api/pm/files/${nodeId}/history/${versionId}/restore`,
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
                `/api/pm/files/${nodeId}/snapshots/${snapshotRef}`
            )
            .pipe(map((response) => response.data));
    }
}

export const documentRepository = new DocumentRepository();