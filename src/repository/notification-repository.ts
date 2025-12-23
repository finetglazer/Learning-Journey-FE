import { map, Observable } from "rxjs";
import { BaseRepository } from "./base-repository";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL + "/notifications";

export class NotificationRepository extends BaseRepository {
    constructor(userId: number) {
        super(userId, BASE_API_URL);
    };

    /**
     * Fetch notifications with pagination and filtering
     * Corresponds to: GET /api/notifications
     */
    public getNotifications = (params: { filter?: string, page?: number, limit?: number }): Observable<any> => {
        return this.http.get("", {
            params: {
                filter: params.filter || "ALL",
                page: params.page || 1,
                limit: params.limit || 50,
            }
        })
            .pipe(map(res => res?.data));
    };

    /**
     * Update read status of a notification
     * Corresponds to: PATCH /api/notifications/{notificationId}/read
     */
    public updateReadStatus = (params: { notificationId: number | string }, body: { isRead: boolean }): Observable<any> => {
        return this.http.patch(`/${params.notificationId}/read`, body)
            .pipe(map(res => res?.data));
    };

    /**
     * Mark all notifications as read
     * Corresponds to: PUT /api/notifications/mark-all-read
     */
    public markAllAsRead = (): Observable<any> => {
        return this.http.put(`/mark-all-read`)
            .pipe(map(res => res?.data));
    };

    /**
     * Clear (delete) all read notifications
     * Corresponds to: DELETE /api/notifications/read
     */
    public clearReadNotifications = (): Observable<any> => {
        return this.http.delete(`/read`)
            .pipe(map(res => res?.data));
    };

    /**
     * Delete a specific notification
     * Corresponds to: DELETE /api/notifications/{notificationId}
     */
    public deleteNotification = (params: { notificationId: number | string }): Observable<any> => {
        return this.http.delete(`/${params.notificationId}`)
            .pipe(map(res => res?.data));
    };
}

export const notificationRepositoryCons = (userId: number) => new NotificationRepository(userId);
