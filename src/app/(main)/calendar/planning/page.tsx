"use client";

import { CalendarMonthPlanning } from "@/components/core/calendar/calendar-month-planning";
import { CalendarContext } from "@/components/core/calendar/calendar-context";
import { useContext } from "react";

export default function CalendarPlanningPage() {
    const { setCurrentView } = useContext(CalendarContext);


    return (
        <CalendarMonthPlanning />
    );
}
