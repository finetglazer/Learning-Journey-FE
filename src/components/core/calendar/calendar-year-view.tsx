"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useContext, useEffect, useState } from "react";
import { DateRangeNavigator } from "../date-range-navigator/date-range-navigator";
import { SegmentedControl } from "../segmented-control/segmented-control";
import { Month } from "./calendar-year-view-each-month";
import { RoundedButton } from "../button/rounded-button";
import { CalendarContext, CalendarContextInterface } from "./calendar-context";
import { AlertModal } from "../alert-modal/alert-modal";
import { TaskEditor } from "../task-editor/task-editor";
import { Task } from "@/model/task";

export function CalendarYearView() {
    const {
        currentView,
        updatedTasks,
        setUpdatedTasks,
        setCurrentView,
        generateDateRangeLabel,
        onNextDateRangeNavigatorClick,
        onPreviousDateRangeNavigatorClick,
        handleGoToToday,
        currentDate,
        editingTask,
        setEditingTask,
        setAlertMessage,
        sleepStartTime,
        sleepEndTime,
        isOutBigTaskTimeRange,
        onRemoveDraggableTask,
        alertMessage,
    } = useContext<CalendarContextInterface>(CalendarContext);

    const [selectedDay, setSelectedDay] = useState<Date>(currentDate.toDate());
    const [editorPosition, setEditorPosition] = useState({ x: 0, y: 0 });
    const [selectedTaskId, setSelectedTaskId] = useState<string>("");

    useEffect(() => {
        setSelectedDay(currentDate.toDate());
    }, [currentDate]);

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
                            updatedTasks={updatedTasks}
                            year={currentDate.get("year")}
                            monthIndex={index}
                            onDayClick={setSelectedDay}
                            selectedDay={selectedDay}
                            setEditorPosition={setEditorPosition}
                            selectedTaskId={selectedTaskId}
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
                {(editingTask || selectedTaskId) && (
                    <TaskEditor
                        key={editingTask?.id || selectedTaskId}
                        task={editingTask || updatedTasks.find(task => task.id === selectedTaskId) || new Task}
                        updatedTasks={updatedTasks}
                        setUpdatedTasks={setUpdatedTasks}
                        setAlertMessage={setAlertMessage}
                        onClose={() => {
                            editingTask ? setEditingTask(null)
                                : (selectedTaskId ? setSelectedTaskId("") : {})
                        }}
                        style={{ top: editorPosition.y, left: editorPosition.x }}
                        sleepStartTime={sleepStartTime}
                        sleepEndTime={sleepEndTime}
                        onDelete={() => onRemoveDraggableTask(editingTask || updatedTasks.find(task => task.id === selectedTaskId) || new Task)}
                        isOutBigTaskTimeRange={isOutBigTaskTimeRange}
                    />
                )}
            </CardContent>
        </Card>
    );
}