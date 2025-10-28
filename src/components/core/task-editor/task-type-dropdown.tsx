"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, CheckSquare, Repeat } from "lucide-react";
import { useContext } from "react";
import { CalendarContext, CalendarContextInterface } from "../calendar/calendar-context";

export const typeConfig = {
    event: { label: "Event", Icon: Calendar, color: "bg-blue-400" },
    task: { label: "Task", Icon: CheckSquare, color: "bg-pink-500" },
    "big-task": { label: "Big task", Icon: CheckSquare, color: "bg-pink-500" },
    routine: { label: "Routine", Icon: Repeat, color: "bg-green-400" },
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
                <Button variant="ghost" className={`flex items-center cursor-pointer gap-2 rounded-md px-3 py-1 h-auto text-xs font-medium text-white hover:text-white ${color}`}>
                    <Icon size={14} />
                    {label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[99999]">
                {Object.entries(customTypeConfig).map(([key, { label, Icon }]) => (
                    <DropdownMenuItem key={key} onSelect={() => onTypeChange(key as TaskType)} className="cursor-pointer">
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}