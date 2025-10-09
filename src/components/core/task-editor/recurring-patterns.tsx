"use client";

import { cn } from "@/lib/utils";

const dayLabels = [
    "Every Sunday",
    "Every Monday",
    "Every Tuesday",
    "Every Wednesday",
    "Every Thursday",
    "Every Friday",
    "Every Saturday",
];

interface RecurringPatternsProps {
    selectedPatterns: number[];
    onPatternChange: (patterns: number[]) => void;
}

export function RecurringPatterns({ selectedPatterns = [], onPatternChange }: RecurringPatternsProps) {
    const handleToggle = (dayIndex: number) => {
        const isSelected = selectedPatterns.includes(dayIndex);

        let newPatterns: number[];

        if (isSelected) {
            newPatterns = selectedPatterns.filter(p => p !== dayIndex);
        } else {
            newPatterns = [...selectedPatterns, dayIndex];
        }

        onPatternChange(newPatterns.sort((a, b) => a - b));
    };

    return (
        <div className="space-y-1 text-gray-700 text-sm">
            {dayLabels.map((label, index) => (
                <div
                    key={index}
                    onClick={() => handleToggle(index)}
                    className={cn(
                        "p-2 rounded-md cursor-pointer hover:bg-gray-100",
                        {
                            "bg-blue-100 text-blue-800 font-semibold": selectedPatterns.includes(index),
                        }
                    )}
                >
                    {label}
                </div>
            ))}
        </div>
    );
}