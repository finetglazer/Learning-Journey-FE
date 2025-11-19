import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TaskPriority } from "@/model/project-management";
import { Flame, SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import { memo } from "react";


export const PRIORITY_CONFIG: Record<TaskPriority, { label: string, icon: any, color: string }> = {
    [TaskPriority.MINOR]: { label: "Minor", icon: SignalLow, color: "text-green-500" },
    [TaskPriority.MEDIUM]: { label: "Medium", icon: SignalMedium, color: "text-orange-500" },
    [TaskPriority.MAJOR]: { label: "Major", icon: SignalHigh, color: "text-red-500" },
    [TaskPriority.CRITICAL]: { label: "Critical", icon: Flame, color: "text-pink-600" },
};

function PrioritySelectorBase({ value, onChange }: { value: TaskPriority, onChange?: (val: TaskPriority) => void }) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[140px] h-8 ml-10 border-none shadow-none bg-transparent hover:bg-slate-100 focus:ring-0">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(PRIORITY_CONFIG).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                        <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                                <Icon className={cn("w-4 h-4", config.color)} />
                                <span>{config.label}</span>
                            </div>
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    );
};

export const PrioritySelector = memo(PrioritySelectorBase);