"use client";

import { Menu, Search, Settings } from 'lucide-react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NotificationBox } from '../notification/notification-box';
import { Notification, NotificationFilter } from '@/model/notification';
import { AppContext } from '@/hooks/app-context';
import { toast } from 'sonner';
import { finalize } from 'rxjs';
import { useNotificationStream } from '@/hooks/use-notification-stream';
import { isNil } from 'lodash';

export interface HeaderBarProps {
    onMenuClick?: () => void;
    onSettingsClick?: () => void;
    avatarUrl?: string;
    onView?: (url: string) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
    onMenuClick,
    onSettingsClick,
    avatarUrl,
    onView = (url) => { console.log(url) },
}) => {
    const { notificationRepository, userId } = useContext(AppContext);

    const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
    const [allNotifications, setAllNotifications] = useState<Notification[]>([]);

    const [unreadPage, setUnreadPage] = useState(1);
    const [allPage, setAllPage] = useState(1);
    const [hasMoreUnread, setHasMoreUnread] = useState(true);
    const [hasMoreAll, setHasMoreAll] = useState(true);
    const [isLoadingGetAll, setIsLoadingGetAll] = useState(false);
    const [isLoadingGetUnread, setIsLoadingGetUnread] = useState(false);

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
                        setAllNotifications(prev => [...prev, ...newNotes]);
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
                        setUnreadNotifications(prev => [...prev, ...newNotes]);
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
            setUnreadNotifications(prev => [newNotification, ...prev]);
            setAllNotifications(prev => [newNotification, ...prev]);
            toast.info(`New notification: ${newNotification.contentMessage}`);
        }
    });

    return (
        <header className="relative flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-5 shadow-sm">

            {/* Left Section: Menu and Logo */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    aria-label="Toggle menu"
                >
                    <Menu size={22} />
                </button>
                <button className="h-8 w-8 cursor-pointer overflow-hidden" aria-label="View profile">
                    <img
                        // Uses the avatarUrl prop, or a placeholder if not provided
                        src={`iconpng.png`}
                        alt="Home Icon"
                        className="h-full w-full object-cover"
                    />
                </button>
            </div>

            {/* Center Section: Search Bar */}
            {/* This uses absolute positioning to ensure it's perfectly centered */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-64 sm:w-96 rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm
                                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Right Section: Icons and Avatar */}
            <div className="flex items-center gap-3">
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