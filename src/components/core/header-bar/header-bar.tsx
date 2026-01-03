"use client";

import { AppContext } from '@/hooks/app-context';
import { useNotificationStream } from '@/hooks/use-notification-stream';
import { InvitationStatus, Notification, NotificationFilter } from '@/model/notification';
import { Search, Settings, Users } from 'lucide-react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { finalize } from 'rxjs';
import { toast } from 'sonner';
import { NotificationBox } from '../notification/notification-box';
import { TeamProjectContext, TeamProjectContextProps } from '../sidebar/pages/project/team-project-context';
import { ProjectMembershipRole } from '@/model/project-management';
import { isNil } from 'lodash';
import { useRouter } from 'next/navigation';
import { COMMUNITY_ROUTE } from '@/const/routes-const';

export interface HeaderBarProps {
    onSettingsClick?: () => void;
    avatarUrl?: string;
    onView?: (url: string) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
    onSettingsClick,
    avatarUrl,
    onView = (url) => { console.log(url) },
}) => {
    const { notificationRepository, userId } = useContext(AppContext);
    const router = useRouter();

    const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
    const [allNotifications, setAllNotifications] = useState<Notification[]>([]);

    const [unreadPage, setUnreadPage] = useState(1);
    const [allPage, setAllPage] = useState(1);
    const [hasMoreUnread, setHasMoreUnread] = useState(true);
    const [hasMoreAll, setHasMoreAll] = useState(true);
    const [isLoadingGetAll, setIsLoadingGetAll] = useState(false);
    const [isLoadingGetUnread, setIsLoadingGetUnread] = useState(false);

    const {
        selectedProject,
        setMembers,
        members,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const handleLoadMoreAll = useCallback(() => {
        if (isLoadingGetAll || !hasMoreAll || !notificationRepository) return;
        setIsLoadingGetAll(true);

        const nextPage = allPage + 1;
        notificationRepository.getNotifications({
            filter: NotificationFilter.ALL,
            page: nextPage,
            limit: 50
        })
            .pipe(finalize(() => setIsLoadingGetAll(false)))
            .subscribe({
                next: (res) => {
                    if (res?.status) {
                        const newNotes = res.data?.notifications || [];
                        if (newNotes.length < 50) setHasMoreAll(false);
                        setAllNotifications(prev => {
                            const newUniqueNotes = newNotes.filter((n: Notification) => !prev.some(p => p.id === n.id));
                            return [...prev, ...newUniqueNotes];
                        });
                        setAllPage(nextPage);
                    }
                    else {
                        toast.error(res?.message || res?.msg);
                    }
                },
                error: () => { }
            });
    }, [
        isLoadingGetAll,
        hasMoreAll,
        notificationRepository,
        allPage,
    ]);

    const handleLoadMoreUnread = useCallback(() => {
        if (isLoadingGetUnread || !hasMoreUnread || !notificationRepository) return;
        setIsLoadingGetUnread(true);

        const nextPage = unreadPage + 1;
        const subscription = notificationRepository.getNotifications({
            filter: NotificationFilter.UNREAD,
            page: nextPage,
            limit: 50
        })
            .pipe(finalize(() => setIsLoadingGetUnread(false)))
            .subscribe({
                next: (res) => {
                    if (res?.status) {
                        const newNotes = res.data?.notifications || [];
                        if (newNotes.length < 50) setHasMoreUnread(false);
                        setUnreadNotifications(prev => {
                            const newUniqueNotes = newNotes.filter((n: Notification) => !prev.some(p => p.id === n.id));
                            return [...prev, ...newUniqueNotes];
                        });
                        setUnreadPage(nextPage);
                    }
                },
                error: () => { }
            });

        return () => {
            subscription.unsubscribe();
        }
    }, [
        isLoadingGetUnread,
        hasMoreUnread,
        notificationRepository,
        unreadPage,
    ]);

    const getAllNotifications = useCallback(() => {
        if (isLoadingGetAll || !notificationRepository) {
            return;
        }

        const subscription = notificationRepository.getNotifications({
            filter: NotificationFilter.ALL,
            page: 1,
            limit: 50
        })
            .pipe(finalize(() => setIsLoadingGetAll(false)))
            .subscribe({
                next: (res) => {
                    if (res?.status) {
                        const data = res.data?.notifications || [];
                        setAllNotifications(data);
                        if (data.length < 50) setHasMoreAll(false);
                    }
                    else {
                        toast.error(res?.message || res?.msg);
                    }
                },
                error: () => { }
            });

        return () => {
            subscription.unsubscribe();
        }
    }, [
        isLoadingGetAll,
        notificationRepository,
    ]);

    const getUnreadNotifications = useCallback(() => {
        if (isLoadingGetUnread || !notificationRepository) {
            return;
        }

        const subscription = notificationRepository.getNotifications({
            filter: NotificationFilter.UNREAD,
            page: 1,
            limit: 50
        })
            .pipe(finalize(() => setIsLoadingGetUnread(false)))
            .subscribe({
                next: (res) => {
                    if (res?.status) {
                        const data = res.data?.notifications || [];
                        setUnreadNotifications(data);
                        if (data.length < 50) setHasMoreUnread(false);
                    }
                    else {
                        toast.error(res?.message || res?.msg);
                    }
                },
                error: () => { }
            });

        return () => {
            subscription.unsubscribe();
        }
    }, [
        isLoadingGetUnread,
        notificationRepository,
    ]);

    // Initial Fetch
    useEffect(() => {
        const cleanupAll = getAllNotifications();
        const cleanupUnread = getUnreadNotifications();
        return () => {
            if (cleanupAll) cleanupAll();
            if (cleanupUnread) cleanupUnread();
        }
    }, [notificationRepository]);

    // SSE Connection via Custom Hook
    useNotificationStream({
        userId: userId ?? null,
        onNewNotification: (newNotification) => {
            if (selectedProject?.id === newNotification.referenceId) {
                const invitationStatus = newNotification.invitationStatus;
                if (invitationStatus === InvitationStatus.ACCEPTED) {
                    // Member is already in the project with INVITED status, now change to MEMBER
                    const updateMember = members.find(m => m.userId === newNotification.sender.id);
                    if (updateMember) {
                        updateMember.role = ProjectMembershipRole.MEMBER;
                        const updatedMembers = [...members];
                        const i = updatedMembers.findIndex(m => m.userId === updateMember.userId);
                        if (!isNil(i)) {
                            updatedMembers[i] = updateMember;
                            setMembers(updatedMembers);
                        }
                    }
                }
                else if (invitationStatus === InvitationStatus.DECLINED || invitationStatus === InvitationStatus.EXPIRED) {
                    // Member is already in the project with INVITED status, now remove that person
                    const updatedMembers = [...members];
                    const i = updatedMembers.findIndex(m => m.userId === newNotification.sender.id);
                    if (!isNil(i)) {
                        updatedMembers.splice(i, 1);
                        setMembers(updatedMembers);
                    }
                }
            }
            setUnreadNotifications(prev => {
                if (prev.some(n => n.id === newNotification.id)) return prev;
                return [newNotification, ...prev];
            });
            setAllNotifications(prev => {
                if (prev.some(n => n.id === newNotification.id)) return prev;
                return [newNotification, ...prev];
            });
            toast.info(`New notification: ${newNotification.contentMessage}`);
        }
    });

    return (
        <header className="relative flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-5 shadow-sm">

            {/* Left Section: Menu and Logo */}
            <div className="flex items-center gap-3">
                <button className="h-8 w-8 cursor-pointer overflow-hidden" aria-label="View profile">
                    <img
                        // Uses the avatarUrl prop, or a placeholder if not provided
                        src={`iconpng.png`}
                        alt="Home Icon"
                        className="h-full w-full object-cover"
                    />
                </button>
            </div>


            {/* Right Section: Icons and Avatar */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.push(COMMUNITY_ROUTE)}
                    className="p-2 rounded-full cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    aria-label="Community"
                >
                    <Users size={20} />
                </button>
                <div className="relative">
                    <NotificationBox
                        unreadNotifications={unreadNotifications}
                        allNotifications={allNotifications}
                        setUnreadNotifications={setUnreadNotifications}
                        setAllNotifications={setAllNotifications}
                        isLoadingGetAll={isLoadingGetAll}
                        isLoadingGetUnread={isLoadingGetUnread}
                        hasMoreUnread={hasMoreUnread}
                        hasMoreAll={hasMoreAll}
                        onLoadMoreUnread={handleLoadMoreUnread}
                        onLoadMoreAll={handleLoadMoreAll}
                        onView={onView}
                    />
                </div>
                <button
                    onClick={onSettingsClick}
                    className="p-2 rounded-full cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    aria-label="View settings"
                >
                    <Settings size={20} />
                </button>

                {/* Avatar */}
                <button className="h-8 w-8 rounded-full overflow-hidden border border-gray-300" aria-label="View profile">
                    <img
                        // Uses the avatarUrl prop, or a placeholder if not provided
                        src={avatarUrl || `https://placehold.co/32x32/E2E8F0/64748B?text=U`}
                        alt="User Avatar"
                        className="h-full w-full object-cover"
                    />
                </button>
            </div>
        </header>
    );
};