"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppContext, AppContextProps } from '@/hooks/app-context';
import { cn, getFileIcon, getFileSize, toDayJs } from '@/lib/utils';
import { PM_Task, PM_TaskDetail, TaskAttachmentDetail, TaskPriority, TaskStatus, TeamMember } from '@/model/project-management';
import {
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    Flame,
    HelpCircle,
    Loader,
    Paperclip,
    PlusSquare,
    SignalHigh,
    SignalLow,
    SignalMedium,
    User,
} from 'lucide-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Divider } from '../divider/divider';
import { TeamProjectContext, TeamProjectContextProps } from '../sidebar/pages/project/team-project-context';
import { Button } from '@/components/ui/button';

export const STATUS_CONFIG: Record<TaskStatus, { label: string, icon: any, color: string }> = {
    [TaskStatus.TO_DO]: { label: "To do", icon: HelpCircle, color: "text-slate-500" },
    [TaskStatus.IN_PROGRESS]: { label: "In progress", icon: Loader, color: "text-indigo-500" },
    [TaskStatus.IN_REVIEW]: { label: "In review", icon: Clock, color: "text-blue-500" },
    [TaskStatus.DONE]: { label: "Completed", icon: CheckCircle2, color: "text-green-500" },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string, icon: any, color: string }> = {
    [TaskPriority.MINOR]: { label: "Minor", icon: SignalLow, color: "text-green-500" },
    [TaskPriority.MEDIUM]: { label: "Medium", icon: SignalMedium, color: "text-orange-500" },
    [TaskPriority.MAJOR]: { label: "Major", icon: SignalHigh, color: "text-red-500" },
    [TaskPriority.CRITICAL]: { label: "Critical", icon: Flame, color: "text-pink-600" },
};

const PropertyItem = ({ prefixIcon: Icon, label, value, colorClass = 'text-gray-700' }) => (
    <div className="flex items-center space-x-3 py-1.5 border-gray-100 last:border-b-0">
        <span className="w-32 text-sm text-gray-500 flex items-center space-x-2">
            {Icon && <Icon size={16} className={`text-gray-500`} />}
            <span>{label}</span>
        </span>

        <span className={`text-sm font-medium ${colorClass}`}>{value}</span>
    </div>
);

const AttachmentItem = (file: TaskAttachmentDetail) => (
    <div className="flex items-center space-x-3 py-2 border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50">
        {getFileIcon(file.extension, file.fileType)}
        <div className="flex-grow">
            <p className="text-sm font-medium truncate">{file.fileName}</p>
            <p className="text-xs text-gray-500">
                {file.uploadDate} `• ${getFileSize(file.sizeBytes)}`
            </p>
        </div>
        <ChevronRight size={16} className="text-gray-400 opacity-50" />
    </div>
);

const CommentItem = ({ user, comment }) => (
    <div className="flex space-x-3 py-3 border-gray-100 last:border-b-0">
        <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-sm text-gray-700 mt-0.5">{comment}</p>
        </div>
    </div>
);

