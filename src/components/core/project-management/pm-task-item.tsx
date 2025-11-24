"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PM_Task, PM_TaskAssignee, ProjectMembershipRole, TaskPriority, TaskStatus, TeamMember } from '@/model/project-management';
import { projectRepository } from '@/repository/project-repository';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, Circle, MoreHorizontal, RotateCcw, UserPlus, X } from 'lucide-react';
import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { finalize } from 'rxjs';
import { toast } from 'sonner';
import { AlertMessage, AlertModal } from '../alert-modal/alert-modal';
import { PrioritySelector } from '../sidebar/pages/project/tabs/list-tab/components/priority-selector';
import { StatusSelector } from '../sidebar/pages/project/tabs/list-tab/components/status-selector';
import { TeamProjectContext, TeamProjectContextProps } from '../sidebar/pages/project/team-project-context';
import TaskAssigneeModal from './task-assignee-modal';
import { TaskDetailDrawer } from './task-detail-drawer';
import { PM_DraggableItemData } from './type';

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

// --- Helper function for deep comparison (needed for isDirty assignees check) ---
const assigneesAreEqual = (a: PM_TaskAssignee[], b: PM_TaskAssignee[]) => {
    if (a.length !== b.length) return false;
    const aIds = a.map(u => u.userId).sort().join(',');
    const bIds = b.map(u => u.userId).sort().join(',');
    return aIds === bIds;
};


