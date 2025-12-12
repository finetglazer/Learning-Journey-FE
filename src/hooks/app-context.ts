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

    // Repositories
    authRepository: AuthRepository | null;
    calendarRepository: CalendarRepository | null;
    documentRepository: DocumentRepository | null;
    projectRepository: ProjectRepository | null;
    settingsRepository: SettingsRepository | null;
    userRepository: UserRepository | null;
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

    // Repositories
    authRepository: null,
    calendarRepository: null,
    documentRepository: null,
    projectRepository: null,
    settingsRepository: null,
    userRepository: null,
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
    const [timezone, setTimeZone] = useState<{
        label: string;
        value: string;
        utc: string;
    } | null>(null);

    const [authRepository, setAuthRepository] = useState<AuthRepository | null>(null);
    const [calendarRepository, setCalendarRepository] = useState<CalendarRepository | null>(null);
    const [documentRepository, setDocumentRepository] = useState<DocumentRepository | null>(null);
    const [projectRepository, setProjectRepository] = useState<ProjectRepository | null>(null);
    const [settingsRepository, setSettingsRepository] = useState<SettingsRepository | null>(null);
    const [userRepository, setUserRepository] = useState<UserRepository | null>(null);

    useEffect(() => {
        if (isNil(userId)) {
            Cookies.remove("userId");
            setAuthRepository(authRepositoryCons(-1));

            setCalendarRepository(null);
            setDocumentRepository(null);
            setProjectRepository(null);
            setSettingsRepository(null);
            setUserRepository(null);
            return;
        }

        Cookies.set("userId", String(userId), { expires: 7, secure: true, sameSite: 'strict' });

        setAuthRepository(authRepositoryCons(userId));
        setCalendarRepository(calendarRepositoryCons(userId));
        setDocumentRepository(documentRepositoryCons(userId));
        setProjectRepository(projectRepositoryCons(userId));
        setSettingsRepository(settingsRepositoryCons(userId));
        setUserRepository(userRepositoryCons(userId));
    }, [userId]);

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

        authRepository,
        calendarRepository,
        documentRepository,
        projectRepository,
        settingsRepository,
        userRepository,
    };
};