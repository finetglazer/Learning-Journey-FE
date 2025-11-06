"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { findTimezone } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { settingsRepository } from "../../settings-repository";
import { TimezonePicker } from "./components/time-zone-picker";
import { TimePicker } from "./components/time-picker";

export const LimitTimeAndTimeZone = () => {
    const [sleepHours, setSleepHours] = useState<{ startTime: string, endTime: string }[]>([]);
    const [timeLimitOn, setTimeLimitOn] = useState<CheckedState>(false);
    const [taskLimit, setTaskLimit] = useState<number | string>(8);
    const [routineLimit, setRoutineLimit] = useState<number | string>(15);
    const [timezone, setTimezone] = useState({ label: "(UTC+00:00) London, Dublin, Lisbon", value: "Europe/London", utc: "UTC+00:00" });

    useEffect(() => {
        setTaskLimit(Number(localStorage.getItem("taskLimitHours")) || "undefined");
        setRoutineLimit(Number(localStorage.getItem("routineLimitHours")) || "undefined");
        setTimeLimitOn(localStorage.getItem("dailyLimitsEnabled") === "1" ? true : false);
    }, [
        localStorage.getItem("taskLimitHours"),
        localStorage.getItem("routineLimitHours"),
        localStorage.getItem("dailyLimitsEnabled"),
    ]);

    const getUserConstraintsAndTimeZoneSettings = () => {
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
                    setTimezone(findTimezone(utc));
                    // Save metrics to local storage
                    localStorage.setItem("timezone", timezone);
                }
            },
            error: err => { },
        });
    };

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
        // Here you would call your repository update function
        settingsRepository.updateSleepHours(sleepHours).subscribe({
            next: res => {
                if (res.status) {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
            },
            error: err => toast.error("Failed to save sleep hours.")
        });
    };

    /**
     * Saves the time limit settings.
     */
    const handleSaveTimeLimits = () => {
        settingsRepository.updateDailyLimits({
            enabled: timeLimitOn,
            taskLimit: parseInt(taskLimit),
            routineLimit: parseInt(routineLimit)
        }).subscribe({
            next: res => {
                if (res.status) {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
            },
            error: err => toast.error("Failed to save time limits.")
        });
    };

    /**
     * Saves the timezone.
     */
    const handleSaveTimezone = () => {
        const timezoneString = `${timezone.utc} ${timezone.value}`;
        settingsRepository.updateTimeZone(timezoneString).subscribe({
            next: res => {
                if (res.status) {
                    toast.success(res.message);
                    localStorage.setItem("timezone", timezoneString);
                } else {
                    toast.error(res.message);
                }
            },
            error: err => toast.error("Failed to save timezone.")
        });
    };

    useEffect(() => {
        getUserConstraintsAndTimeZoneSettings();
    }, []);

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
                <Button onClick={handleSaveSleepHours} className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-700 cursor-pointer">
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
                    onChange={(e) => setTaskLimit(e.target.value)}
                    className="w-28 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm"
                />
            </div>
            <div className="flex items-center space-x-4 mb-4">
                <span className="w-20 text-sm font-medium text-gray-700">Routine</span>
                <input
                    type="number"
                    disabled={!timeLimitOn}
                    value={routineLimit}
                    onChange={(e) => setRoutineLimit(e.target.value)}
                    className="w-28 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm"
                />
            </div>
            <p className="text-xs text-gray-500 mb-6">
                You should put the integer numbers
            </p>

            <Button className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-900 cursor-pointer">
                Save
            </Button>

            <hr className="my-8 border-gray-200" />

            <h2 className="text-lg font-semibold text-gray-800 mb-6">Time zone</h2>
            <div className="w-full max-w-md mb-6">
                <TimezonePicker initTimeZone={timezone} onChange={setTimezone} />
            </div>

            <Button className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow hover:bg-blue-900 cursor-pointer">
                Save
            </Button>
        </div>
    );
};