function PM_TaskItemBase({ task, onUpdateTask, onDeleteTask }: TaskItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isAssigneeModalOpen, setIsAssigneeModalOpen] = useState(false);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
    const [draft, setDraft] = useState<TaskDraft>({
        name: task.name,
        status: task.status,
        priority: task.priority,
        assignees: task.assignees,
    });
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

    const {
        currentMember,
        members,
        selectedProject,
        getProjectStructure, // Used for mandatory refresh after mutation/delete
    } = useContext<TeamProjectContextProps>(TeamProjectContext);
    
    // 🆕 RBAC CHECK: Determine permissions
    const isOwner = currentMember?.role === ProjectMembershipRole.OWNER;
    const canEditFull = isOwner;
    const canEditStatusOnly = isOwner || currentMember?.role === ProjectMembershipRole.MEMBER;

    // Dirty State Detection (useMemo is critical here)
    const isDirty = useMemo(() => {
        return draft.name !== task.name ||
            draft.status !== task.status ||
            draft.priority !== task.priority ||
            !assigneesAreEqual(draft.assignees, task.assignees); // Use deep comparison
    }, [draft, task]);


    const {
        attributes, listeners, setNodeRef, transform, transition, isDragging,
    } = useSortable({
        id: task.taskIdStr,
        data: { type: 'Task', parentId: task.phaseIdStr, task: task } as PM_DraggableItemData,
    });

    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

    // ----------------------------------------------------------------------
    // 🛠️ SPECIAL HANDLER: Status Only API Call
    // ----------------------------------------------------------------------
    const handleSaveTaskStatusOnly = useCallback(() => {
        if (draft.status === task.status) return;

        const subscription = projectRepository.updateTaskStatusOnly({
            projectId: selectedProject?.id,
            taskId: task?.taskId,
        }, {
            status: draft.status,
        })
            .pipe(finalize(() => getProjectStructure()))
            .subscribe({
                next: res => {
                    if (res?.status) {
                        toast.success(res?.msg || res?.message);
                    } else {
                        toast.error(res?.message || res?.msg);
                    }
                },
                error: err => {
                    toast.error("Failed to update status.");
                },
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [draft.status, selectedProject, task, getProjectStructure]);


    // ----------------------------------------------------------------------
    // 🔄 CORE HANDLERS
    // ----------------------------------------------------------------------

    const handleTaskClick = useCallback((e: React.MouseEvent) => {
        // Prevent opening the drawer if dragging is currently active
        if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement) {
            return; // Don't open if clicking on interactive elements
        }
        setIsDetailDrawerOpen(true);
    }, []);


    const handleStatusChange = useCallback((newStatus: TaskStatus) => {
        if (!canEditStatusOnly) {
            toast.error("You only have viewing permission.");
            return;
        }
        setDraft(prev => ({ ...prev, status: newStatus }));
    }, [canEditStatusOnly]);

    const handlePriorityChange = useCallback((newPriority: TaskPriority) => {
        if (!canEditFull) {
            toast.error("You do not have permission to change priority.");
            return;
        }
        setDraft(prev => ({ ...prev, priority: newPriority }));
    }, [canEditFull]);

    const handleStartEdit = useCallback(() => {
        if (!canEditFull) {
            toast.error("You do not have permission to edit task name.");
            return;
        }
        setIsEditing(true);
        setDraft(prev => ({ ...prev, name: task.name }));
    }, [task.name, canEditFull]);

    const handleRevert = useCallback(() => {
        setDraft({
            name: task.name,
            status: task.status,
            priority: task.priority,
            assignees: task.assignees,
        });
        setIsEditing(false);
    }, [task.name, task.status, task.priority, task.assignees]);


    const handleSave = useCallback(() => {
        if (!isDirty) { setIsEditing(false); return; }

        const statusOnlyChanged = (
            draft.status !== task.status &&
            draft.name === task.name &&
            draft.priority === task.priority &&
            assigneesAreEqual(draft.assignees, task.assignees)
        );

        if (statusOnlyChanged && canEditStatusOnly && !canEditFull) {
            // Case A: Member changed ONLY status -> Use Status-Only API
            handleSaveTaskStatusOnly();

        } else if (canEditFull) {
            // Case B: Owner or full-edit user changed any field -> Use General Update API
            const updatedTask: any = {
                ...task,
                name: draft.name.trim(),
                status: draft.status,
                priority: draft.priority,
                assigneeIds: (draft.assignees || []).map((assignee: any) => assignee.userId)
            };
            onUpdateTask(task.taskId, updatedTask);
        } else {
            // Case C: Member tried to change a forbidden field (name, priority, assignees)
            toast.error("You only have permission to update task status.");
            handleRevert();
            return;
        }

        setIsEditing(false);
    }, [isDirty, draft, task, onUpdateTask, handleSaveTaskStatusOnly, handleRevert, canEditFull, canEditStatusOnly]);

    const handleDelete = useCallback(() => {
        if (!canEditFull) {
            toast.error("You do not have permission to delete tasks.");
            return;
        }
        onDeleteTask(task.taskId);
    }, [task.taskId, onDeleteTask, canEditFull]);

    const handleUpdateTaskAssignees = useCallback((updatedTaskAssignees: PM_TaskAssignee[]) => {
        if (!canEditFull) {
            toast.error("You do not have permission to change assignees.");
            return;
        }
        onUpdateTask(task.taskId, {
            ...draft,
            assigneeIds: updatedTaskAssignees.map((assignee: PM_TaskAssignee) => assignee.userId),
        });
    }, [onUpdateTask, draft, canEditFull]);


    // ... (rest of the code for rendering helpers and useEffect remain the same) ...

    const handleOpenAssigneeModal = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canEditFull) {
            toast.error("You do not have permission to change assignees.");
            return;
        }
        setIsAssigneeModalOpen(true);
    }, [canEditFull]);


    // --- RENDERING MAPPINGS (Assignees) ---
    // The mapping must be performed against the DRAFT state for accuracy
    const mappedTaskAssignees = draft.assignees.map((assignee: PM_TaskAssignee) => ({
        ...assignee,
        name: (members.find((member: TeamMember) => member.userId === assignee.userId)?.name),
        email: (members.find((member: TeamMember) => member.userId === assignee.userId)?.email),
    }));
    const visibleAssignees = mappedTaskAssignees.slice(0, 2);
    const remainingCount = mappedTaskAssignees.length - visibleAssignees.length;
    const remainingAssignees = mappedTaskAssignees.slice(2);


    // --- RENDERING JSX ---

    const TaskTitleContent = isEditing ? (
        canEditFull ? (
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
            <div className="text-sm font-medium text-gray-900 truncate">{task.name}</div>
        )
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

    const DirtyStateButtons = (isDirty || isEditing) && (
        (canEditFull || (canEditStatusOnly && draft.status !== task.status)) && (
            <div className="flex items-center gap-1 ml-auto">
                <Button size="icon" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:bg-red-50" onClick={handleRevert} title="Revert changes">
                    <RotateCcw size={16} />
                </Button>

                <Button size="icon" variant="ghost" className="h-7 w-7 p-0 text-green-600 hover:bg-green-50" onClick={handleSave} disabled={!draft.name.trim() || !isDirty} title="Save changes">
                    <Check size={16} />
                </Button>
            </div>
        )
    );

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
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...(canEditFull ? listeners : {})}
                id={task.taskIdStr}
                className={`${TASK_LIST_GRID_LAYOUT} py-2 border-t border-gray-50 hover:bg-gray-50 group ${canEditFull ? 'cursor-grab' : 'cursor-default'}`}
                onClick={handleTaskClick}
            >
                {/* Column 1: Name */}
                <div className="flex items-center gap-3 min-w-0 pl-12">
                    {TaskTitleContent}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-black hover:bg-gray-300 hover:rounded-2xl"
                                disabled={!canEditFull}
                            >
                                <MoreHorizontal size={16} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {canEditFull && (
                                <>
                                    <DropdownMenuItem className="cursor-pointer" onClick={handleStartEdit}>
                                        <span>Edit Name</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">
                                        <span>Edit timeline</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </>
                            )}

                            {/* 🆕 Delete Option (Owners only) */}
                            {canEditFull && (
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 cursor-pointer focus:bg-red-50"
                                    onClick={handleDelete}
                                >
                                    <span>Delete Task</span>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Column 2: Status Dropdown */}
                <div>
                    <StatusSelector value={draft.status} onChange={handleStatusChange} isDisabled={!canEditStatusOnly} />
                </div>

                {/* Column 3: Priority Dropdown */}
                <div>
                    <PrioritySelector value={draft.priority} onChange={handlePriorityChange} isDisabled={!canEditFull} />
                </div>

                {/* Column 4: Assignees */}
                <div className="flex items-center ml-15 -space-x-2">
                    {visibleAssignees.map(a => (
                        <Tooltip key={a.userId}>
                            <TooltipTrigger asChild>
                                <Avatar className="w-6 h-6 border-2 border-white">
                                    <AvatarImage src={a.avatarUrl || (a as any).avatar_url} />
                                    <AvatarFallback>{a.name ? a.name.charAt(0) : 'U'}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent><span key={a.userId} className="truncate">{a.name} ({a.email})</span></TooltipContent>
                        </Tooltip>
                    ))}
                    {remainingCount > 0 && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar className="w-6 h-6 border-2 border-white bg-gray-400 text-xs font-medium text-white cursor-pointer">
                                    <AvatarFallback>+{remainingCount}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent><p className="font-bold mb-1">Other Assignees:</p>{remainingAssignees.map(a => (<span key={a.userId} className="truncate">{a.name} ({a.email})</span>))}</TooltipContent>
                        </Tooltip>
                    )}
                </div>

                {/* Column 5: Assignee Edit Button & Save/Revert */}
                <div className="flex items-center justify-end">
                    {!(isEditing || isDirty) && canEditFull && (
                        <Button size="icon" variant="ghost" className="h-7 w-7 p-0 text-gray-400 hover:text-indigo-600" onClick={handleOpenAssigneeModal} title="Edit Assignees">
                            <UserPlus size={16} />
                        </Button>
                    )}
                    {DirtyStateButtons}
                </div>
            </div>

            {/* Task Assignee Modal */}
            <TaskAssigneeModal
                isOpen={isAssigneeModalOpen}
                onClose={() => setIsAssigneeModalOpen(false)}
                currentAssignees={draft.assignees}
                onSave={handleUpdateTaskAssignees}
                teamMembers={members}
            />
            {/* Task Detail Drawer */}
            <Sheet open={isDetailDrawerOpen} onOpenChange={setIsDetailDrawerOpen}>
                <SheetContent side="right" className="w-full sm:max-w-lg p-0">
                    <div className="absolute top-4 right-4 z-50">
                        <button aria-label="Close" className="opacity-0 cursor-pointer" onClick={(e) => {
                            e.stopPropagation();
                            setIsDetailDrawerOpen(false);
                        }}>
                            <X size={20} />
                        </button>
                    </div>
                    <TaskDetailDrawer
                        task={task}
                        members={members}
                    />
                </SheetContent>
            </Sheet>
            {alertMessage && (
                <AlertModal
                    alertMessage={alertMessage}
                    onClose={() => setAlertMessage(null)}
                />
            )}
        </>
    );
};

export const PM_TaskItem = memo(PM_TaskItemBase);