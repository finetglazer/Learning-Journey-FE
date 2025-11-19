import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/model/project-management";
import { CheckCircle2, Clock, HelpCircle, Loader2 } from "lucide-react";
import { memo } from "react";

export const STATUS_CONFIG: Record<TaskStatus, { label: string, icon: any, color: string }> = {
    [TaskStatus.TO_DO]: { label: "To do", icon: HelpCircle, color: "text-slate-500" },
    [TaskStatus.IN_PROGRESS]: { label: "In progress", icon: Loader2, color: "text-indigo-500" },
    [TaskStatus.IN_REVIEW]: { label: "In review", icon: Clock, color: "text-blue-500" },
    [TaskStatus.DONE]: { label: "Completed", icon: CheckCircle2, color: "text-green-500" },
};

function StatusSelectorBase({ value, onChange }: { value: string, onChange?: (val: TaskStatus) => void }) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[140px] h-8 ml-10 border-none shadow-none bg-transparent hover:bg-slate-100 focus:ring-0">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                        <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-1.5">
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

export const StatusSelector = memo(StatusSelectorBase);