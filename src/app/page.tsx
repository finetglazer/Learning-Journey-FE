"use client";

import { HomePanel, SidebarSectionConfig } from "@/components/core/sidebar/home-panel";
import ChangePasswordPage from "@/components/core/sidebar/pages/change-password/change-password";
import { LimitTimeAndTimeZone } from "@/components/core/sidebar/pages/limit-time-and-time-zone-setting/limit-time-and-time-zone-setting";
import { SettingsPanel } from "@/components/core/sidebar/settings-panel";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { settingsRepository } from "@/repository/settings-repository";
import {
  AppWindow,
  Bell,
  CalendarDays,
  CalendarHeart,
  Clock,
  Github,
  Heart,
  Image,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  MoreHorizontal,
  PersonStanding,
  Plus,
  Settings,
  Shield,
  Terminal,
  Timer,
  User,
  Users,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { CalendarContext, useCalendarHooks } from "@/components/core/calendar/calendar-context";
import { CalendarDayView } from "@/components/core/calendar/calendar-day-view";
import { CalendarMonthPlanning } from "@/components/core/calendar/calendar-month-planing";
import { CalendarMonthView } from "@/components/core/calendar/calendar-month-view";
import { CalendarWeekView } from "@/components/core/calendar/calendar-week-view";
import { CalendarYearView } from "@/components/core/calendar/calendar-year-view";
import { HeaderBar } from "@/components/core/header-bar/header-bar";
import { PM_DraggableItemData } from "@/components/core/project-management/type";
import { MemorableEvents } from "@/components/core/sidebar/pages/memorable-event/memorable-event";
import { PublicProfile } from "@/components/core/sidebar/pages/public-profile/public-profile";
import { SIGN_IN_ROUTE } from "@/const/routes-const";
import { toDayJs } from "@/lib/utils";
import { PM_Deliverable, Project, TaskPriority, TaskStatus } from "@/model/project-management";
import { calendarRepository } from "@/repository/calendar-repository";
import { projectRepository } from "@/repository/project-repository";
import { DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TeamProjectSection } from "@/components/core/sidebar/sections/team-project-section";
import { TeamProjectPage } from "@/components/core/sidebar/pages/project/team-project";
import { TeamProjectContext, useTeamProjectHooks } from "@/components/core/sidebar/pages/project/team-project-context";

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
  const [teamProjects, setTeamProjects] = useState<Project[]>([]);

  const { setSleepHours, setLoadingPage } = useContext<AppContextProps>(AppContext);
  const calendarContextValues = useCalendarHooks({ initTasks: [] });

  const {
    currentDate,
    setAlertMessage,
  } = calendarContextValues;

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
    setLoadingPage(true);
    router.push(SIGN_IN_ROUTE);
  };

  const addProject = () => {
    updateModalStates(0, true);
  };

  const deleteProject = (projectId: number) => {
    projectRepository.deleteProject({ projectId }).subscribe({
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
  const homeSections: SidebarSectionConfig[] = [
    {
      title: "Calendar",
      items: [
        { id: "private-calendar", label: "Private calendar", icon: <Lock size={16} />, onClick: () => setActiveItem("private-calendar") },
        { id: "month-planning", label: "Month planning", icon: <CalendarDays size={16} />, onClick: () => setActiveItem("month-planning") },
        { id: "settings", label: "Settings", icon: <Settings size={16} />, onClick: () => setCurrentView("settings") },
      ],
    },
    {
      title: "Team project",
      action: (
        <Button className="cursor-pointer bg-transparent text-black hover:bg-gray-300" onClick={(e) => {
          e.stopPropagation();
          addProject();
        }}>
          <Plus size={16} />
        </Button>
      ),
      items: (teamProjects || []).map((project: Project) => {
        return {
          id: `project-${project?.id}`,
          label: project?.name,
          icon: <span className={`h-4 w-4 rounded-full border-2 border-white`} style={{ backgroundColor: `${project?.color}` }} />,
          actionIcon: <MoreHorizontal size={16} />,
          onClick: (e: any) => {
            e.stopPropagation();
            setActiveItem(`project-${project?.id}`);
            setCurrentSelectedProject(project);
          },
          menu: [
            {
              icon: (
                <div
                  className="cursor-pointer text-red-500"
                >
                  Delete
                </div>
              ),
              onClick: (e: any) => {
                e.stopPropagation();
                updateModalStates(3, true);
                setActiveItem(`project-${project?.id}`);
                setCurrentSelectedProject(project);
              }
            }
          ],
        }
      })
    },
    {
      title: "Community",
      items: [
        { id: "com-1", label: "Com 1", icon: <Users size={16} />, onClick: () => setActiveItem("com-1") },
        { id: "com-2", label: "Com 2", icon: <Users size={16} />, onClick: () => setActiveItem("com-2") },
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
  ];

  const settingsSections: SidebarSectionConfig[] = [
    {
      title: "",
      items: [
        { id: "profile", label: "Public profile", icon: <User size={16} />, onClick: () => setActiveItem("profile") },
        { id: "password", label: "Password change", icon: <KeyRound size={16} />, onClick: () => setActiveItem("password") },
        { id: "appearance", label: "Appearance", icon: <Image size={16} />, onClick: () => setActiveItem("appearance") },
        { id: "accessibility", label: "Accessibility", icon: <PersonStanding size={16} />, onClick: () => setActiveItem("accessibility") },
        { id: "notifications", label: "Notifications", icon: <Bell size={16} />, onClick: () => setActiveItem("notifications") },
      ],
    },
    {
      title: "Community",
      items: [
        { id: "auth", label: "Password and authentication", icon: <Lock size={16} />, onClick: () => setActiveItem("auth") },
        { id: "emails", label: "Emails", icon: <Mail size={16} />, onClick: () => setActiveItem("emails") },
      ],
    },
    {
      title: "File",
      items: [
        { id: "repos", label: "Repositories", icon: <Github size={16} />, onClick: () => setActiveItem("repos") },
        { id: "codespaces", label: "Codespaces", icon: <Terminal size={16} />, onClick: () => setActiveItem("codespaces") },
      ],
    },
    {
      title: "Calendar",
      items: [
        { id: "timezone", label: "Limit time and time zone", icon: <Clock size={16} />, onClick: () => setActiveItem("timezone") },
        { id: "memorable-events", label: "Memorable events", icon: <CalendarHeart size={16} />, onClick: () => setActiveItem("memorable-events") },
      ],
    },
    {
      title: "Integrations",
      items: [
        { id: "apps", label: "Applications", icon: <AppWindow size={16} />, onClick: () => setActiveItem("apps") },
        { id: "reminders", label: "Scheduled reminders", icon: <Timer size={16} />, onClick: () => setActiveItem("reminders") },
      ],
    },
    {
      title: "Archives",
      items: [
        { id: "security", label: "Security log", icon: <Shield size={16} />, onClick: () => setActiveItem("security") },
        { id: "sponsorship", label: "Sponsorship log", icon: <Heart size={16} />, onClick: () => setActiveItem("sponsorship") },
      ],
    },
  ];

  const getProjects = () => {
    projectRepository.getProjects().subscribe({
      next: res => {
        if (res?.status) {
          const projects = res?.data?.projects;
          setTeamProjects(projects);
        }
        else {
          toast.error(res?.message || res?.msg);
        }
      },
      error: err => { },
    });
  };

  // --- Fetch user settings ---
  useEffect(() => {
    settingsRepository.getDailyLimits().subscribe({
      next: (res) => {
        if (res?.status) {
          const limits = res?.data?.limits;
          if (res?.data?.enabled) {
            localStorage.setItem("dailyLimitsEnabled", "1");
            localStorage.setItem("taskLimitHours", limits?.TASK?.hours);
            localStorage.setItem("routineLimitHours", limits?.ROUTINE?.hours);
          } else {
            localStorage.setItem("dailyLimitsEnabled", "0");
          }
        } else {
          toast.error(res?.message || res?.msg);
        }
      },
      error: () => { },
    });

    settingsRepository.getSleepHours().subscribe({
      next: (res) => {
        if (!res?.status) {
          toast.error(res?.message || res?.msg);
        } else {
          setSleepHours(res?.data?.sleepHours);
        }
      },
      error: () => { },
    });
    // Get monthPlanId
    calendarRepository.getMonthPlanIdByDate({ year: currentDate.get("year"), month: currentDate.get("month") + 1 }).subscribe({
      next: (res) => {
        const success = res?.status;
        const monthPlanId = res?.data;
        if (success && monthPlanId) {
          localStorage.setItem("monthPlanId", monthPlanId);
        } else {
          // toast.error(res?.msg || res?.message);
          localStorage.removeItem("monthPlanId");
          // If monthPlanId not found, create new monthPlanId
          calendarRepository.createMonthPlan({
            year: currentDate.get("year"),
            month: currentDate.get("month") + 1,
          }).subscribe({
            next: res => {
              if (res.status) {
                localStorage.setItem("monthPlanId", res?.data?.monthPlanId);
              }
              else {
                toast.error(res?.message || res?.msg);
              }
            },
            error: err => {
              const errors = err?.response?.data?.data;
              const message = err?.response?.data?.msg || err?.response?.data?.message;
              setAlertMessage({
                type: "warning",
                title: message,
                description: errors,
              });
            }
          });
        }
      },
      error: () => {
        localStorage.removeItem("monthPlanId");
      },
    });
    // Get calendarId
    calendarRepository.getCalendars().subscribe({
      next: res => {
        if (res?.status) {
          const calendars = res?.data?.calendars || [];
          if (!calendars.length) {
            // If there are no calendars, create 1
            const userId = Number(localStorage.getItem("userId"));
            calendarRepository.createCalendar(userId).subscribe({
              next: res => {
                if (res?.status) {
                  if (res?.data) {
                    localStorage.setItem("calendarId", res?.data);
                  }
                }
                else {
                  toast.error(res?.msg || res?.message);
                }
              },
              error: err => { }
            });
          }
          else {
            localStorage.setItem("calendarId", calendars[0]?.id);
          }
        }
        else {
          localStorage.removeItem("calendarId");
          toast.error(res?.msg || res?.message);
        }
      },
      error: err => {
        localStorage.removeItem("calendarId");
      },
    });

    // Get team projects
    getProjects();
  }, []);

  useEffect(() => {
    if (currentView === 'home' && activeItem === 'private-calendar') {
      calendarContextValues.setCurrentView('day');
    }
  }, [activeItem, currentView]);

  return (
    <CalendarContext.Provider value={calendarContextValues}>
      <TeamProjectContext.Provider value={useTeamProjectHooks(currentSelectedProject)}>
        <div className="relative">
          {/* --- Headerbar --- */}
          <HeaderBar
            avatarUrl={localStorage.getItem("avatarUrl") || ""}
          />

          <div className="flex">
            {/* --- Sidebar --- */}
            <div
              className={`transition-all duration-300 ease-in-out ${isSidebarCollapse ? "w-[80px]" : "w-[250px]"
                } h-full bg-gray-50 border-r border-gray-200 shadow-md`}
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
                      onToggleCollapse={() => { setIsSidebarCollapse(!isSidebarCollapse) }}
                    />
                  </div>

                  {/* Settings Panel */}
                  <div className={`h-full ${isSidebarCollapse ? "w-[80px]" : "w-[250px]"} border-l border-gray-200`}>
                    <SettingsPanel
                      sections={settingsSections}
                      onShowHome={() => setCurrentView("home")}
                      activeItem={activeItem}
                      isCollapsed={isSidebarCollapse}
                      onToggleCollapse={() => { setIsSidebarCollapse(!isSidebarCollapse) }}
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
      </TeamProjectContext.Provider>
    </CalendarContext.Provider>
  );
};
