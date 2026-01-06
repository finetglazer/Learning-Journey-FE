"use client";

import { AppContext, AppContextProps } from "@/hooks/app-context";
import { useCalendarHooks, CalendarContext } from "@/components/core/calendar/calendar-context";
import { HeaderBar } from "@/components/core/header-bar/header-bar";
import { HomePanel, SidebarSectionConfig } from "@/components/core/sidebar/home-panel";
import { SettingsPanel } from "@/components/core/sidebar/settings-panel";
import { TeamProjectSection } from "@/components/core/sidebar/sections/team-project-section";
import { TeamProjectContext, useTeamProjectHooks } from "@/components/core/sidebar/pages/project/team-project-context";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import {
    CalendarDays,
    CalendarHeart,
    Clock,
    KeyRound,
    Lock,
    LogOut,
    Plus,
    User,
    Users
} from "lucide-react";
import { usePathname, useRouter, useSearchParams, useParams } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { Project } from "@/model/project-management";
import { toast } from "sonner";
import { MainLayoutContext } from "./main-layout-context";
import { CALENDAR_PLANNING_ROUTE, CALENDAR_ROUTE, COMMUNITY_ROUTE, getProjectDetailRoute, getSettingsRoute, SIGN_IN_ROUTE } from "@/const/routes-const";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const params = useParams(); // params might be empty in layout if not caught by segment, but let's check

    const {
        teamProjects,
        setTeamProjects,
        getProjects,
        loadingPage,
        setLoadingPage,
        avatarUrl,
        userRepository,
        projectRepository,
        darkBg,
        setDarkBg,
        setUserId
    } = useContext<AppContextProps>(AppContext);

    const [isSidebarCollapse, setIsSidebarCollapse] = useState(false);

    // [0]: Create Project Modal
    // [1]: Invite Members Modal
    // [2]: Team Members View Modal
    // [3]: Confirm Delete Project Modal
    const [modalStates, setModalStates] = useState([false, false, false, false]);

    // Calendar Context
    const calendarContextValues = useCalendarHooks();

    // Determine current project from URL (for TeamProjectContext)
    // Layouts in Next.js 13+ inside folder specific groups don't always get params in all versions, 
    // but app/(main)/layout.tsx wraps /projects/[projectId], so we might need to rely on extracting ID from pathname or context
    // However, for Simplicity, we can find it from teamProjects
    // We'll try to parse projectId from pathname manually if params is empty
    const projectIdFromUrl = useMemo(() => {
        // path: /projects/123/...
        const match = pathname?.match(/\/projects\/(\d+)/);
        return match ? Number(match[1]) : null;
    }, [pathname]);

    const currentSelectedProject = useMemo(() => {
        if (!projectIdFromUrl || !teamProjects.length) return null;
        return teamProjects.find(p => p.id === projectIdFromUrl) || null;
    }, [projectIdFromUrl, teamProjects]);

    // Team Project Hooks
    const teamProjectHooks = useTeamProjectHooks(currentSelectedProject);

    // Sidebar View State
    const currentView = pathname?.startsWith("/settings") ? "settings" : "home";

    // Active Item Calculation
    const activeItem = useMemo(() => {
        if (pathname?.startsWith(CALENDAR_PLANNING_ROUTE)) return "month-planning";
        if (pathname === CALENDAR_ROUTE) return "private-calendar";
        if (pathname?.startsWith("/projects")) return `project-${projectIdFromUrl}`;
        if (pathname?.startsWith(COMMUNITY_ROUTE)) return "my-community";

        if (pathname?.startsWith("/settings")) {
            const tab = searchParams?.get("tab");
            return tab || "profile";
        }

        return "";
    }, [pathname, searchParams, projectIdFromUrl]);


    // Modal & Dark Overlay Logic
    const isModalOpen = useMemo(() => {
        return modalStates.some(state => state === true);
    }, [modalStates]);

    const updateModalStates = (index: number, isOpen: boolean) => {
        const updatedModalStates = [...modalStates];
        for (let i = 0; i < updatedModalStates.length; ++i) {
            updatedModalStates[i] = i === index ? isOpen : false;
        }
        setModalStates(updatedModalStates);
    };

    useEffect(() => {
        setDarkBg(isModalOpen);
    }, [isModalOpen, setDarkBg]);

    // Cleanup modals on navigation
    useEffect(() => {
        setModalStates([false, false, false, false]);
    }, [pathname]);


    // Actions
    const handleLogOut = () => {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("calendar_session_view");
        sessionStorage.removeItem("calendar_session_date");
        setUserId(null); // Clear userId to stop context fetching
        setLoadingPage(true);
        router.push(SIGN_IN_ROUTE);
    };

    const addProject = () => {
        updateModalStates(0, true);
    };

    const deleteProject = (projectId: number) => {
        projectRepository?.deleteProject({ projectId }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getProjects(); // Refresh projects
                    // If deleted current project, go home
                    if (projectId === projectIdFromUrl) {
                        router.push(CALENDAR_ROUTE);
                    }
                } else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });
    };

    // Sidebar Config
    const homeSections: SidebarSectionConfig[] = useMemo(() => [
        {
            title: "Calendar",
            items: [
                {
                    id: "private-calendar",
                    label: "Private calendar",
                    icon: <Lock size={16} />,
                    onClick: () => {
                        // Direct navigation to eliminate flicker
                        let savedView = sessionStorage.getItem("calendar_session_view") || "week";
                        if (savedView === "month-planning") {
                            savedView = "week";
                        }
                        const savedDate = sessionStorage.getItem("calendar_session_date") || dayjs().format("YYYY-MM-DD");

                        // Construct direct URL
                        const params = new URLSearchParams();
                        params.set("view", savedView);
                        params.set("date", savedDate);

                        router.push(`${CALENDAR_ROUTE}?${params.toString()}`);
                    }
                },
                {
                    id: "month-planning",
                    label: "Month planning",
                    icon: <CalendarDays size={16} />,
                    onClick: () => {
                        calendarContextValues.setCurrentView('month-planning');
                    }
                },
            ],
        },
        {
            title: "Team project",
            action: !isSidebarCollapse ? (
                <Button className="cursor-pointer bg-transparent text-black hover:bg-gray-300" onClick={(e: any) => {
                    e.stopPropagation();
                    addProject();
                }}>
                    <Plus size={16} />
                </Button>
            ) : <></>,
            items: (teamProjects || []).map((project: Project) => {
                return {
                    id: `project-${project?.id}`,
                    label: project?.name,
                    icon: <Users size={16} />,
                    onClick: (e: any) => {
                        e.stopPropagation();
                        router.push(getProjectDetailRoute(project.id, "summary"));
                    },
                }
            })
        },
        {
            title: "Community",
            items: [
                {
                    id: "my-community", label: "My community", icon: <Users size={16} />, onClick: () => {
                        router.push(COMMUNITY_ROUTE);
                    }
                },
            ],
        },
        {
            title: "",
            items: [
                {
                    id: "logout",
                    label: <span className="text-red-600 font-medium">Logout</span>,
                    icon: <LogOut size={16} className="text-red-600" />,
                    onClick: handleLogOut
                }
            ]
        }
    ], [isSidebarCollapse, teamProjects, router]);

    const settingsSections: SidebarSectionConfig[] = [
        {
            title: "Profile",
            items: [
                { id: "profile", label: "Public profile", icon: <User size={16} />, onClick: () => router.push(getSettingsRoute("profile")) },
                { id: "password", label: "Password change", icon: <KeyRound size={16} />, onClick: () => router.push(getSettingsRoute("password")) },
            ],
        },
        {
            title: "Calendar",
            items: [
                { id: "timezone", label: "Limit time and time zone", icon: <Clock size={16} />, onClick: () => router.push(getSettingsRoute("timezone")) },
                { id: "memorable-events", label: "Memorable events", icon: <CalendarHeart size={16} />, onClick: () => router.push(getSettingsRoute("memorable-events")) },
            ],
        },
    ];

    return (
        <TeamProjectContext.Provider value={teamProjectHooks}>
            <CalendarContext.Provider value={calendarContextValues as any}>
                <MainLayoutContext.Provider value={{
                    modalStates,
                    updateModalStates,
                    currentSelectedProject,
                    deleteProject
                }}>
                    <div className="relative">
                        {darkBg && (
                            <div
                                className="fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300"
                                onClick={() => {
                                    updateModalStates(-1, false); // Close all
                                }}
                            />
                        )}

                        <HeaderBar
                            avatarUrl={avatarUrl}
                            onSettingsClick={() => router.push(getSettingsRoute("profile"))}
                            onView={(url) => router.push(url)}
                        />

                        <div className="flex">
                            {/* Sidebar Container */}
                            <div
                                ref={calendarContextValues.sidebarRef}
                                className={`transition-all duration-300 ease-in-out ${isSidebarCollapse ? "w-[80px]" : "w-[250px]"} h-auto bg-gray-50 border-r border-gray-200 shadow-md`}
                                onClick={() => {
                                    // Deselect or handle sidebar click? usually does nothing or closes modals
                                    updateModalStates(-1, false);
                                }}
                            >
                                <div className="flex overflow-hidden h-full">
                                    <div
                                        className="flex w-[500px] h-full transition-transform duration-300 ease-in-out"
                                        style={{
                                            transform: currentView === "home" ? "translateX(0%)" : "translateX(-50%)",
                                        }}
                                    >
                                        {/* Home Panel */}
                                        <div className={`h-full ${isSidebarCollapse ? "w-[80px]" : "w-[250px]"}`}>
                                            <HomePanel
                                                sections={homeSections}
                                                activeItem={activeItem}
                                                isCollapsed={isSidebarCollapse}
                                                onToggleCollapse={(e: any) => {
                                                    e.stopPropagation();
                                                    setIsSidebarCollapse(!isSidebarCollapse);
                                                }}
                                            />
                                        </div>

                                        {/* Settings Panel */}
                                        <div className={`h-full ${isSidebarCollapse ? "w-[80px]" : "w-[250px]"} border-l border-gray-200`}>
                                            <SettingsPanel
                                                sections={settingsSections}
                                                onShowHome={() => router.push(CALENDAR_ROUTE)}
                                                activeItem={activeItem}
                                                isCollapsed={isSidebarCollapse}
                                                onToggleCollapse={(e: any) => {
                                                    e.stopPropagation();
                                                    setIsSidebarCollapse(!isSidebarCollapse);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1">
                                {children}
                            </div>

                            {/* Global Modals (Hidden but active) */}
                            <TeamProjectSection
                                teamProjects={teamProjects}
                                setTeamProjects={setTeamProjects}
                                getTeamProjects={getProjects}
                                modalStates={modalStates}
                                updateModalStates={updateModalStates}
                                currentSelectedProject={currentSelectedProject}
                                deleteProject={deleteProject}
                            />
                        </div>
                    </div>
                </MainLayoutContext.Provider>
            </CalendarContext.Provider>
        </TeamProjectContext.Provider>
    );
}
