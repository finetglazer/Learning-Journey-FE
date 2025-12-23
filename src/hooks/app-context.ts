"use client";

import { AuthRepository, authRepositoryCons } from "@/repository/auth-repository";
import { CalendarRepository, calendarRepositoryCons } from "@/repository/calendar-repository";
import { DocumentRepository, documentRepositoryCons } from "@/repository/document-repository";
import { ProjectRepository, projectRepositoryCons } from "@/repository/project-repository";
import { SettingsRepository, settingsRepositoryCons } from "@/repository/settings-repository";
import { UserRepository, userRepositoryCons } from "@/repository/user-repository";
import { isNil } from "lodash";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { NotificationRepository, notificationRepositoryCons } from "@/repository/notification-repository";

export interface SleepHour {
    startTime: string;  // HH:mm
    endTime: string;    // HH:mm
}

export interface AppContextProps {
    userId: number | null;
    setUserId: Dispatch<SetStateAction<number | null>>;
    loadingPage: boolean;
    setLoadingPage: Dispatch<SetStateAction<boolean>>;
    sleepHours: SleepHour[];
    setSleepHours: Dispatch<SetStateAction<SleepHour[]>>;
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
    avatarUrl: string;
    setAvatarUrl: Dispatch<SetStateAction<string>>;
    displayName: string;
    setDisplayName: Dispatch<SetStateAction<string>>;
    darkBg: boolean;
    setDarkBg: Dispatch<SetStateAction<boolean>>;
    dailyLimitsEnabled: boolean;
    setDailyLimitsEnabled: Dispatch<SetStateAction<boolean>>;
    taskLimitHours: number | null;
    setTaskLimitHours: Dispatch<SetStateAction<number | null>>;
    routineLimitHours: number | null;
    setRoutineLimitHours: Dispatch<SetStateAction<number | null>>;
    timezone: {
        label: string;
        value: string;
        utc: string;
    } | null;
    setTimeZone: Dispatch<SetStateAction<{
        label: string;
        value: string;
        utc: string;
    } | null>>;
    calendarId: number | null;
    setCalendarId: Dispatch<SetStateAction<number | null>>;

    // Repositories
    authRepository: AuthRepository | null;
    calendarRepository: CalendarRepository | null;
    documentRepository: DocumentRepository | null;
    notificationRepository: NotificationRepository | null;
    projectRepository: ProjectRepository | null;
    settingsRepository: SettingsRepository | null;
    userRepository: UserRepository | null;
    teamProjects: any[];
    setTeamProjects: Dispatch<SetStateAction<any[]>>;
    getProjects: () => void;
};

export const AppContext = createContext<AppContextProps>({
    userId: null,
    setUserId: () => { },
    loadingPage: false,
    setLoadingPage: () => { },
    sleepHours: [],
    setSleepHours: () => { },
    email: "",
    setEmail: () => { },
    avatarUrl: "",
    setAvatarUrl: () => { },
    displayName: "",
    setDisplayName: () => { },
    darkBg: false,
    setDarkBg: () => { },
    dailyLimitsEnabled: false,
    setDailyLimitsEnabled: () => { },
    taskLimitHours: null,
    setTaskLimitHours: () => { },
    routineLimitHours: null,
    setRoutineLimitHours: () => { },
    timezone: null,
    setTimeZone: () => { },
    calendarId: null,
    setCalendarId: () => { },

    // Repositories
    authRepository: null,
    calendarRepository: null,
    documentRepository: null,
    notificationRepository: null,
    projectRepository: null,
    settingsRepository: null,
    userRepository: null,
    teamProjects: [],
    setTeamProjects: () => { },
    getProjects: () => { },
});

