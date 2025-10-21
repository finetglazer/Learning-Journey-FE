"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, Circle, CircleX, Loader2 } from "lucide-react";

const statusConfig = {
    completed: { Icon: CheckCircle2, color: "text-green-500", label: "Completed" },
    "in-progress": { Icon: Loader2, color: "text-orange-400", label: "In progress" },
    incomplete: { Icon: CircleX, color: "text-red-500", label: "Incomplete" },
    plan: { Icon: Circle, color: "text-purple-500", label: "Plan" },
};

export type Status = keyof typeof statusConfig;

interface TaskStatusDropdownProps {
    currentStatus?: Status | null;
    onStatusChange: (status: Status) => void;
}

export function TaskStatusDropdown({ currentStatus, onStatusChange }: TaskStatusDropdownProps) {
    const selectedStatusKey = currentStatus && statusConfig[currentStatus] ? currentStatus : 'plan';
    const { Icon, color, label } = statusConfig[selectedStatusKey];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 h-auto justify-start cursor-pointer">
                    <Icon className={`${color} ${selectedStatusKey === 'in-progress' ? 'animate-spin' : ''}, -mt-0.5`} size={20} />
                    <span className="text-sm text-gray-700">{label}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[99999]">
                {Object.entries(statusConfig).map(([key, { label, Icon, color }]) => (
                    <DropdownMenuItem key={key} onSelect={() => onStatusChange(key as Status)} className="cursor-pointer">
                        <Icon className={`mr-2 h-4 w-4 ${color} ${key === 'in-progress' ? 'animate-spin' : ''}`} />
                        <span>{label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}