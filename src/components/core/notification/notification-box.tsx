import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppContext } from "@/hooks/app-context";
import { Notification, NotificationType, InvitationStatus } from "@/model/notification";
import { Bell, Check, Loader2, Trash2 } from "lucide-react";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import InfiniteScrollComponent from "react-infinite-scroll-component";
const InfiniteScroll = InfiniteScrollComponent as any;
import { toast } from "sonner";
import { NotificationItem } from "./notification-item";
import { finalize } from "rxjs";

interface NotificationBoxProps {
    unreadNotifications: Notification[];
    allNotifications: Notification[];
    setUnreadNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    setAllNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    isLoadingGetAll?: boolean;
    isLoadingGetUnread?: boolean;
    hasMoreUnread?: boolean;
    hasMoreAll?: boolean;
    onLoadMoreUnread?: () => void;
    onLoadMoreAll?: () => void;
    onView?: (url: string) => void;
}

export const NotificationBox: React.FC<NotificationBoxProps> = ({
    unreadNotifications,
    allNotifications,
    setUnreadNotifications,
    setAllNotifications,
    isLoadingGetAll,
    isLoadingGetUnread,
    hasMoreUnread,
    hasMoreAll,
    onLoadMoreUnread,
    onLoadMoreAll,
    onView,
}) => {
    const { notificationRepository, projectRepository, getProjects } = useContext(AppContext);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("inbox");
    const [loadingNotificationId, setLoadingNotificationId] = useState<number | null>(null);
    const unreadCount = unreadNotifications.length;

    // Stable callback functions for InfiniteScroll to prevent warnings
    const noOpLoadMore = useMemo(() => () => { }, []);

    const handleDeleteReadNotifications = useCallback(() => {
        const numberOfReadNotifications = allNotifications.filter(n => n.isRead && n.invitationStatus !== InvitationStatus.NONE && n.invitationStatus !== InvitationStatus.PENDING).length;
        if (!notificationRepository || numberOfReadNotifications === 0) {
            return;
        }
        const subscription = notificationRepository.clearReadNotifications().subscribe({
            next: (res) => {
                if (res?.status) {
                    setAllNotifications(prev => prev.filter(n => n.isRead === false));
                    toast.success(res?.message || res?.msg);
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: () => { },
        });

        return () => subscription.unsubscribe();
    }, [
        notificationRepository,
        allNotifications,
    ]);

    const handleUpdateReadStatus = useCallback((id: number, isRead: boolean) => {
        if (!notificationRepository) {
            return;
        }
        const subscription = notificationRepository.updateReadStatus({ notificationId: id }, { isRead }).subscribe({
            next: (res) => {
                if (res?.status) {
                    const notification = allNotifications.find(n => n.id === id);
                    if (notification) {
                        if (!isRead) {
                            const updated = { ...notification, isRead: false };
                            setUnreadNotifications(prev => [updated, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
                        }
                        else {
                            setUnreadNotifications(prev => prev.filter(n => n.id !== id));
                        }
                        setAllNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: isRead } : n));
                    }
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: () => { }
        });

        return () => subscription.unsubscribe();
    }, [
        notificationRepository,
        allNotifications,
    ]);

    const handleMarkAllRead = useCallback(() => {
        if (!notificationRepository) {
            return;
        }
        const subscription = notificationRepository.markAllAsRead().subscribe({
            next: (res) => {
                if (res?.status) {
                    setUnreadNotifications([]);
                    setAllNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                    toast.success(res?.message || res?.msg);
                }
            },
            error: () => { },
        });

        return () => subscription.unsubscribe();
    }, [
        notificationRepository,
    ]);

    const handleDelete = useCallback((id: number) => {
        if (!notificationRepository) {
            return;
        }
        const subscription = notificationRepository.deleteNotification({
            notificationId: id,
        }).subscribe({
            next: (res) => {
                if (res?.status) {
                    setUnreadNotifications(prev => prev.filter(n => n.id !== id));
                    setAllNotifications(prev => prev.filter(n => n.id !== id));
                    toast.success(res?.message || res?.msg);
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: () => { },
        });

        return () => subscription.unsubscribe();
    }, [
        notificationRepository,
    ]);

    const handleAcceptInvitation = useCallback((notification: Notification) => {
        if (!projectRepository) {
            return;
        }

        setLoadingNotificationId(notification.id);
        const subscription = projectRepository.acceptInvitation({
            projectId: notification.referenceId,
        }, {
            token: notification.token,
        })
            .pipe(finalize(() => setLoadingNotificationId(null)))
            .subscribe({
                next: (res) => {
                    if (res?.status) {
                        toast.success(res?.message || res?.msg);
                        // Remove invitation notification
                        setUnreadNotifications(prev => prev.filter(n => n.id !== notification.id));
                        setAllNotifications(prev => prev.filter(n => n.id !== notification.id));
                        // Reload the team projects list
                        getProjects();
                        // Close the notification popover
                        setIsOpen(false);
                        // Navigate to the project summary page
                        router.push(`/projects/${notification.referenceId}?tab=summary`);
                    }
                    else {
                        toast.error(res?.message || res?.msg);
                    }
                },
                error: err => { }
            });

        return () => subscription.unsubscribe();
    }, [
        projectRepository,
        unreadNotifications,
        allNotifications,
        getProjects,
        router,
    ]);

    const handleDeclineInvitation = useCallback((notification: Notification) => {
        if (!projectRepository) {
            return;
        }

        setLoadingNotificationId(notification.id);
        const subscription = projectRepository.declineInvitation({
            projectId: notification.referenceId,
        }, {
            token: notification.token,
        })
            .pipe(finalize(() => setLoadingNotificationId(null)))
            .subscribe({
                next: (res) => {
                    if (res?.status) {
                        toast.success(res?.message || res?.msg);
                        // Remove invitation notification
                        setUnreadNotifications(prev => prev.filter(n => n.id !== notification.id));
                        setAllNotifications(prev => prev.filter(n => n.id !== notification.id));
                    }
                    else {
                        toast.error(res?.message || res?.msg);
                    }
                },
                error: err => { }
            });

        return () => subscription.unsubscribe();
    }, [
        projectRepository,
        unreadNotifications,
        allNotifications,
    ]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="relative p-2 rounded-full h-10 w-10 cursor-pointer">
                    <Bell size={20} className="text-gray-600" />
                    {unreadCount > 0 && (
                        <Badge className="absolute top-1 right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 hover:bg-red-600 border-2 border-white text-[10px]">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[450px] p-0 shadow-xl border-gray-200 rounded-[15px] overflow-hidden" align="end">
                <Tabs defaultValue="inbox" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white rounded-t-[15px]">
                        <TabsList className="bg-transparent p-0 h-auto gap-4">
                            <TabsTrigger
                                value="inbox"
                                className="bg-transparent p-0 pb-1 cursor-pointer rounded-none border-b-2 border-transparent data-[state=active]:border-b-[#91FFD9] data-[state=active]:text-[#91FFD9] data-[state=active]:shadow-none font-semibold text-gray-500 transition-all hover:text-gray-900"
                            >
                                Inbox
                                {unreadCount > 0 && (
                                    <span className="ml-2 bg-[#91FFD9]/20 text-[#91FFD9] text-xs px-1.5 py-0.5 rounded-sm">
                                        {unreadCount}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger
                                value="all"
                                className="bg-transparent p-0 pb-1 cursor-pointer rounded-none border-b-2 border-transparent data-[state=active]:border-b-[#91FFD9] data-[state=active]:text-[#91FFD9] data-[state=active]:shadow-none font-semibold text-gray-500 transition-all hover:text-gray-900"
                            >
                                All
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* ACTIONS BAR */}
                    <div className="bg-gray-50/50 border-b border-gray-100 px-4 py-2 flex justify-center">
                        {activeTab === "inbox" ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-gray-600 h-8 text-xs font-normal cursor-pointer border-gray-300 hover:bg-gray-50"
                                onClick={handleMarkAllRead}
                                disabled={unreadCount === 0}
                            >
                                Mark all as read
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-gray-600 h-8 text-xs font-normal cursor-pointer border-gray-300 hover:bg-gray-50"
                                onClick={handleDeleteReadNotifications}
                            >
                                Clear read notifications
                            </Button>
                        )}
                    </div>

                    <ScrollArea
                        className="h-[400px] w-full bg-white"
                        viewportId="notification-scroll-viewport"
                    >
                        {/* INBOX CONTENT TAB */}
                        <TabsContent value="inbox" className="m-0 focus-visible:ring-0">
                            {unreadNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                    <Bell className="w-12 h-12 mb-3 stroke-1 opacity-20" />
                                    <p className="text-sm">No new notifications</p>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <InfiniteScroll
                                        dataLength={unreadNotifications.length}
                                        next={onLoadMoreUnread || noOpLoadMore}
                                        hasMore={hasMoreUnread === true}
                                        loader={
                                            <div className="h-4 w-full flex items-center justify-center p-2">
                                                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                            </div>
                                        }
                                        scrollableTarget="notification-scroll-viewport"
                                        scrollThreshold={0.9}
                                        style={{ overflow: 'visible' }}
                                        endMessage={
                                            <p className="text-center text-xs text-gray-400 py-2">
                                                No more notifications
                                            </p>
                                        }
                                    >
                                        {unreadNotifications.map((notification: Notification) => {
                                            let contentMessage = notification.contentMessage;

                                            // Customize message for invitations based on status
                                            if (notification.type === NotificationType.ACTION_INVITATION) {
                                                if (notification.invitationStatus === InvitationStatus.ACCEPTED) {
                                                    contentMessage = "You have accepted this invitation.";
                                                } else if (notification.invitationStatus === InvitationStatus.DECLINED) {
                                                    contentMessage = "You have declined this invitation.";
                                                } else if (notification.invitationStatus === InvitationStatus.EXPIRED) {
                                                    contentMessage = "This invitation has expired.";
                                                }
                                            }

                                            return (
                                                <NotificationItem
                                                    key={notification.id}
                                                    notification={{
                                                        ...notification,
                                                        contentMessage: contentMessage
                                                    }}
                                                    onMarkRead={(id) => handleUpdateReadStatus(id, true)}
                                                    onMarkUnread={(id) => handleUpdateReadStatus(id, false)}
                                                    onDelete={handleDelete}
                                                    onAcceptInvitation={handleAcceptInvitation}
                                                    onDeclineInvitation={handleDeclineInvitation}
                                                    onView={onView}
                                                    isActionLoading={loadingNotificationId === notification.id}
                                                />
                                            )
                                        })}
                                    </InfiniteScroll>
                                </div>
                            )}
                        </TabsContent>

                        {/* ALL CONTENT TAB */}
                        <TabsContent value="all" className="m-0 focus-visible:ring-0">
                            {allNotifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                    <Bell className="w-12 h-12 mb-3 stroke-1 opacity-20" />
                                    <p className="text-sm">No notifications</p>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <InfiniteScroll
                                        dataLength={allNotifications.length}
                                        next={onLoadMoreAll || noOpLoadMore}
                                        hasMore={hasMoreAll === true}
                                        loader={
                                            <div className="h-4 w-full flex items-center justify-center p-2">
                                                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                            </div>
                                        }
                                        scrollableTarget="notification-scroll-viewport"
                                        scrollThreshold={0.9}
                                        style={{ overflow: 'visible' }}
                                        endMessage={
                                            <p className="text-center text-xs text-gray-400 py-2">
                                                No more notifications
                                            </p>
                                        }
                                    >
                                        {allNotifications.map((notification) => {
                                            let contentMessage = notification.contentMessage;

                                            // Customize message for invitations based on status
                                            if (notification.type === NotificationType.ACTION_INVITATION) {
                                                if (notification.invitationStatus === InvitationStatus.ACCEPTED) {
                                                    contentMessage = "You have accepted this invitation.";
                                                } else if (notification.invitationStatus === InvitationStatus.DECLINED) {
                                                    contentMessage = "You have declined this invitation.";
                                                } else if (notification.invitationStatus === InvitationStatus.EXPIRED) {
                                                    contentMessage = "This invitation has expired.";
                                                }
                                            }

                                            return (
                                                <NotificationItem
                                                    key={notification.id}
                                                    notification={{
                                                        ...notification,
                                                        contentMessage: contentMessage
                                                    }}
                                                    onMarkRead={(id) => handleUpdateReadStatus(id, true)}
                                                    onMarkUnread={(id) => handleUpdateReadStatus(id, false)}
                                                    onDelete={handleDelete}
                                                    onAcceptInvitation={handleAcceptInvitation}
                                                    onDeclineInvitation={handleDeclineInvitation}
                                                    onView={onView}
                                                    isActionLoading={loadingNotificationId === notification.id}
                                                />
                                            )
                                        })}
                                    </InfiniteScroll>
                                </div>
                            )}
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </PopoverContent>
        </Popover>
    );
};
