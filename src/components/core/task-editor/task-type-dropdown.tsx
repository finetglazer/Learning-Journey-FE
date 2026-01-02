"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, CheckSquare, ChevronDown, Repeat, Users } from "lucide-react";
import { useContext } from "react";
import { CalendarContext, CalendarContextInterface } from "../calendar/calendar-context";

export const typeConfig = {
    event: { label: "Event", Icon: Calendar, color: "bg-teal-blue" },
    task: { label: "Task", Icon: CheckSquare, color: "bg-pink-500" },
    "big-task": { label: "Big task", Icon: CheckSquare, color: "bg-pink-500" },
    routine: { label: "Routine", Icon: Repeat, color: "bg-green-400" },
    "project_work": { label: "Project task", Icon: Users, color: "bg-yellow-500" },
};

export type TaskType = keyof typeof typeConfig;

interface TaskTypeDropdownProps {
    currentType?: TaskType | null;
    onTypeChange: (type: TaskType) => void;
}

export function TaskTypeDropdown({ currentType, onTypeChange }: TaskTypeDropdownProps) {
    const selectedTypeKey = (currentType && typeConfig[currentType]) ? currentType : 'task';

    const {
        currentView,
    } = useContext<CalendarContextInterface>(CalendarContext);

    const { label, Icon, color } = typeConfig[selectedTypeKey];

    const { "big-task": bigTask, ...typeConfigWithoutBigTask } = typeConfig;

    const customTypeConfig = currentView !== 'day' ? typeConfig : typeConfigWithoutBigTask;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={`flex items-center cursor-pointer gap-2 rounded-lg px-3 py-1 h-auto text-xs font-medium text-white hover:text-white ${color.startsWith('!') ? '' : color}`}
                    style={color.startsWith('!') ? {} : {
                        backgroundColor: {
                            "bg-teal-blue": "#33BFFF",
                            "bg-pink-500": "#ec4899", // tailwind pink-500
                            "bg-green-400": "#4ade80", // tailwind green-400
                            "bg-yellow-500": "#eab308" // tailwind yellow-500
                        }[color] || color
                    }}
                >
                    <Icon size={14} />
                    {label}
                    <ChevronDown size={14} className="ml-1 opacity-80" />
                </Button>
            </DropdownMenuTrigger>
            {/* Dropdown menu would not contain PROJECT_WORK type */}
            <DropdownMenuContent className="z-[99999]">
                {Object.entries(customTypeConfig)
                    // Filter out the specific key here
                    .filter(([key]) => key !== 'project_work')
                    .map(([key, { label, Icon }]) => (
                        <DropdownMenuItem key={key} onSelect={() => onTypeChange(key as TaskType)} className="cursor-pointer">
                            <Icon className="mr-2 h-4 w-4" />
                            <span> {label}</span>
                        </DropdownMenuItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}