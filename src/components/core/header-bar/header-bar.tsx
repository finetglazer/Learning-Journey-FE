"use client";

import { AppContext } from '@/hooks/app-context';
import { useNotificationStream } from '@/hooks/use-notification-stream';
import { InvitationStatus, Notification, NotificationFilter } from '@/model/notification';
import { Settings, BookMarked } from 'lucide-react';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { finalize } from 'rxjs';
import { toast } from 'sonner';
import { NotificationBox } from '../notification/notification-box';
import { TeamProjectContext, TeamProjectContextProps } from '../sidebar/pages/project/team-project-context';
import { ProjectMembershipRole } from '@/model/project-management';
import { isNil } from 'lodash';
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Daily inspirational quotes about learning
const LEARNING_QUOTES = [
    "The more you learn, the more you earn.",
    "Learning is a treasure that follows its owner everywhere.",
    "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    "Education is not the filling of a pail, but the lighting of a fire.",
    "The beautiful thing about learning is that no one can take it away from you.",
    "An investment in knowledge pays the best interest.",
    "Learning never exhausts the mind.",
    "The only thing that interferes with my learning is my education.",
    "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    "Anyone who stops learning is old, whether at twenty or eighty.",
    "Learning is not attained by chance, it must be sought for with ardor and diligence.",
    "The more I read, the more I acquire, the more certain I am that I know nothing.",
    "It is not that I'm so smart. But I stay with the questions much longer.",
    "The expert in anything was once a beginner.",
    "Knowledge is power. Information is liberating.",
    "A person who never made a mistake never tried anything new.",
    "The roots of education are bitter, but the fruit is sweet.",
    "Self-education is, I firmly believe, the only kind of education there is.",
    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    "The mind is not a vessel to be filled, but a fire to be kindled.",
    "Learning is the eye of the mind.",
    "Every expert was once a beginner.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "Success is no accident. It is hard work, perseverance, learning.",
    "Never stop learning, because life never stops teaching.",
    "The journey of a thousand miles begins with one step.",
    "Study hard what interests you the most in the most undisciplined way.",
    "Wisdom is not a product of schooling but of the lifelong attempt to acquire it.",
    "Learning is a lifelong process of keeping abreast of change.",
    "The greatest glory in living lies not in never falling, but in rising every time we fall.",
];

// Get quote based on current day of the year
const getDailyQuote = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return LEARNING_QUOTES[dayOfYear % LEARNING_QUOTES.length];
};

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

    const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
    const [allNotifications, setAllNotifications] = useState<Notification[]>([]);

    const [unreadPage, setUnreadPage] = useState(1);
    const [allPage, setAllPage] = useState(1);
    const [hasMoreUnread, setHasMoreUnread] = useState(true);
    const [hasMoreAll, setHasMoreAll] = useState(true);
    const [isLoadingGetAll, setIsLoadingGetAll] = useState(false);
    const [isLoadingGetUnread, setIsLoadingGetUnread] = useState(false);
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);

    const {
        selectedProject,
        setMembers,
        members,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    // Get the daily inspirational quote
    const dailyQuote = useMemo(() => getDailyQuote(), []);
    const quoteRef = useRef<HTMLDivElement>(null);
    const quoteButtonRef = useRef<HTMLButtonElement>(null);
    const [quotePosition, setQuotePosition] = useState({ top: 0, left: 0 });

    // Close quote popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (quoteRef.current && !quoteRef.current.contains(event.target as Node) &&
                quoteButtonRef.current && !quoteButtonRef.current.contains(event.target as Node)) {
                setIsQuoteOpen(false);
            }
        };

        const updatePosition = () => {
            if (quoteButtonRef.current) {
                const rect = quoteButtonRef.current.getBoundingClientRect();
                setQuotePosition({
                    top: rect.bottom + 8,
                    left: rect.left + rect.width / 2
                });
            }
        };

        if (isQuoteOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            updatePosition();
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isQuoteOpen]);

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
                    <Image
                        // Uses the avatarUrl prop, or a placeholder if not provided
                        src={`/iconpng.png`}
                        alt="Home Icon"
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                    />
                </button>
            </div>

            {/* Center Section: App Name and Daily Quote Icon */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-800 tracking-wide">
                    Learning Journey
                </h1>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            ref={quoteButtonRef}
                            className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                            onClick={() => setIsQuoteOpen(!isQuoteOpen)}
                            aria-label="Daily inspirational quote"
                        >
                            <BookMarked size={20} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Daily wisdom for learners ✨
                    </TooltipContent>
                </Tooltip>

                {/* Quote Popover - rendered via portal to escape stacking context */}
                {isQuoteOpen && createPortal(
                    <div
                        ref={quoteRef}
                        className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-5 min-w-80 max-w-lg"
                        style={{
                            top: quotePosition.top,
                            left: quotePosition.left,
                            transform: 'translateX(-50%)',
                            zIndex: 999999
                        }}
                    >
                        <p className="text-sm text-gray-600 italic text-center leading-relaxed">
                            &quot;{dailyQuote}&quot;
                        </p>
                        <p className="text-xs text-gray-400 text-center mt-3">
                            — Today&apos;s Quote
                        </p>
                    </div>,
                    document.body
                )}
            </div>


            {/* Right Section: Icons and Avatar */}
            <div className="flex items-center gap-3">
                <Tooltip>
                    <TooltipTrigger asChild>
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
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Notifications
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={onSettingsClick}
                            className="p-2 rounded-full cursor-pointer text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            aria-label="View settings"
                        >
                            <Settings size={20} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Settings
                    </TooltipContent>
                </Tooltip>

                {/* Avatar */}
                <button className="h-8 w-8 rounded-full overflow-hidden border border-gray-300" aria-label="View profile">
                    <Image
                        // Uses the avatarUrl prop, or a placeholder if not provided
                        src={avatarUrl || `https://placehold.co/32x32/E2E8F0/64748B?text=U`}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                        unoptimized // Safe for external URLs
                    />
                </button>
            </div>
        </header>
    );
};