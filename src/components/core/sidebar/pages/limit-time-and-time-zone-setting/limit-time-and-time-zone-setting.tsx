"use client";

import { AlertMessage, AlertModal } from "@/components/core/alert-modal/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { findTimezone } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Plus, X } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { TimePicker } from "./components/time-picker";
import { TimezonePicker } from "./components/time-zone-picker";
import { TIMEZONE_GROUPS } from "@/const/consts";

export const LimitTimeAndTimeZone = () => {
    const [timeLimitOn, setTimeLimitOn] = useState<CheckedState>(false);
    const [taskLimit, setTaskLimit] = useState<number>(8);
    const [routineLimit, setRoutineLimit] = useState<number>(15);
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
    // Init as GMT+07:00: Ho Chi Minh City    
    const [timeZone, setTimeZone] = useState<{ label: string; value: string; utc: string; }>(TIMEZONE_GROUPS[2].zones[3]);

    const {
        sleepHours,
        setSleepHours,
        settingsRepository,
        setTimeZone: setOriginalTimeZone,
        timezone: originalTimeZone,
        taskLimitHours,
        routineLimitHours,
        dailyLimitsEnabled,
    } = useContext<AppContextProps>(AppContext);

    const getUserConstraintsAndTimeZoneSettings = useCallback(() => {
        if (!settingsRepository) return;

        // --- Get Sleep Hours ---
        settingsRepository.getSleepHours().subscribe({
            next: res => {
                const success = res?.status;
                if (!success) {
                    toast.error(res?.message || res?.msg);
                }
                else {
                    const sleepHours = res?.data?.sleepHours;   // [{startTime: HH:mm, endTime: HH:mm}, ...]
                    setSleepHours(sleepHours);
                }
            },
            error: err => { },
        });

        // --- Get Timezone ---
        settingsRepository.getTimeZone().subscribe({
            next: res => {
                const success = res?.status;
                if (!success) {
                    toast.error(res?.message || res?.msg);
                }
                else {
                    const timezone = res?.data?.timezone;   // "UTC+00:00 UTC", "UTC+07:00 Asia/Ho_Chi_Minh"
                    const utc = timezone.split(" ")[0];
                    setOriginalTimeZone(findTimezone(utc));
                }
            },
            error: err => { },
        });
    }, [settingsRepository, setSleepHours]);

    /**
     * Updates the start or end time for a specific sleep hour entry.
     */
    const handleSleepTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
        const newSleepHours = [...sleepHours];
        newSleepHours[index] = { ...newSleepHours[index], [field]: value };
        setSleepHours(newSleepHours);
    };

    /**
     * Adds a new, empty sleep hour range to the list.
     */
    const handleAddNewSleepHour = () => {
        setSleepHours([...sleepHours, { startTime: "00:00", endTime: "00:00" }]);
    };

    /**
     * Removes a sleep hour range from the list by its index.
     */
    const handleDeleteSleepHour = (index: number) => {
        const newSleepHours = sleepHours.filter((_, i) => i !== index);
        setSleepHours(newSleepHours);
    };

    /**
     * Saves the current sleep hours state to the backend.
     */
    const handleSaveSleepHours = () => {
        if (!settingsRepository) return;
        settingsRepository.updateSleepHours({
            sleepHours: [...sleepHours],
        }).subscribe({
            next: res => {
                if (res.status) {
                    toast.success(res.message || res.msg);
                    getUserConstraintsAndTimeZoneSettings();
                } else {
                    toast.error(res.message || res.msg);
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
    };

    /**
     * Saves the time limit settings.
     */
    const handleSaveTimeLimits = () => {
        if (!settingsRepository) return;
        settingsRepository.updateDailyLimits({
            enabled: timeLimitOn,
            limits: {
                TASK: {
                    hours: taskLimit,
                },
                ROUTINE: {
                    hours: routineLimit,
                }
            },
        }).subscribe({
            next: res => {
                if (res.status) {
                    toast.success(res.message || res.msg);
                    getUserConstraintsAndTimeZoneSettings();
                } else {
                    toast.error(res.message || res.msg);
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
    };

    /**
     * Saves the timezone
     */
    const handleSaveTimezone = () => {
        if (!settingsRepository || !timeZone) return;
        settingsRepository.updateTimeZone({ timezone: timeZone.value }).subscribe({
            next: res => {
                if (res.status) {
                    toast.success(res.message || res.msg);
                } else {
                    toast.error(res.message || res.msg);
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
    };

    useEffect(() => {
        getUserConstraintsAndTimeZoneSettings();
    }, [getUserConstraintsAndTimeZoneSettings]);

    useEffect(() => {
        setTaskLimit(taskLimitHours || 8);
        setRoutineLimit(routineLimitHours || 15);
        setTimeLimitOn(dailyLimitsEnabled);
    }, [
        taskLimitHours,
        routineLimitHours,
        dailyLimitsEnabled,
    ]);

    useEffect(() => {
        if (!originalTimeZone) return;
        setTimeZone(originalTimeZone);
    }, [originalTimeZone]);


    return (
        <div className="p-10 max-w-3xl mx-auto h-full overflow-y-auto ml-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings daily limit time</h1>
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Sleeping hour</h2>

            <div className="space-y-4 mb-4">
                {sleepHours.map((hourRange, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        <TimePicker
                            value={hourRange.startTime}
                            onChange={(time: string) => handleSleepTimeChange(index, 'startTime', time)}
                        />
                        <span className="text-gray-500">End hour</span>
                        <TimePicker
                            value={hourRange.endTime}
                            onChange={(time: string) => handleSleepTimeChange(index, 'endTime', time)}
                        />
                        <button
                            onClick={() => handleDeleteSleepHour(index)}
                            className="p-2 cursor-pointer text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                            aria-label="Delete sleep hour"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ))}
            </div>

            <Button
                onClick={handleAddNewSleepHour}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-none text-sm font-medium cursor-pointer"
            >
                <Plus size={16} className="mr-2" />
                Add new sleep hour
            </Button>

            <div className="mt-6">
                <Button onClick={handleSaveSleepHours} className="bg-teal-400 text-white hover:bg-teal-600 cursor-pointer">
                    Save
                </Button>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mt-6">Time limits</h2>
            <div className="flex items-center space-x-3 mb-4 mt-5">
                <Checkbox
                    id="c1"
                    checked={timeLimitOn}
                    onCheckedChange={setTimeLimitOn}
                />
                <label
                    htmlFor="c1"
                    className="text-sm cursor-pointer font-medium text-gray-800 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    Turn on time limit
                </label>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                The system will auto warn you when you arrange over the time limit
            </p>

            <div className="flex items-center space-x-4 mb-2">
                <span className="w-20 text-sm font-medium text-gray-700">Task</span>
                <input
                    type="number"
                    disabled={!timeLimitOn}
                    value={taskLimit}
                    onChange={(e) => setTaskLimit(Number(e.target.value))}
                    className="w-28 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm"
                />
            </div>
            <div className="flex items-center space-x-4 mb-4">
                <span className="w-20 text-sm font-medium text-gray-700">Routine</span>
                <input
                    type="number"
                    disabled={!timeLimitOn}
                    value={routineLimit}
                    onChange={(e) => setRoutineLimit(Number(e.target.value))}
                    className="w-28 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm"
                />
            </div>
            <p className="text-xs text-gray-500 mb-6">
                You should put the integer numbers
            </p>

            <Button
                className="bg-teal-400 text-white hover:bg-teal-600 cursor-pointer"
                onClick={handleSaveTimeLimits}
            >
                Save
            </Button>

            <hr className="my-8 border-gray-200" />

            <h2 className="text-lg font-semibold text-gray-800 mb-6">Time zone</h2>
            <div className="w-full max-w-md mb-6">
                <TimezonePicker initTimeZone={timeZone} onChange={setTimeZone} />
            </div>

            <Button
                className="bg-teal-400 text-white hover:bg-teal-600 cursor-pointer"
                onClick={handleSaveTimezone}
            >
                Save
            </Button>
            {alertMessage && (
                <AlertModal
                    alertMessage={alertMessage}
                    onClose={() => setAlertMessage(null)}
                />
            )}
        </div>
    );
};