export function TaskDetailDrawer({ task, members }: { task: PM_Task, members: TeamMember[], }) {
    const [taskDetail, setTaskDetail] = useState<PM_TaskDetail | null>(null);

    const {
        projectRepository,
    } = useContext<AppContextProps>(AppContext);

    const {
        selectedProject,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    // 1. Resolve Task Owner (first assignee)
    const ownerId = (taskDetail?.taskInfo?.assignees || []).length > 0 ? taskDetail?.taskInfo?.assignees[0].userId : null;
    const taskOwner = members.find(member => member.userId === ownerId);

    const ownerDisplay = taskOwner
        ? (
            <div className="flex items-center space-x-2">
                <Avatar className="w-5 h-5">
                    <AvatarImage src={taskOwner.avatarUrl} />
                    <AvatarFallback>{taskOwner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{taskOwner.name}</span>
            </div>
        )
        : <span className="text-gray-400">Unassigned</span>;

    // 2. Resolve Status and Priority Configs
    const statusConfig = taskDetail?.taskInfo ? STATUS_CONFIG[taskDetail?.taskInfo?.status] || { label: taskDetail?.taskInfo?.status, icon: HelpCircle, color: "text-gray-500" } : { label: "", icon: null, color: "text-gray-500" };
    const priorityConfig = taskDetail?.taskInfo ? PRIORITY_CONFIG[taskDetail?.taskInfo?.priority] || { label: taskDetail?.taskInfo?.priority, icon: SignalLow, color: "text-gray-500" } : { label: "", icon: null, color: "text-gray-500" };


    // 3. Define Property Items for Mapping
    const propertyConfigs = [
        {
            label: "Progress",
            value: statusConfig.label,
            prefixIcon: statusConfig.icon,
            valuePrefixIcon: statusConfig.icon,
            valueColor: statusConfig.color
        },
        {
            label: "Task owner",
            value: ownerDisplay,
            prefixIcon: User,
            isOwner: true
        },
        {
            label: "Urgency",
            value: priorityConfig.label,
            prefixIcon: priorityConfig.icon,
            valuePrefixIcon: priorityConfig.icon,
            valueColor: priorityConfig.color
        },
        {
            label: "Start date",
            value: taskDetail?.taskInfo?.startDate ? toDayJs(taskDetail?.taskInfo?.startDate, 0).format("DD/MM/YYYY") : "",
            prefixIcon: Calendar
        },
        {
            label: "Deadline",
            value: taskDetail?.taskInfo?.endDate ? toDayJs(taskDetail?.taskInfo?.endDate, 0).format("DD/MM/YYYY") : "",
            prefixIcon: Calendar
        },
    ];

    const getTaskDetail = useCallback(() => {
        if (!projectRepository || !selectedProject) {
            return;
        }

        const subscription = projectRepository.getTaskDetail({
            projectId: selectedProject.id,
            taskId: task.taskId,
        })
            .subscribe({
                next: res => {
                    if (res?.status) {
                        setTaskDetail(res?.data);
                    }
                    else {
                        toast.error(res?.message || res?.msg);
                    }
                },
                error: err => { }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [task, projectRepository, selectedProject]);

    useEffect(() => {
        getTaskDetail();
    }, [task]);

    return (
        <div className="flex h-full flex-col bg-white">
            {/* Header / Title */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">{taskDetail?.taskInfo?.name || "---"}</h2>
            </div>

            <ScrollArea className="flex-1 px-4">
                <div className="py-4">

                    {/* --- 1. Properties Section --- */}
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                        Properties
                    </h3>
                    <div className="space-y-1">
                        {propertyConfigs.map((prop, index) => {
                            const PrefixIcon = prop.prefixIcon;
                            const ValueIcon = prop.valuePrefixIcon;

                            return (
                                <div key={index} className="flex items-center space-x-3 py-1.5 border-gray-100 last:border-b-0">
                                    {/* 🛠️ Property Name (W-32): Icon + Label */}
                                    <span className="w-32 text-sm text-gray-500 flex items-center space-x-2">
                                        {/* <PrefixIcon size={16} className={`text-gray-500`} /> */}
                                        <span>{prop.label}</span>
                                    </span>

                                    {/* 🛠️ Value: Icon (for progress/urgency) + Value Text */}
                                    <span className={`text-sm font-medium ${prop.valueColor || 'text-gray-700'}`}>
                                        {/* Render the value icon only if it's Status or Priority */}
                                        {(prop.label === 'Progress' || prop.label === 'Urgency') && ValueIcon && (
                                            <ValueIcon size={20} className={cn(prop.valueColor, `mr-1 inline-block`)} />
                                        )}

                                        {/* If Task Owner, render the component directly */}
                                        {prop.isOwner ? prop.value : <span>{prop.value}</span>}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <Divider className={"w-[calc(100%-10px)] mt-5"} />

                    {/* --- 2. Attachments Section --- */}
                    <div className="flex items-center justify-between group">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-6 mb-3">
                            Attachments
                        </h3>
                        <Button variant="ghost" className="mr-3 text-gray-500 cursor-pointer hover:bg-transparent">
                            <PlusSquare size={24} className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="space-y-1">
                        {(taskDetail?.attachments || []).map((file, index) => (
                            <AttachmentItem key={index} {...file} />
                        ))}
                    </div>

                    <Divider className={"w-[calc(100%-10px)] mt-5"} />

                    {/* --- 3. Discussion Section (MOCK) --- */}
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-6 mb-3">
                        Discussion
                    </h3>
                    <div className="space-y-2">
                        {/* {MOCK_DISCUSSIONS.map((discussion, index) => (
                            <CommentItem key={index} {...discussion} />
                        ))} */}
                    </div>
                </div>
            </ScrollArea>

            {/* --- 4. Write a Comment Input --- */}
            <div className="p-4 border-t border-gray-200">
                <Input
                    placeholder="Write a comment"
                    className="w-full h-10 pr-10"
                />
            </div>
        </div>
    );
};