export const useAppHooks = (): AppContextProps => {
    const [userId, setUserId] = useState<number | null>(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = Cookies.get("userId");
            return storedUserId ? Number(storedUserId) : null;
        }
        return null;
    });

    const [loadingPage, setLoadingPage] = useState<boolean>(false);
    const [sleepHours, setSleepHours] = useState<SleepHour[]>([]);
    const [email, setEmail] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [darkBg, setDarkBg] = useState<boolean>(false);
    const [dailyLimitsEnabled, setDailyLimitsEnabled] = useState<boolean>(true);
    const [taskLimitHours, setTaskLimitHours] = useState<number | null>(null);
    const [routineLimitHours, setRoutineLimitHours] = useState<number | null>(null);
    const [calendarId, setCalendarId] = useState<number | null>(null);
    const [timezone, setTimeZone] = useState<{
        label: string;
        value: string;
        utc: string;
    } | null>(null);

    const [authRepository, setAuthRepository] = useState<AuthRepository | null>(null);
    const [calendarRepository, setCalendarRepository] = useState<CalendarRepository | null>(null);
    const [documentRepository, setDocumentRepository] = useState<DocumentRepository | null>(null);
    const [notificationRepository, setNotificationRepository] = useState<NotificationRepository | null>(null);
    const [projectRepository, setProjectRepository] = useState<ProjectRepository | null>(null);
    const [settingsRepository, setSettingsRepository] = useState<SettingsRepository | null>(null);
    const [userRepository, setUserRepository] = useState<UserRepository | null>(null);

    const [teamProjects, setTeamProjects] = useState<any[]>([]);

    useEffect(() => {
        if (isNil(userId)) {
            Cookies.remove("userId");
            setAuthRepository(authRepositoryCons(-1));

            setCalendarRepository(null);
            setDocumentRepository(null);
            setProjectRepository(null);
            setSettingsRepository(null);
            setUserRepository(null);
            setNotificationRepository(null);
            return;
        }

        Cookies.set("userId", String(userId), { expires: 7, secure: true, sameSite: 'strict' });

        setAuthRepository(authRepositoryCons(userId));
        setCalendarRepository(calendarRepositoryCons(userId));
        setDocumentRepository(documentRepositoryCons(userId));
        setProjectRepository(projectRepositoryCons(userId));
        setSettingsRepository(settingsRepositoryCons(userId));
        setNotificationRepository(notificationRepositoryCons(userId));
        setUserRepository(userRepositoryCons(userId));
    }, [userId]);

    // Centralized Data Fetching
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (!userRepository || !settingsRepository || !calendarRepository || !projectRepository || !userId || !accessToken) return;

        // 1. Fetch Profile
        userRepository.getProfile().subscribe({
            next: (res) => {
                if (res?.status) {
                    const { name, avatarUrl, email } = res.data;
                    setAvatarUrl(avatarUrl || "");
                    setEmail(email);
                    setDisplayName(name);
                }
            },
            error: (err) => console.error("Failed to fetch profile", err)
        });

        // 2. Fetch Settings
        settingsRepository.getDailyLimits().subscribe({
            next: (res) => {
                if (res?.status) {
                    const limits = res?.data?.limits;
                    if (res?.data?.enabled) {
                        setDailyLimitsEnabled(true);
                        setTaskLimitHours(limits?.TASK?.hours);
                        setRoutineLimitHours(limits?.ROUTINE?.hours);
                    } else {
                        setDailyLimitsEnabled(false);
                    }
                }
            }
        });

        settingsRepository.getSleepHours().subscribe({
            next: (res: any) => {
                if (res?.status) {
                    setSleepHours(res?.data?.sleepHours);
                }
            }
        });

        // 3. Fetch Calendar
        calendarRepository.getCalendars().subscribe({
            next: res => {
                if (res?.status) {
                    const calendars = res?.data?.calendars || [];
                    if (!calendars.length) {
                        calendarRepository.createCalendar(userId).subscribe({
                            next: res => {
                                if (res?.status && res?.data) setCalendarId(res.data);
                            }
                        });
                    } else {
                        setCalendarId(calendars[0]?.id);
                    }
                }
            }
        });

        // 4. Fetch Projects
        projectRepository.getProjects().subscribe({
            next: res => {
                if (res?.status) {
                    setTeamProjects(res?.data?.projects || []);
                }
            }
        });

    }, [userRepository, settingsRepository, calendarRepository, projectRepository, userId]);

    const getProjects = () => {
        if (!projectRepository) return;
        projectRepository.getProjects().subscribe({
            next: res => {
                if (res?.status) {
                    setTeamProjects(res?.data?.projects || []);
                }
            }
        });
    };

    return {
        userId,
        setUserId,
        loadingPage,
        setLoadingPage,
        sleepHours,
        setSleepHours,
        email,
        setEmail,
        avatarUrl,
        setAvatarUrl,
        displayName,
        setDisplayName,
        darkBg,
        setDarkBg,
        dailyLimitsEnabled,
        setDailyLimitsEnabled,
        taskLimitHours,
        setTaskLimitHours,
        routineLimitHours,
        setRoutineLimitHours,
        timezone,
        setTimeZone,
        calendarId,
        setCalendarId,
        teamProjects,
        setTeamProjects,
        getProjects,

        authRepository,
        calendarRepository,
        documentRepository,
        notificationRepository,
        projectRepository,
        settingsRepository,
        userRepository,
    };
};