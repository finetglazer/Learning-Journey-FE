"use client";

import { MainLayoutContext } from "@/components/layout/main-layout-context";
import { useContext } from "react";
import { CalendarMonthPlanning } from "@/components/core/calendar/calendar-month-planning";

export default function CalendarPage() {
  // This page is for "Private Calendar" (/calendar)
  // Currently reusing CalendarMonthPlanning as per previous implementation logic
  // Ideally should be a dedicated component if functionality differs significantly
  return (
    <CalendarMonthPlanning />
  );
}
