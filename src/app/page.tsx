"use client";

import { HomePanel, SidebarSectionConfig } from "@/components/core/sidebar/home-panel";
import ChangePasswordPage from "@/components/core/sidebar/pages/change-password/change-password";
import { LimitTimeAndTimeZone } from "@/components/core/sidebar/pages/limit-time-and-time-zone-setting/limit-time-and-time-zone-setting";
import { SettingsPanel } from "@/components/core/sidebar/settings-panel";
import { settingsRepository } from "@/components/core/sidebar/settings-repository";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import {
  AppWindow,
  Bell,
  CalendarDays,
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
import { DragEventHandler, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { CalendarContext, useCalendarHooks } from "@/components/core/calendar/calendar-context";
import { CalendarDayView } from "@/components/core/calendar/calendar-day-view";
import { CalendarMonthPlanning } from "@/components/core/calendar/calendar-month-planing";
import { CalendarMonthView } from "@/components/core/calendar/calendar-month-view";
import { CalendarWeekView } from "@/components/core/calendar/calendar-week-view";
import { CalendarYearView } from "@/components/core/calendar/calendar-year-view";
import { calendarRepository } from "@/repository/calendar-repository";
import { useRouter } from "next/navigation";
import { SIGN_IN_ROUTE } from "@/const/routes-const";
import { PM_Deliverable, TaskPriority, TaskStatus } from "@/model/project-management";
import { toDayJs } from "@/lib/utils";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { PM_DraggableItemData } from "@/components/core/project-management/type";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { PM_DeliverableItem } from "@/components/core/project-management/pm-deliverable";

export default function RootPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"home" | "settings">("home");
  const [activeItem, setActiveItem] = useState("private-calendar");
  const [isSidebarCollapse, setIsSidebarCollapse] = useState(false);

  const { setSleepHours, setLoadingPage } = useContext<AppContextProps>(AppContext);
  const calendarContextValues = useCalendarHooks({ initTasks: [] });

  const {
    currentDate,
    setAlertMessage,
  } = calendarContextValues;

  const handleLogOut = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    setLoadingPage(true);
    router.push(SIGN_IN_ROUTE);
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
      action: <Plus size={16} />,
      items: [
        { id: "project-1", label: "<Project title 1>", icon: <span className="w-4 h-4 bg-red-400 rounded-full border-2 border-white" />, actionIcon: <MoreHorizontal size={16} />, onClick: () => setActiveItem("project-1") },
        { id: "project-2", label: "<Project title 2>", icon: <span className="w-4 h-4 bg-green-400 rounded-full border-2 border-white" />, actionIcon: <MoreHorizontal size={16} />, onClick: () => setActiveItem("project-2") },
      ],
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
    })
  }, [setSleepHours]);

  useEffect(() => {
    if (currentView === 'home' && activeItem === 'private-calendar') {
      calendarContextValues.setCurrentView('day');
    }
  }, [activeItem, currentView]);

  const today = toDayJs().format('YYYY-MM-DD');
  const INITIAL_DATA: PM_Deliverable[] = [
    {
      // --- Deliverable 1 ---
      deliverableId: 'del-1',
      projectId: 1, // Added required field
      name: 'Improve Navigation & Menu Organization', // 'title' -> 'name'
      key: 'DEL-01', // Added required field
      order: 0, // Added required field
      startDate: '2025-11-13', // Added
      endDate: '2025-12-20',   // Added
      phases: [
        {
          // --- Phase 1.1 ---
          phaseId: 'phase-1',
          deliverableId: 'del-1', // Added required field (matches parent)
          name: 'Enhance Search Functionality', // 'title' -> 'name'
          key: 'PH-01', // Added required field
          order: 0, // Added required field
          startDate: '2025-11-13', // Added
          endDate: '2025-11-30',   // Added
          tasks: [
            {
              // --- Task 1.1.1 ---
              taskId: 'task-22',
              phaseId: 'phase-1', // Added required field (matches parent)
              name: 'Dark Mode Implementation', // 'title' -> 'name'
              key: 'TSK-22', // Added required field
              status: TaskStatus.IN_REVIEW, // Used enum
              priority: TaskPriority.MINOR, // Used enum
              order: 0, // Added required field
              dateAdded: today, // Added required field
              assignees: [], // Added required field
              startDate: '2025-11-16', // Added
              endDate: '2025-11-30',   // Added
            },
            {
              // --- Task 1.1.2 ---
              taskId: 'task-23',
              phaseId: 'phase-1', // Added required field (matches parent)
              name: 'Implement search algorithms',
              key: 'TSK-23',
              status: TaskStatus.TO_DO,
              priority: TaskPriority.MAJOR,
              order: 1,
              dateAdded: today,
              assignees: [],
              startDate: '2025-11-16', // Added
              endDate: '2025-11-30',   // Added
            },
          ],
        },
        {
          // --- Phase 1.2 ---
          phaseId: 'phase-2',
          deliverableId: 'del-1', // Added required field (matches parent)
          name: 'Optimize Mobile Responsiveness',
          key: 'PH-02',
          order: 1,
          startDate: '2025-11-15', // Added
          endDate: '2025-11-25',   // Added
          tasks: [
            {
              // --- Task 1.2.1 ---
              taskId: 'task-24',
              phaseId: 'phase-2', // Added required field (matches parent)
              name: 'Test on iOS',
              key: 'TSK-24',
              status: TaskStatus.TO_DO,
              priority: TaskPriority.MINOR,
              order: 0,
              dateAdded: today,
              assignees: [],
              startDate: '2025-11-15', // Added
              endDate: '2025-11-25',   // Added
            },
          ],
        },
      ],
    },
    {
      // --- Deliverable 2 ---
      deliverableId: 'del-2',
      projectId: 1, // Added required field
      name: 'Speed Optimization for Home Page',
      key: 'DEL-02',
      endDate: '2025-11-25',   // Added
      startDate: '2025-11-15', // Added
      order: 1,
      phases: [
        {
          // --- Phase 2.1 ---
          phaseId: 'phase-3',
          deliverableId: 'del-2', // Added required field (matches parent)
          name: 'Image Compression',
          key: 'PH-03',
          order: 0,
          endDate: '2025-11-25',   // Added
          startDate: '2025-11-15', // Added
          tasks: [
            {
              // --- Task 2.1.1 ---
              taskId: 'task-25',
              phaseId: 'phase-3', // Added required field (matches parent)
              name: 'Setup WebP conversion',
              key: 'TSK-25',
              status: TaskStatus.TO_DO,
              priority: TaskPriority.CRITICAL,
              order: 0,
              dateAdded: today,
              assignees: [],
              startDate: '2025-11-15', // Added
              endDate: '2025-11-25',   // Added
            },
          ],
        },
      ],
    },
  ];

  const [deliverables, setDeliverables] = useState<PM_Deliverable[]>(INITIAL_DATA);
  // (Using string IDs, as dnd-kit uses strings)
  const [expandedDeliverables, setExpandedDeliverables] = useState<Set<string>>(
    new Set([]) // Default expanded deliverables
  );
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(
    new Set([]) // Default expanded phases
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the pointer to move by 5px before activating a drag
      // This prevents a simple click from being treated as a drag
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // --- 2. HELPER FUNCTION to create toggle handlers (DRY pattern) ---
  const createToggleHandler = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    return (id: string) => {
      setter(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    };
  };

  // --- 3. SEPARATE HANDLERS for each level ---
  const handleToggleDeliverable = createToggleHandler(setExpandedDeliverables);
  const handleTogglePhase = createToggleHandler(setExpandedPhases);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeData = active.data.current as PM_DraggableItemData;
    const overData = over.data.current as PM_DraggableItemData;

    // --- Case 1: Reordering Deliverables ---
    if (activeData.type === 'Deliverable' && overData.type === 'Deliverable') {
      setDeliverables(items => {
        const activeIndex = items.findIndex(
          item => item.deliverableId === active.id
        );
        const overIndex = items.findIndex(
          item => item.deliverableId === over.id
        );
        return arrayMove(items, activeIndex, overIndex);
      });
      return;
    }

    // --- Case 2: Reordering Phases ---
    if (
      activeData.type === 'Phase' &&
      overData.type === 'Phase' &&
      activeData.parentId === overData.parentId
    ) {
      const deliverableId = activeData.parentId;
      setDeliverables(items =>
        items.map(del => {
          if (del.deliverableId === deliverableId) {
            const activeIndex = del.phases.findIndex(
              p => p.phaseId === active.id
            );
            const overIndex = del.phases.findIndex(
              p => p.phaseId === over.id
            );
            return {
              ...del,
              phases: arrayMove(del.phases, activeIndex, overIndex),
            };
          }
          return del;
        })
      );
      return;
    }

    // --- Case 3: Reordering Tasks ---
    if (
      activeData.type === 'Task' &&
      overData.type === 'Task' &&
      activeData.parentId === overData.parentId
    ) {
      const phaseId = activeData.parentId;
      setDeliverables(items =>
        items.map(del => ({
          ...del,
          phases: del.phases.map(phase => {
            if (phase.phaseId === phaseId) {
              const activeIndex = phase.tasks.findIndex(
                t => t.taskId === active.id
              );
              const overIndex = phase.tasks.findIndex(
                t => t.taskId === over.id
              );
              return {
                ...phase,
                tasks: arrayMove(phase.tasks, activeIndex, overIndex),
              };
            }
            return phase;
          }),
        }))
      );
      return;
    }

    console.warn("Unhandled drag case:", { activeData, overData });
  };

  return (
    <CalendarContext.Provider value={calendarContextValues}>
      <div className="flex">
        {/* --- Sidebar --- */}
        <div
          className={`transition-all duration-300 ease-in-out ${isSidebarCollapse ? "w-[80px]" : "w-[250px]"
            } h-full bg-gray-50 border-r border-gray-200 shadow-md`}
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
        {/* <div className="flex-1">
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
        </div> */}

        {/* --- DND Context Area --- */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={deliverables.map(d => d.deliverableId)}
            strategy={verticalListSortingStrategy}
          >
            {deliverables.map(del => (
              <PM_DeliverableItem
                key={del.deliverableId}
                deliverable={del}
                isExpanded={expandedDeliverables.has(del.deliverableId)}
                onToggle={handleToggleDeliverable}
                expandedPhaseIds={expandedPhases}
                onTogglePhase={handleTogglePhase}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </CalendarContext.Provider>
  );
};
