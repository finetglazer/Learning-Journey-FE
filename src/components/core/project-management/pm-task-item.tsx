"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PM_Task, PM_TaskAssignee, TaskPriority, TaskStatus, TeamMember } from '@/model/project-management';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarClock, Circle, Check, MoreHorizontal, Trash2, X, RotateCcw, UserPlus } from 'lucide-react';
import { memo, useCallback, useState, useMemo, useEffect, useContext } from 'react';
import { PrioritySelector } from '../sidebar/pages/project/tabs/list-tab/components/priority-selector';
import { StatusSelector } from '../sidebar/pages/project/tabs/list-tab/components/status-selector';
import { PM_DraggableItemData } from './type';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TaskAssigneeModal from './task-assignee-modal';
import { TeamProjectContext, TeamProjectContextProps } from '../sidebar/pages/project/team-project-context';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type TaskDraft = {
    name: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignees: PM_TaskAssignee[];
};

export type TaskItemProps = {
    task: PM_Task;
    onUpdateTask: (taskId: number, updatedTask: any) => void;
    onDeleteTask: (taskId: number) => void;
}

const TASK_LIST_GRID_LAYOUT = "grid grid-cols-[1fr_150px_150px_120px_50px] gap-4 items-center px-4";

function PM_TaskItemBase({ task, onUpdateTask, onDeleteTask }: TaskItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);

    const [draft, setDraft] = useState<TaskDraft>({
        name: task.name,
        status: task.status,
        priority: task.priority,
        assignees: task.assignees,
    });

    // Dirty State Detection (useMemo is critical here)
    const isDirty = useMemo(() => {
        return draft.name !== task.name ||
            draft.status !== task.status ||
            draft.priority !== task.priority ||
            draft.assignees !== task.assignees;
    }, [draft, task]);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.taskIdStr,
        data: {
            type: 'Task',
            parentId: task.phaseIdStr,
            task: task,
        } as PM_DraggableItemData,
    });

    const {
        members,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleStatusChange = useCallback((newStatus: TaskStatus) => {
        setDraft(prev => ({ ...prev, status: newStatus }));
    }, []);

    const handlePriorityChange = useCallback((newPriority: TaskPriority) => {
        setDraft(prev => ({ ...prev, priority: newPriority }));
    }, []);

    const handleStartEdit = useCallback(() => {
        setIsEditing(true);
        setDraft(prev => ({ ...prev, name: task.name }));
    }, [task.name]);

    const handleSave = useCallback(() => {
        if (!isDirty) {
            setIsEditing(false);
            return;
        }

        const updatedTask: any = {
            ...task,
            name: draft.name.trim(),
            status: draft.status,
            priority: draft.priority,
            assigneeIds: (draft.assignees || []).map((assignee: any) => assignee.userId)
        };

        onUpdateTask(task.taskId, updatedTask);
        setIsEditing(false);
    }, [isDirty, draft, task, onUpdateTask]);

    // Revert all changes
    const handleRevert = useCallback(() => {
        setDraft({
            name: task.name,
            status: task.status,
            priority: task.priority,
            assignees: task.assignees,
        });
        setIsEditing(false);
    }, [task.name, task.status, task.priority, task.assignees]);

    const handleDelete = useCallback(() => {
        onDeleteTask(task.taskId);
    }, [task.taskId, onDeleteTask]);

    const handleUpdateTaskAssignees = useCallback((updatedTaskAssignees: PM_TaskAssignee[]) => {
        onUpdateTask(task.taskId, {
            ...draft,
            assigneeIds: updatedTaskAssignees.map((assignee: PM_TaskAssignee) => assignee.userId),
        });
    }, [onUpdateTask]);

    const TaskTitleContent = isEditing ? (
        <div className="flex items-center gap-2 flex-grow min-w-0">
            <Input
                value={draft.name}
                onChange={(e) => setDraft(prev => ({ ...prev, name: e.target.value }))}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleRevert();
                }}
                className="h-7 py-0 px-2 text-sm font-medium flex-grow min-w-0"
                autoFocus
            />
        </div>
    ) : (
        <div
            className="flex items-center gap-3 min-w-0 flex-grow"
            onDoubleClick={handleStartEdit}
        >
            <button className="text-gray-300 hover:text-gray-500">
                <Circle size={18} />
            </button>
            <span className="text-sm font-medium text-gray-400">{task.key}</span>
            <span className="text-sm text-gray-900 font-medium truncate">{task.name}</span>
        </div>
    );

    // UI for Save/Revert buttons, visible when any field is dirty OR when editing name
    const DirtyStateButtons = (isDirty || isEditing) && (
        <div className="flex items-center gap-1 ml-auto">
            {/* Revert Button (Red X or RotateCcw icon) */}
            <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 p-0 text-red-500 hover:bg-red-50"
                onClick={handleRevert}
                title="Revert changes"
            >
                <RotateCcw size={16} />
            </Button>

            {/* Save Button (Green Check) */}
            <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 p-0 text-green-600 hover:bg-green-50"
                onClick={handleSave}
                disabled={!draft.name.trim() || !isDirty} // Disable if name is empty or nothing changed
                title="Save changes"
            >
                <Check size={16} />
            </Button>
        </div>
    );

    const handleOpenAssigneeModal = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsAssigneeModalOpen(true);
    }, []);

    const mappedTaskAssignees = task.assignees.map((assignee: PM_TaskAssignee) => ({
        ...assignee,
        name: (members.find((member: TeamMember) => member.userId === assignee.userId)?.name),
        email: (members.find((member: TeamMember) => member.userId === assignee.userId)?.email),
    }));
    const visibleAssignees = mappedTaskAssignees.slice(0, 2)
    const remainingCount = task.assignees.length - visibleAssignees.length;
    const remainingAssignees = mappedTaskAssignees.slice(2);

    // Effect to reset draft state if the original task prop changes (e.g., due to parent state update)
    useEffect(() => {
        setDraft({
            name: task.name,
            status: task.status,
            priority: task.priority,
            assignees: task.assignees,
        });
    }, [task.name, task.status, task.priority, task.assignees]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`${TASK_LIST_GRID_LAYOUT} py-2 border-t border-gray-50 hover:bg-gray-50 group cursor-grab`}
        >
            {/* Column 1: Name (Flexible width) */}
            <div className="flex items-center gap-3 min-w-0 pl-12">
                {TaskTitleContent}

                {/* Dropdown Menu - Hidden when editing, replaced by Save/Revert buttons when dirty */}
                {!(isEditing || isDirty) && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-black hover:bg-gray-300 hover:rounded-2xl">
                                <MoreHorizontal size={16} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem className="cursor-pointer" onClick={handleStartEdit}>
                                <span>Edit Name</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <CalendarClock className="mr-2 h-4 w-4" />
                                <span>Edit timeline</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 cursor-pointer focus:bg-red-50"
                                onClick={handleDelete}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete Task</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Column 2: Status Dropdown (Fixed width 150px) */}
            <div>
                <StatusSelector
                    value={draft.status} // Use draft value
                    onChange={handleStatusChange}
                />
            </div>

            {/* Column 3: Priority Dropdown (Fixed width 150px) */}
            <div>
                <PrioritySelector
                    value={draft.priority} // Use draft value
                    onChange={handlePriorityChange}
                />
            </div>

            {/* Column 4: Assignees (Fixed width 120px) */}
            <div className="flex items-center ml-15 -space-x-2">
                {/* 1. Render up to 2 visible avatars */}
                {visibleAssignees.map(a => (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Avatar key={a.userId} className="w-6 h-6 border-2 border-white">
                                <AvatarImage src={a.avatarUrl || (a as any).avatar_url} />
                                <AvatarFallback>{a.name ? a.name.charAt(0) : 'U'}</AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent className="flex flex-col p-2 text-sm bg-black text-white rounded shadow-lg">
                            <span key={a.userId} className="truncate">
                                {a.name} ({a.email})
                            </span>
                        </TooltipContent>
                    </Tooltip>
                ))}

                {/* 2. Render the remaining count placeholder, if needed */}
                {remainingCount > 0 && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Avatar className="w-6 h-6 border-2 border-white bg-gray-400 text-xs font-medium text-white cursor-pointer">
                                <AvatarFallback>
                                    +{remainingCount}
                                </AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>

                        {/* 3. Tooltip Content */}
                        <TooltipContent className="flex flex-col p-2 text-sm bg-black text-white rounded shadow-lg">
                            <p className="font-bold mb-1">Other Assignees:</p>
                            {remainingAssignees.map(a => (
                                <span key={a.userId} className="truncate">
                                    {a.name} ({a.email})
                                </span>
                            ))}
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>

            {/* Column 5: Assignee Edit Button & Save/Revert */}
            <div className="flex items-center justify-end">
                {!(isEditing || isDirty) && (
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-gray-400 hover:text-indigo-600"
                        onClick={handleOpenAssigneeModal}
                        title="Edit Assignees"
                    >
                        <UserPlus size={16} />
                    </Button>
                )}
                {DirtyStateButtons}
            </div>
            {/* Task Assignee Modal */}
            <TaskAssigneeModal
                isOpen={isAssigneeModalOpen}
                onClose={() => setIsAssigneeModalOpen(false)}
                currentAssignees={draft.assignees}
                onSave={handleUpdateTaskAssignees}
                teamMembers={members}
            />
        </div>
    );
};

export const PM_TaskItem = memo(PM_TaskItemBase);