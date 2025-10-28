"use client";

import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";

// Ensure weekday plugin is loaded to get consistent day indexing
dayjs.extend(weekday);

const dayNameMap = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
];

const dayLabels = [
    "Every Monday",
    "Every Tuesday",
    "Every Wednesday",
    "Every Thursday",
    "Every Friday",
    "Every Saturday",
    "Every Sunday",
];

interface RecurringPatternsProps {
    selectedPatterns: string[];
    onPatternChange: (patterns: string[]) => void;
}

export function RecurringPatterns({
    selectedPatterns = [],
    onPatternChange,
}: RecurringPatternsProps) {
    const handleToggle = (dayName: string) => {
        const isSelected = selectedPatterns.includes(dayName);

        let newPatterns: string[];

        if (isSelected) {
            newPatterns = selectedPatterns.filter((p) => p !== dayName);
        } else {
            newPatterns = [...selectedPatterns, dayName];
        }

        onPatternChange(newPatterns);
    };

    return (
        <div className="space-y-1 text-gray-700 text-sm">
            {dayLabels.map((label, index) => {
                const dayName = dayNameMap[index];

                return (
                    <div
                        key={dayName}
                        onClick={() => handleToggle(dayName)}
                        className={cn(
                            "p-2 rounded-md cursor-pointer hover:bg-gray-100",
                            {
                                "bg-blue-100 text-blue-800 font-semibold":
                                    selectedPatterns.includes(dayName),
                            }
                        )}
                    >
                        {label}
                    </div>
                );
            })}
        </div>
    );
}
