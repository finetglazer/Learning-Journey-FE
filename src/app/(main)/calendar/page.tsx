"use client";
import { CalendarContext } from "@/components/core/calendar/calendar-context";
import { CalendarDayView } from "@/components/core/calendar/calendar-day-view";
import { CalendarMonthPlanning } from "@/components/core/calendar/calendar-month-planning";
import { CalendarMonthView } from "@/components/core/calendar/calendar-month-view";
import { CalendarWeekView } from "@/components/core/calendar/calendar-week-view";
import { CalendarYearView } from "@/components/core/calendar/calendar-year-view";
import { useContext, useEffect } from "react";

export default function CalendarPage() {
  const { currentView, setCurrentView } = useContext(CalendarContext);

  // If we land on Private Calendar and view is 'month-planning' (which has its own route), 
  // we might want to default to 'week' or 'day'. 
  // However, if the user explicitly switched to 'month-planning' while on this route (if possible), strictly enforcing might be annoying.
  // Given the Sidebar has a separate "Month Planning" link, let's reset to 'week' if we are on this route and view is 'month-planning'.

  switch (currentView) {
    case 'day':
      return <CalendarDayView />;
    case 'week':
      return <CalendarWeekView />;
    case 'month-view':
      return <CalendarMonthView />;
    case 'year':
      return <CalendarYearView />;
    case 'month-planning':
      return <CalendarMonthPlanning />;
    default:
      return <CalendarWeekView />;
  }
}
