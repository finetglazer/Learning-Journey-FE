"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import { AlertModal } from "../alert-modal/alert-modal";
import { RoundedButton } from "../button/rounded-button";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl } from "../segmented-control/segmented-control";
import { TaskEditor } from "../task-editor/task-editor";
import { CalendarContext, CalendarContextInterface } from "./calendar-context";
import { Month } from "./calendar-year-view-each-month";
import { calendarRepository } from "@/repository/calendar-repository";
import dayjs from "dayjs";
import { Task } from "@/model/task";

export function CalendarYearView() {
    const {
        currentView,
        calendarMap,
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

    useEffect(() => {
        setSelectedDay(currentDate.toDate());
    }, [currentDate]);

    useEffect(() => {
        calendarRepository.getScheduledItems({
            view: 'DAY',
            date: dayjs(selectedDay).format('YYYY-MM-DD'),
            calendarId: 2,
        }).subscribe({
            next: res => {
                const newDayTasks = (res?.data?.items || []).map((item: any) => {
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
                setDayTasks(newDayTasks);
            },
            error: err => {
                console.log("Error occurs while fetching scheduled items", err);
            }
        });
    }, [selectedDay]);

    return (
        <Card className="w-full h-full mx-auto rounded-xl shadow-lg bg-white p-0">
            {/* ====== Header Controls ====== */}
            <CardHeader className="grid grid-cols-[auto_1fr] items-center p-4 border-b border-gray-200 bg-slate-100/60 rounded-t-xl">
                <div className="text-sm font-semibold text-slate-600 whitespace-nowrap">
                    Calendar / <span className="text-slate-800">Year view</span>
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
                    <RoundedButton label="UTC" id="calendar-utc-btn" />
                </div>
            </CardHeader>

            {/* ====== 12-Month Grid ====== */}
            <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <Month
                            key={index}
                            dayTasks={dayTasks}
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