"use client";

import { CalendarContext, useCalendarHooks } from "@/components/core/calendar/calendar-context";
import { CalendarDayView } from "@/components/core/calendar/calendar-day-view";
import { CalendarMonthPlanning } from "@/components/core/calendar/calendar-month-planing";
import { CalendarMonthView } from "@/components/core/calendar/calendar-month-view";
import { CalendarWeekView } from "@/components/core/calendar/calendar-week-view";
import { CalendarYearView } from "@/components/core/calendar/calendar-year-view";
import { HomePanel, HomePanelProps, SidebarSectionConfig } from "@/components/core/sidebar/home-panel";
import { LimitTimeAndTimeZone } from "@/components/core/sidebar/pages/limit-time-and-time-zone-setting/limit-time-and-time-zone-setting";
import { SettingsPanel } from "@/components/core/sidebar/settings-panel";
import { settingsRepository } from "@/components/core/sidebar/settings-repository";
import { cn } from "@/lib/utils";
import { CalendarDays, MoreHorizontal, Plus, Settings, Lock, Users, User, KeyRound, Image, Bell, PersonStanding, AppWindow, Clock, Github, Heart, Mail, Shield, Terminal, Timer } from "lucide-react";
import { markCurrentScopeAsDynamic } from "next/dist/server/app-render/dynamic-rendering";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function RootPage() {
  // const calendarContextValues = useCalendarHooks({ initTasks: [] });

  // return (
  //   <CalendarContext.Provider value={calendarContextValues}>
  //     {calendarContextValues.currentView === "day" && (
  //       <CalendarDayView />
  //     )}
  //     {calendarContextValues.currentView === "week" && (
  //       <CalendarWeekView />
  //     )}
  //     {calendarContextValues.currentView === "month-view" && (
  //       <CalendarMonthView />
  //     )}
  //     {calendarContextValues.currentView === "month-planning" && (
  //       <CalendarMonthPlanning />
  //     )}
  //     {calendarContextValues.currentView === "year" && (
  //       <CalendarYearView />
  //     )}
  //   </CalendarContext.Provider>
  // );

  const [currentView, setCurrentView] = useState('home'); // 'home' or 'settings'
  const [activeItem, setActiveItem] = useState('private-calendar');

  const homeSections: SidebarSectionConfig[] = [
    {
      title: 'Calendar',
      items: [
        { id: 'private-calendar', label: 'Private calendar', icon: <Lock size={16} />, onClick: () => setActiveItem('private-calendar') },
        { id: 'month-planning', label: 'Month planning', icon: <CalendarDays size={16} />, onClick: () => setActiveItem('month-planning') },
        { id: 'settings', label: 'Settings', icon: <Settings size={16} />, onClick: () => setCurrentView('settings') }
      ]
    },
    {
      title: 'Team project',
      action: <Plus size={16} />,
      items: [
        { id: 'project-1', label: '<Project title 1>', icon: <span className="w-4 h-4 bg-red-400 rounded-full border-2 border-white" />, actionIcon: <MoreHorizontal size={16} />, onClick: () => setActiveItem('project-1') },
        { id: 'project-2', label: '<Project title 2>', icon: <span className="w-4 h-4 bg-green-400 rounded-full border-2 border-white" />, actionIcon: <MoreHorizontal size={16} />, onClick: () => setActiveItem('project-2') }
      ]
    },
    {
      title: 'Community',
      items: [
        { id: 'com-1', label: 'Com 1', icon: <Users size={16} />, onClick: () => setActiveItem('com-1') },
        { id: 'com-2', label: 'Com 2', icon: <Users size={16} />, onClick: () => setActiveItem('com-2') }
      ]
    }
  ];

  // --- Data for Settings Panel ---
  const settingsSections: SidebarSectionConfig[] = [
    {
      title: '', // No title for the first section
      items: [
        { id: 'profile', label: 'Public profile', icon: <User size={16} />, onClick: () => setActiveItem('profile') },
        { id: 'password', label: 'Password change', icon: <KeyRound size={16} />, onClick: () => setActiveItem('password') },
        { id: 'appearance', label: 'Appearance', icon: <Image size={16} />, onClick: () => setActiveItem('appearance') },
        { id: 'accessibility', label: 'Accessibility', icon: <PersonStanding size={16} />, onClick: () => setActiveItem('accessibility') },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={16} />, onClick: () => setActiveItem('notifications') },
      ]
    },
    {
      title: 'Community',
      items: [
        { id: 'auth', label: 'Password and authentication', icon: <Lock size={16} />, onClick: () => setActiveItem('auth') },
        { id: 'emails', label: 'Emails', icon: <Mail size={16} />, onClick: () => setActiveItem('emails') },
      ]
    },
    {
      title: 'File',
      items: [
        { id: 'repos', label: 'Repositories', icon: <Github size={16} />, onClick: () => setActiveItem('repos') },
        { id: 'codespaces', label: 'Codespaces', icon: <Terminal size={16} />, onClick: () => setActiveItem('codespaces') },
      ]
    },
    {
      title: 'Calendar',
      items: [
        { id: 'timezone', label: 'Limit time and time zone', icon: <Clock size={16} />, onClick: () => setActiveItem('timezone') },
      ]
    },
    {
      title: 'Integrations',
      items: [
        { id: 'apps', label: 'Applications', icon: <AppWindow size={16} />, onClick: () => setActiveItem('apps') },
        { id: 'reminders', label: 'Scheduled reminders', icon: <Timer size={16} />, onClick: () => setActiveItem('reminders') },
      ]
    },
    {
      title: 'Archives',
      items: [
        { id: 'security', label: 'Security log', icon: <Shield size={16} />, onClick: () => setActiveItem('security') },
        { id: 'sponsorship', label: 'Sponsorship log', icon: <Heart size={16} />, onClick: () => setActiveItem('sponsorship') },
      ]
    }
  ];

  useEffect(() => {
    // Get user constraints
    settingsRepository.getDailyLimits().subscribe({
      next: res => {
        const success = res?.status;
        if (success) {
          const resData = res?.data;
          if (resData?.enabled) {
            // Save metrics to local storage
            const limits = resData?.limits;
            const taskLimitHours = limits?.TASK?.hours;
            const routineLimitHours = limits?.ROUTINE?.hours;
            console.log("limits", limits)
            console.log("taskLimitHours", taskLimitHours)
            console.log("routineLimitHours", routineLimitHours);
            localStorage.setItem("dailyLimitsEnabled", "1");
            localStorage.setItem("taskLimitHours", taskLimitHours);
            localStorage.setItem("routineLimitHours", routineLimitHours);
          }
          else {
            localStorage.setItem("dailyLimitsEnabled", "0");
          }
        }
        else {
          toast.error(res?.message || res?.msg);
        }
      },
      error: err => { },
    });
  }, []);

  return (
    <div className="flex">
      {/* Main sidebar container */}
      <div className="w-[250px] h-screen bg-gray-50 border-r border-gray-200 shadow-md">
        {/* This div handles the sliding mechanism */}
        <div className="flex overflow-hidden h-full">
          {/* This wrapper slides left and right */}
          <div
            className="flex w-[500px] h-full transition-transform duration-300 ease-in-out"
            style={{
              transform: currentView === 'home' ? 'translateX(0%)' : 'translateX(-50%)',
            }}
          >
            {/* Home Panel */}
            <div className={cn("h-full",
              "w-[250px]",
            )}>
              <HomePanel
                sections={homeSections}
                activeItem={activeItem}
              />
            </div>

            {/* Settings Panel */}
            <div className={
              cn("h-full border-l border-gray-200",
                "w-[250px]",
              )}>
              <SettingsPanel
                sections={settingsSections}
                onShowHome={() => setCurrentView('home')}
                activeItem={activeItem}
              />
            </div>
          </div>
        </div>
      </div>

      {currentView === 'settings' && (
        <LimitTimeAndTimeZone />
        )}
    </div>
  );
}