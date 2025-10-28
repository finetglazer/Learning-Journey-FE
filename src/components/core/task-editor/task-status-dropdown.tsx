"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, CircleDashed } from "lucide-react";

const statusConfig = {
    complete: { Icon: CheckCircle2, color: "text-green-500", label: "Complete" },
    incomplete: { Icon: CircleDashed, color: "text-red-500", label: "Incomplete" },
};

export type Status = keyof typeof statusConfig;

interface TaskStatusDropdownProps {
    currentStatus?: Status;
    onStatusChange: (status: Status) => void;
}

export function TaskStatusDropdown({
    currentStatus,
    onStatusChange,
}: TaskStatusDropdownProps) {
    const selectedStatusKey =
        currentStatus && statusConfig[currentStatus] ? currentStatus : "incomplete";
    const { Icon, color, label } = statusConfig[selectedStatusKey];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 h-auto justify-start cursor-pointer"
                >
                    <Icon className={`${color} -mt-0.5`} size={20} />
                    <span className="text-sm text-gray-700">{label}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[99999]">
                {Object.entries(statusConfig).map(
                    ([key, { label, Icon, color }]) => (
                        <DropdownMenuItem
                            key={key}
                            onSelect={() => onStatusChange(key as Status)}
                            className="cursor-pointer"
                        >
                            <Icon className={`mr-2 h-4 w-4 ${color}`} />
                            <span>{label}</span>
                        </DropdownMenuItem>
                    )
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
