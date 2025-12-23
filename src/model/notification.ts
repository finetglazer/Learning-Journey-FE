export enum NotificationType {
    INFO = 'INFO',
    NAVIGATE_VIEW = 'NAVIGATE_VIEW',
    ACTION_INVITATION = 'ACTION_INVITATION',
}

export enum InvitationStatus {
    NONE = 'NONE',
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED',
    EXPIRED = 'EXPIRED',
}

export enum NotificationFilter {
    ALL = 'ALL',
    UNREAD = 'UNREAD',
}

export interface NotificationSender {
    id?: number;
    name: string;
    avatar?: string;
}

export interface Notification {
    id: number;
    sender: NotificationSender;
    contentMessage: string;
    type: NotificationType;
    targetUrl?: string;
    invitationStatus?: InvitationStatus;
    token?: string;
    referenceId?: number;
    isRead: boolean;
    createdAt: string;
}
