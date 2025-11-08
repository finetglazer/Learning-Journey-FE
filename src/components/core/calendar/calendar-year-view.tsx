"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Task } from "@/model/task";
import { calendarRepository } from "@/repository/calendar-repository";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { AlertModal } from "../alert-modal/alert-modal";
import { RoundedButton } from "../button/rounded-button";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl } from "../segmented-control/segmented-control";
import { TaskEditor } from "../task-editor/task-editor";
import { CalendarContext, CalendarContextInterface } from "./calendar-context";
import { Month } from "./calendar-year-view-each-month";
import { toast } from "sonner";
import { isTaskOnDay } from "@/lib/utils";

export function CalendarYearView() {
    const {
        currentView,
        setCurrentView,
        generateDateRangeLabel,
        onNextDateRangeNavigatorClick,
        onPreviousDateRangeNavigatorClick,
        handleGoToToday,
        currentDate,
        editingTask,
        setEditingTask,
        setAlertMessage,
        alertMessage,
        setEditorPosition,
        setSelectedTaskId,
        selectedTaskId,
        handleReload,
        editorPosition,
        onDeleteCalendarItem,
        setSelectedRoutineId,
    } = useContext<CalendarContextInterface>(CalendarContext);

    const [selectedDay, setSelectedDay] = useState<Date>(currentDate.toDate());
    const [dayTasks, setDayTasks] = useState<Task[]>([]);
    const [allItems, setAllItems] = useState<any[]>([]);

    // Fetch all scheduled tasks, events, routines in a year
    useEffect(() => {
        calendarRepository.getScheduledItems({
            view: 'YEAR',
            date: currentDate.format('YYYY-MM-DD'),
            calendarId: 2,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    const newAllItems = (res?.data?.items || []).map((item: any) => {
                        const { createdAt, updatedAt, ...restItem } = item;
                        return {
                            ...restItem,
                            status: (restItem?.status || "").toLowerCase(),
                            type: (restItem?.type || "").toLowerCase(),
                            startTime: (restItem?.timeSlot?.startTime || "").concat("Z"),
                            endTime: (restItem?.timeSlot?.endTime || "").concat("Z"),
                            timeSlot: undefined,
                        };
                    });
                    setAllItems(newAllItems);
                }
                else {
                    toast.error(res?.msg || res?.message);
                }
            },
            error: err => { },
        });
    }, [currentDate]);

    useEffect(() => {
        setSelectedDay(currentDate.toDate());
    }, [currentDate]);

    useEffect(() => {
        if (allItems.length > 0) {
            // Filter the allItems list based on the selectedDay
            const newDayTasks = allItems.filter(item => isTaskOnDay(item.startTime, selectedDay));
            setDayTasks(newDayTasks);
        } else {
            // If allItems is not loaded yet, ensure dayTasks is empty
            setDayTasks([]);
        }
        // This hook now depends on allItems as well,
        // so it re-runs when the initial data load is complete.
    }, [selectedDay, allItems]);

    return (
        <Card className="w-full h-full mx-auto rounded-xl shadow-lg bg-white p-0">
            {/* ====== Header Controls ====== */}
            <CardHeader className="grid grid-cols-[auto_1fr] items-center p-4 border-b border-gray-200 bg-slate-100/60 rounded-t-xl">
                <div className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                    Private Calendar / <span className="text-slate-800">Year view</span>
                </div>
                <div className="flex items-center justify-end gap-4">
                    <RoundedButton label="Today" id="calendar-today-btn" onClick={handleGoToToday} />
                    <DateRangeNavigator
                        dateRangeLabel={generateDateRangeLabel()}
                        onNextClick={onNextDateRangeNavigatorClick}
                        onPreviousClick={onPreviousDateRangeNavigatorClick}
                    />
                    <SegmentedControl
                        value={currentView}
                        onValueChange={setCurrentView}
                    />
                </div>
            </CardHeader>
            {/* ====== 12-Month Grid ====== */}
            <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <Month
                            key={index}
                            allItems={allItems}
                            year={currentDate.get("year")}
                            monthIndex={index}
                            onDayClick={setSelectedDay}
                            selectedDay={selectedDay}
                            setEditorPosition={setEditorPosition}
                            selectedTaskId={selectedTaskId}
                            setEditingTask={setEditingTask}
                            setSelectedTaskId={setSelectedTaskId}
                        />
                    ))}
                </div>
                {alertMessage && (
                    <AlertModal
                        alertMessage={alertMessage}
                        onClose={() => setAlertMessage(null)}
                    />
                )}
                {editingTask && (
                    <TaskEditor
                        key={editingTask?.id || "none"}
                        task={{ ...editingTask, type: (editingTask?.type || "").toLowerCase() }}
                        setAlertMessage={setAlertMessage}
                        onClose={() => {
                            setEditingTask(null);
                            setSelectedTaskId(null);
                        }}
                        style={{ top: editorPosition.y, left: editorPosition.x }}
                        handleReload={handleReload}
                        onDelete={() => onDeleteCalendarItem(editingTask?.id)}
                        setSelectedTaskId={setSelectedTaskId}
                        setSelectedRoutineId={setSelectedRoutineId}
                        setEditingTask={setEditingTask}
                    />
                )}
            </CardContent>
        </Card>
    );
}