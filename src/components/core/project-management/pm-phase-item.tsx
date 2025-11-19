"use client";

import { CSS } from '@dnd-kit/utilities';
import {
    defaultAnimateLayoutChanges,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PM_Phase } from '@/model/project-management';
import { PM_DraggableItemData } from './type';
import { PM_TaskItem } from './pm-task-item';
import { Check, ChevronDown, MoreHorizontal, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { memo, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'; // Assuming these imports are available

type PhaseItemProps = {
    phase: PM_Phase;
    isExpanded: boolean;
    onToggle: (id: string) => void;
    onAddTask: (phaseId: number, name: string) => void;
    onUpdatePhaseName: (phaseId: number, newName: string) => void;
    onDeletePhase: (phaseId: number) => void;
    onUpdateTask: (taskId: number, updateTask: any) => void;
    onDeleteTask: (taskId: number) => void;
};

function PM_PhaseItemBase({
    phase,
    isExpanded,
    onToggle,
    onAddTask,
    onUpdatePhaseName,
    onDeletePhase,
    onUpdateTask,
    onDeleteTask,
}: PhaseItemProps) {
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState(phase.name);

    const animateLayoutChanges = (args: any) => {
        const { isSorting, wasDragging } = args;
        if (isSorting || wasDragging) {
            return defaultAnimateLayoutChanges(args);
        }
        return true;
    };

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: phase.phaseIdStr,
        data: {
            type: 'Phase',
            parentId: phase.deliverableIdStr,
            phase: phase,
        } as PM_DraggableItemData,
        animateLayoutChanges,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleToggle = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onToggle(phase.phaseIdStr);
    }, [phase.phaseIdStr, onToggle]);

    const handleSaveNewTask = useCallback((name: string) => {
        onAddTask(phase.phaseId, name);
        setIsAddingTask(false);
    }, [phase.phaseId, onAddTask]);

    const handleCancelAddTask = useCallback(() => {
        setIsAddingTask(false);
    }, []);

    const handleStartEdit = useCallback(() => {
        setIsEditing(true);
        setDraftName(phase.name);
    }, [phase.name]);

    const handleSaveEdit = useCallback(() => {
        if (draftName.trim() && draftName !== phase.name) {
            onUpdatePhaseName(phase.phaseId, draftName.trim());
        }
        setIsEditing(false);
    }, [draftName, phase.name, phase.phaseId, onUpdatePhaseName]);

    const handleCancelEdit = useCallback(() => {
        setDraftName(phase.name);
        setIsEditing(false);
    }, [phase.name]);

    const handleDelete = useCallback(() => {
        onDeletePhase(phase.phaseId);
    }, [phase.phaseId, onDeletePhase]);


    const PhaseTitle = isEditing ? (
        <div className="flex items-center gap-2 flex-grow min-w-0">
            {/* Input field */}
            <Input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                }}
                className="h-7 py-0 px-2 text-sm font-semibold flex-grow min-w-0"
                autoFocus
            />
            {/* Save/Cancel Buttons */}
            <Button size="icon" variant="ghost" className="h-6 w-6 p-0 text-green-600 hover:bg-green-50" onClick={handleSaveEdit} disabled={!draftName.trim()}>
                <Check size={14} />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6 p-0 text-red-500 hover:bg-red-50" onClick={handleCancelEdit}>
                <X size={14} />
            </Button>
        </div>
    ) : (
        <div
            className="flex items-center flex-grow min-w-0"
            onDoubleClick={handleStartEdit} // 🆕 Double-click to edit
        >
            <span className="text-sm font-medium text-gray-500">{phase.key}</span>
            <span className="ml-3 text-sm font-semibold text-gray-900 truncate">
                {phase.name}
            </span>
        </div>
    );

    return (
        <div ref={setNodeRef} style={style} className="ml-5 border-t border-gray-200">
            {/* The draggable header part */}
            <div
                className={`
                    flex items-center w-full
                    py-2.5 px-4
                    cursor-grab active:cursor-grabbing
                `}
                {...attributes}
                {...listeners}
            >
                {/* Toggle Button (only visible when not editing) */}
                {!isEditing && (
                    <button
                        type="button"
                        onClick={handleToggle}
                        className="p-1 mr-2 rounded-full hover:bg-gray-100"
                    >
                        <ChevronDown
                            className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                isExpanded ? "rotate-0" : "-rotate-90"
                            )}
                        />
                    </button>
                )}
                {/* Phase Title / Input Field */}
                {PhaseTitle}

                <span className="w-2"></span>

                {/* More button with Dropdown Menu (only visible when not editing) */}
                {!isEditing && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded-full opacity-0 hover:opacity-100 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <MoreHorizontal size={16} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* Option 1: Edit Name */}
                            <DropdownMenuItem className="cursor-pointer" onClick={handleStartEdit}>
                                <span>Edit Name</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {/* Option 2: Delete (Red Text) */}
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-700 cursor-pointer focus:bg-red-50"
                                onClick={handleDelete}
                            >
                                <span>Delete Phase</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* The collapsible container for Tasks */}
            <div
                className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-in-out",
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
            >
                <div className="overflow-hidden">
                    <SortableContext
                        items={phase.tasks.map((t) => t.taskIdStr)}
                        strategy={verticalListSortingStrategy}
                    >
                        {phase.tasks.map((task) => (
                            <PM_TaskItem
                                key={task.taskIdStr}
                                task={task}
                                onUpdateTask={onUpdateTask}
                                onDeleteTask={onDeleteTask}
                            />
                        ))}
                    </SortableContext>

                    {/* New Task Input */}
                    {isAddingTask && (
                        <NewTaskInput
                            onSave={handleSaveNewTask}
                            onCancel={handleCancelAddTask}
                        />
                    )}

                    {/* "Create task" button */}
                    <button
                        onClick={() => setIsAddingTask(true)} // Toggle input visibility
                        className="flex items-center w-full text-left py-2.5 px-4 ml-10 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        <Plus size={16} className="mr-2" />
                        Create task
                    </button>
                </div>
            </div>
        </div>
    );
};

const NewTaskInput = ({
    onSave,
    onCancel
}: {
    onSave: (name: string) => void;
    onCancel: () => void;
}) => {
    const [name, setName] = useState("");

    return (
        <div className="py-2 px-4 ml-10 border-t border-gray-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Placeholder for Task icon/drag handle */}
            <div className='w-4'></div>
            <Input
                autoFocus
                placeholder="Enter task name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && name.trim()) onSave(name);
                    if (e.key === "Escape") onCancel();
                }}
                className="flex-1 h-8"
            />
            <div className="flex items-center gap-1">
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 cursor-pointer text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => name.trim() && onSave(name)}
                    disabled={!name.trim()}
                >
                    <Check size={16} />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={onCancel}
                >
                    <X size={16} />
                </Button>
            </div>
        </div>
    );
};

export const PM_PhaseItem = memo(PM_PhaseItemBase);
