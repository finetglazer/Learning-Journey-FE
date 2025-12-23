"use client";

import { HomePanel, SidebarSectionConfig } from "@/components/core/sidebar/home-panel";
import ChangePasswordPage from "@/components/core/sidebar/pages/change-password/change-password";
import { LimitTimeAndTimeZone } from "@/components/core/sidebar/pages/limit-time-and-time-zone-setting/limit-time-and-time-zone-setting";
import { SettingsPanel } from "@/components/core/sidebar/settings-panel";
import { AppContext, AppContextProps } from "@/hooks/app-context";
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
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { CalendarContext, useCalendarHooks } from "@/components/core/calendar/calendar-context";
import { CalendarDayView } from "@/components/core/calendar/calendar-day-view";
import { CalendarMonthPlanning } from "@/components/core/calendar/calendar-month-planning";
import { CalendarMonthView } from "@/components/core/calendar/calendar-month-view";
import { CalendarWeekView } from "@/components/core/calendar/calendar-week-view";
import { CalendarYearView } from "@/components/core/calendar/calendar-year-view";
import { HeaderBar } from "@/components/core/header-bar/header-bar";
import { MemorableEvents } from "@/components/core/sidebar/pages/memorable-event/memorable-event";
import { TeamProjectPage } from "@/components/core/sidebar/pages/project/team-project";
import { TeamProjectContext, useTeamProjectHooks } from "@/components/core/sidebar/pages/project/team-project-context";
import { PublicProfile } from "@/components/core/sidebar/pages/public-profile/public-profile";
import { TeamProjectSection } from "@/components/core/sidebar/sections/team-project-section";
import { Button } from "@/components/ui/button";
import { SIGN_IN_ROUTE, CALENDAR_ROUTE, CALENDAR_PLANNING_ROUTE, getProjectDetailRoute, SETTINGS_ROUTE, getSettingsRoute } from "@/const/routes-const";
import { NotificationFilter } from "@/model/notification";
import { Project } from "@/model/project-management";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"home" | "settings">("home");
  const [activeItem, setActiveItem] = useState("private-calendar");
  const [currentSelectedProject, setCurrentSelectedProject] = useState<Project | null>(null);
  const [isSidebarCollapse, setIsSidebarCollapse] = useState(false);
  // [0]: Create Project Modal
  // [1]: Invite Members Modal
  // [2]: Team Members View Modal
  // [3]: Conifrm Delete Project Modal
  const [modalStates, setModalStates] = useState([false, false, false, false]);

  const {
    setSleepHours,
    setLoadingPage,
    darkBg,
    setDarkBg,
    setAvatarUrl,
    setDisplayName,
    setEmail,
    calendarRepository,
    userRepository,
    projectRepository,
    settingsRepository,
    avatarUrl,
    setDailyLimitsEnabled,
    setTaskLimitHours,
    setRoutineLimitHours,
    userId,
    setCalendarId,
    teamProjects,
    setTeamProjects,
    getProjects,
  } = useContext<AppContextProps>(AppContext);

  const calendarContextValues = useCalendarHooks();
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

  const handleLogOut = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    // Clear calendar session state so next login is fresh
    sessionStorage.removeItem("calendar_session_view");
    sessionStorage.removeItem("calendar_session_date");
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
          setCurrentSelectedProject(null);
          getProjects();
        }
        else {
          toast.error(res?.message || res?.msg);
        }
      },
      error: err => { },
    });
  };

  // --- Sidebar sections ---
  const homeSections: SidebarSectionConfig[] = useMemo(() => [
    {
      title: "Calendar",
      items: [
        {
          id: "private-calendar", label: "Private calendar", icon: <Lock size={16} />, onClick: () => {
            const savedView = sessionStorage.getItem("calendar_session_view");
            const savedDate = sessionStorage.getItem("calendar_session_date");

            if (savedView === 'month-planning') {
              if (savedDate) {
                router.push(`${CALENDAR_ROUTE}?date=${savedDate}`);
              } else {
                router.push(CALENDAR_ROUTE);
              }
            } else if (savedView || savedDate) {
              const params = new URLSearchParams();
              if (savedView) params.set("view", savedView);
              if (savedDate) params.set("date", savedDate);
              router.push(`${CALENDAR_ROUTE}?${params.toString()}`);
            } else {
              router.push(CALENDAR_ROUTE);
            }
          }
        },
        { id: "month-planning", label: "Month planning", icon: <CalendarDays size={16} />, onClick: () => router.push(CALENDAR_PLANNING_ROUTE) },
      ],
    },
    {
      title: "Team project",
      action: !isSidebarCollapse ? (
        <Button className="cursor-pointer bg-transparent text-black hover:bg-gray-300" onClick={(e) => {
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
        { id: "my-community", label: "My community", icon: <Users size={16} />, onClick: () => setActiveItem("my-community") },
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
  ], [isSidebarCollapse, teamProjects]);

  const settingsSections: SidebarSectionConfig[] = [
    {
      title: "Profile",
      items: [
        { id: "profile", label: "Public profile", icon: <User size={16} />, onClick: () => router.push(getSettingsRoute("profile")) },
        { id: "password", label: "Password change", icon: <KeyRound size={16} />, onClick: () => router.push(getSettingsRoute("password")) },
        // { id: "appearance", label: "Appearance", icon: <Image size={16} />, onClick: () => setActiveItem("appearance") },
        // { id: "accessibility", label: "Accessibility", icon: <PersonStanding size={16} />, onClick: () => setActiveItem("accessibility") },
        // { id: "notifications", label: "Notifications", icon: <Bell size={16} />, onClick: () => setActiveItem("notifications") },
      ],
    },
    // {
    //   title: "Authentication",
    //   items: [
    //     { id: "auth", label: "Password and authentication", icon: <Lock size={16} />, onClick: () => setActiveItem("auth") },
    //     { id: "emails", label: "Emails", icon: <Mail size={16} />, onClick: () => setActiveItem("emails") },
    //   ],
    // },
    // {
    //   title: "File",
    //   items: [
    //     { id: "repos", label: "Repositories", icon: <Github size={16} />, onClick: () => setActiveItem("repos") },
    //     { id: "codespaces", label: "Codespaces", icon: <Terminal size={16} />, onClick: () => setActiveItem("codespaces") },
    //   ],
    // },
    {
      title: "Calendar",
      items: [
        { id: "timezone", label: "Limit time and time zone", icon: <Clock size={16} />, onClick: () => router.push(getSettingsRoute("timezone")) },
        { id: "memorable-events", label: "Memorable events", icon: <CalendarHeart size={16} />, onClick: () => router.push(getSettingsRoute("memorable-events")) },
      ],
    },
    // {
    //   title: "Integrations",
    //   items: [
    //     { id: "apps", label: "Applications", icon: <AppWindow size={16} />, onClick: () => setActiveItem("apps") },
    //     { id: "reminders", label: "Scheduled reminders", icon: <Timer size={16} />, onClick: () => setActiveItem("reminders") },
    //   ],
    // },
    // {
    //   title: "Archives",
    //   items: [
    //     { id: "security", label: "Security log", icon: <Shield size={16} />, onClick: () => setActiveItem("security") },
    //     { id: "sponsorship", label: "Sponsorship log", icon: <Heart size={16} />, onClick: () => setActiveItem("sponsorship") },
    //   ],
    // },
  ];

  // Close all modals when selecting other project
  useEffect(() => {
    setModalStates([false, false, false, false]);
  }, [currentSelectedProject]);

  useEffect(() => {
    if (isModalOpen) {
      setDarkBg(true);
    }
    else {
      setDarkBg(false);
    }
  }, [isModalOpen]);

  return (
    <TeamProjectContext.Provider value={useTeamProjectHooks(currentSelectedProject)}>
      <CalendarContext.Provider value={calendarContextValues as any}>
        <div className="relative">
          {darkBg && (
            <div
              className="fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300"
              // Close all modals when clicking the backdrop
              onClick={() => {
                setModalStates([false, false, false, false]);
                setDarkBg(false);
              }}
            />
          )}

          {/* --- Headerbar --- */}
          <HeaderBar
            avatarUrl={avatarUrl}
            onSettingsClick={() => router.push(getSettingsRoute("profile"))}
          />

          <div className="flex">
            {/* --- Sidebar --- */}
            <div
              ref={calendarContextValues.sidebarRef}
              className={`transition-all duration-300 ease-in-out ${isSidebarCollapse ? "w-[80px]" : "w-[250px]"
                } h-auto bg-gray-50 border-r border-gray-200 shadow-md`}
              onClick={() => {
                setModalStates([false, false, false, false]);
                setCurrentSelectedProject(null);
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
                      onShowHome={() => setCurrentView("home")}
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

            {/* --- Main Content --- */}
            <div className="flex-1">
              {currentView === "home" && activeItem === "private-calendar" && (
                <>
                  {calendarContextValues.currentView === "day" && <CalendarDayView />}
                  {calendarContextValues.currentView === "week" && <CalendarWeekView />}
                  {calendarContextValues.currentView === "month-view" && <CalendarMonthView />}
                  {calendarContextValues.currentView === "year" && <CalendarYearView />}
                </>
              )}

              {currentView === "home" && activeItem === "month-planning" && <CalendarMonthPlanning />}

              {currentView === "settings" && activeItem === "timezone" && <LimitTimeAndTimeZone />}
              {currentView === "settings" && activeItem === "password" && <ChangePasswordPage />}
              {currentView === "settings" && activeItem === "memorable-events" && <MemorableEvents />}
              {currentView === "settings" && activeItem === "profile" && <PublicProfile />}
            </div>

            {/* Team Project Sidebar Section */}
            <TeamProjectSection
              teamProjects={teamProjects}
              setTeamProjects={setTeamProjects}
              getTeamProjects={getProjects}
              modalStates={modalStates}
              updateModalStates={updateModalStates}
              currentSelectedProject={currentSelectedProject}
              deleteProject={deleteProject}
            />

            {/* Team Project Page */}
            {currentSelectedProject && (
              <TeamProjectPage
                modalStates={modalStates}
                updateModalStates={updateModalStates}
                currentSelectedProject={currentSelectedProject}
                deleteProject={deleteProject}
              />
            )}
          </div>
        </div>
      </CalendarContext.Provider>
    </TeamProjectContext.Provider>
  );
};
