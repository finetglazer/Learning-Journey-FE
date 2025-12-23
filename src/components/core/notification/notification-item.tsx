import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, toDayJs } from "@/lib/utils";
import { InvitationStatus, Notification, NotificationType } from "@/model/notification";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Loader2 } from "lucide-react";
import React from "react";

dayjs.extend(relativeTime);

interface NotificationItemProps {
    notification: Notification;
    onMarkRead: (id: number) => void;
    onMarkUnread: (id: number) => void;
    onDelete: (id: number) => void;
    onAcceptInvitation?: (notification: Notification) => void;
    onDeclineInvitation?: (notification: Notification) => void;
    onView?: (url: string) => void;
    isActionLoading?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onMarkRead,
    onMarkUnread,
    onDelete,
    onAcceptInvitation,
    onDeclineInvitation,
    onView,
    isActionLoading,
}) => {
    const {
        id,
        sender,
        contentMessage,
        createdAt,
        isRead,
        type,
        invitationStatus,
        targetUrl,
    } = notification;

    const isInvitation = type === NotificationType.ACTION_INVITATION;
    const isPendingInvitation = isInvitation && invitationStatus === InvitationStatus.PENDING;

    return (
        <div className={cn(
            "group relative flex gap-3 p-4 hover:bg-gray-50 transition-colors border-b last:border-0",
            !isRead ? "bg-blue-50/30" : "bg-white"
        )}>
            {/* Avatar */}
            <div className="flex-shrink-0 pt-1">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={sender.avatar || ""} alt={sender.name} />
                    <AvatarFallback>{sender.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                {/* Online indicator or icon could go here */}
                {!isRead && (
                    <div className="absolute top-5 left-3 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1">
                <div className="text-sm text-gray-900 break-words leading-snug">
                    <span className="font-semibold">{sender.name}</span>{" "}
                    <span className="text-gray-600">{contentMessage}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{toDayJs(createdAt, 0).fromNow()}</span>

                    {/* Hover Actions */}
                    <div className="hidden group-hover:flex items-center gap-2 transition-opacity">
                        {isRead ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); onMarkUnread(notification.id); }}
                                className="text-blue-500 cursor-pointer hover:text-blue-700 font-medium hover:underline"
                            >
                                Mark unread
                            </button>
                        ) : (
                            <button
                                onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id); }}
                                className="text-blue-500 cursor-pointer hover:text-blue-700 font-medium hover:underline"
                            >
                                Mark as read
                            </button>
                        )}

                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
                            className="text-red-500 cursor-pointer hover:text-red-700 flex items-center gap-1 hover:underline cursor-pointer font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-2">
                    {targetUrl && type === NotificationType.NAVIGATE_VIEW && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => onView && onView(targetUrl)}
                        >
                            View
                        </Button>
                    )}

                    {isPendingInvitation && (
                        <>
                            <Button
                                size="sm"
                                disabled={isActionLoading}
                                className="h-7 text-xs bg-green-500 hover:bg-green-600 text-white border-none flex items-center gap-2"
                                onClick={() => onAcceptInvitation && onAcceptInvitation(notification)}
                            >
                                {isActionLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                                Accept
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isActionLoading}
                                className="h-7 text-xs"
                                onClick={() => onDeclineInvitation && onDeclineInvitation(notification)}
                            >
                                Decline
                            </Button>
                        </>
                    )}
                </div>

                {/* Invitation Result Message */}
                {isInvitation && invitationStatus === InvitationStatus.ACCEPTED && (
                    <div className="text-xs text-green-600 italic">You accepted this invitation.</div>
                )}
                {isInvitation && invitationStatus === InvitationStatus.DECLINED && (
                    <div className="text-xs text-gray-500 italic">You declined this invitation.</div>
                )}
            </div>
        </div>
    );
};
