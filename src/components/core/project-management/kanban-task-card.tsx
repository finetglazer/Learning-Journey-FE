"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PM_Task, ProjectMembershipRole, TaskPriority, TeamMember } from '@/model/project-management';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Edit } from 'lucide-react';
import React, { useContext } from 'react';
import { TeamProjectContext, TeamProjectContextProps, TeamProjectTab } from '../sidebar/pages/project/team-project-context';
import { PRIORITY_CONFIG } from './task-detail-drawer';
import { cn, getFallbackName } from '@/lib/utils';

import { useRouter, useParams } from 'next/navigation';
import { getProjectDetailRoute } from '@/const/routes-const';

export interface TaskCardProps {
    task: PM_Task;
}

const getPriorityIcon = (priority: TaskPriority) => {
    if (!priority || !PRIORITY_CONFIG[priority]) {
        return {
            Icon: () => <></>,
            colorClass: "",
            label: ""
        };
    }

    const config = PRIORITY_CONFIG[priority];

    return {
        Icon: config.icon,
        colorClass: config.color,
        label: config.label
    };
};


const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const router = useRouter();
    const params = useParams();
    const projectId = Number(params?.projectId);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: task.taskIdStr,
        data: {
            type: 'Task',
            task,
        },
    });

    const {
        members: teamMembers,
        deliverables,
        currentMember,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    // 🆕 RBAC Check
    const canEdit = currentMember?.role === ProjectMembershipRole.OWNER;

    const style = {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 10 : 1,
        boxShadow: isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 'none',
    };

    const deliverableName = React.useMemo(() => {
        const deliverable = deliverables.find(d =>
            d.phases.some(p => p.phaseId === task.phaseId)
        );
        return deliverable ? deliverable.name : 'Unknown Deliverable';
    }, [deliverables, task.phaseId]);

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Deep link to task on List tab
        router.push(getProjectDetailRoute(projectId, "list", task.taskId));
    };

    const { Icon: PriorityIconComponent, colorClass, label } = getPriorityIcon(task.priority);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...(canEdit ? attributes : {})}
            {...(canEdit ? listeners : {})}
            className={cn(`
                bg-white p-4 mb-3 rounded-lg shadow-sm 
                border transition-all
                group hover:bg-yellow-300
                ${isDragging ? 'border-blue-400 opacity-0 ring-2 ring-blue-300' : 'border-gray-200'}
            `, (canEdit ? "cursor-grab" : "cursor-default"))}
        >
            {/* --- Task Header --- */}
            <div className="flex justify-between items-start mb-2">

                {/* Priority Icon and Task Name */}
                <div className="flex items-center space-x-2">
                    {/* Render the Priority Icon component with the size and color class */}
                    <h4 className="font-semibold text-gray-800 text-md truncate">
                        {task.name}
                    </h4>
                </div>
                <div className="flex justify-between items-center gap-3 mb-2">
                    <button
                        onClick={handleEditClick}
                        className="p-1 rounded-sm text-gray-400 group-hover:text-gray-600 hover:bg-yellow-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                        title="Edit Task"
                    >
                        <Edit size={20} />
                    </button>
                    <PriorityIconComponent
                        size={30}
                        className={colorClass}
                        title={`Priority: ${label}`}
                    />
                </div>
            </div>

            <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mb-5 cursor-pointer">
                {deliverableName}
            </div>

            {/* --- Task Footer (Assignees) --- */}
            <div className="flex items-center justify-between">
                <div className="flex -space-x-2 overflow-hidden">
                    {/* Display up to 3 assignees */}
                    {task.assignees.slice(0, 3).map((assignee) => {
                        const member = teamMembers.find(member => member.userId === assignee.userId);
                        return (
                            <Tooltip key={assignee.userId}>
                                <TooltipTrigger asChild>
                                    <Avatar className="w-8 h-8 border-2 border-white rounded-full">
                                        <AvatarImage src={assignee.avatarUrl || (assignee as any).avatar_url} alt={member?.name} />
                                        <AvatarFallback>{getFallbackName(member?.name)}</AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{member?.name}</p>
                                </TooltipContent>
                            </Tooltip>
                        )
                    }
                    )}
                    {(task.assignees || []).length - 3 > 0 && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar className="w-8 h-8 border-2 border-white rounded-full">
                                    <AvatarFallback>+{(task.assignees || []).length - 3}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="font-medium">More members:</p>
                                <ul className="list-disc list-inside">
                                    {(task.assignees.slice(4)).map(assignee => {
                                        const assigneeName = teamMembers.find((member: TeamMember) => member.userId === assignee.userId)?.name;
                                        return (
                                            <li key={assignee.userId}>{assigneeName}</li>
                                        )
                                    })}
                                </ul>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;