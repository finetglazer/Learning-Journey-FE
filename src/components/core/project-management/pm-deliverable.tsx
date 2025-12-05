"use client";

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'; // Assuming these imports are available
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PM_Deliverable, ProjectMembershipRole } from '@/model/project-management';
import {
    defaultAnimateLayoutChanges,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, ChevronDown, MoreHorizontal, Plus, X } from 'lucide-react';
import { memo, useCallback, useContext, useState } from 'react';
import { TeamProjectContext, TeamProjectContextProps } from '../sidebar/pages/project/team-project-context';
import { PM_PhaseItem } from './pm-phase-item';
import { PM_DraggableItemData } from './type';

type DeliverableItemProps = {
    deliverable: PM_Deliverable;
    isExpanded: boolean;
    expandedPhaseIds: Set<string>;
    onToggle: (id: string) => void;
    onTogglePhase: (id: string) => void;
    onAddPhase: (deliverableId: number, name: string) => void;
    onAddTask: (phaseId: number, name: string) => void;
    onUpdateDeliverableName: (deliverableId: number, newName: string) => void;
    onDeleteDeliverable: (deliverableId: number) => void;
    onUpdatePhaseName: (phaseId: number, newName: string) => void;
    onDeletePhase: (phaseId: number) => void;
    onUpdateTask: (taskId: number, updateTask: any) => void;
    onDeleteTask: (taskId: number) => void;
};

function PM_DeliverableItemBase({
    deliverable,
    isExpanded,
    expandedPhaseIds,
    onToggle,
    onTogglePhase,
    onAddPhase,
    onAddTask,
    onUpdateDeliverableName,
    onDeleteDeliverable,
    onUpdatePhaseName,
    onDeletePhase,
    onUpdateTask,
    onDeleteTask,
}: DeliverableItemProps) {
    const [isAddingPhase, setIsAddingPhase] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [draftName, setDraftName] = useState(deliverable.name);

    const animateLayoutChanges = (args: any) => {
        const { isSorting, wasDragging } = args;
        if (isSorting || wasDragging) {
            return defaultAnimateLayoutChanges(args);
        }
        return true;
    };

    const {
        currentMember,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    // 🆕 RBAC Check
    const canEditStructure = currentMember?.role === ProjectMembershipRole.OWNER;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: deliverable.deliverableIdStr,
        data: {
            type: 'Deliverable',
            deliverable: deliverable,
            parentId: undefined,
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
        onToggle(deliverable.deliverableIdStr);
    }, [deliverable.deliverableIdStr, onToggle]);

    const handleSaveNewPhase = useCallback((name: string) => {
        onAddPhase(deliverable.deliverableId, name);
        setIsAddingPhase(false);
    }, [deliverable.deliverableId, onAddPhase]);

    const handleCancelAddPhase = useCallback(() => {
        setIsAddingPhase(false);
    }, []);

    // Editing Handlers
    const handleStartEdit = useCallback(() => {
        setIsEditing(true);
        setDraftName(deliverable.name);
    }, [deliverable.name]);

    const handleSaveEdit = useCallback(() => {
        if (draftName.trim() && draftName !== deliverable.name) {
            onUpdateDeliverableName(deliverable.deliverableId, draftName.trim());
        }
        setIsEditing(false);
    }, [draftName, deliverable.name, deliverable.deliverableId, onUpdateDeliverableName]);

    const handleCancelEdit = useCallback(() => {
        setDraftName(deliverable.name);
        setIsEditing(false);
    }, [deliverable.name]);

    const handleDelete = useCallback(() => {
        onDeleteDeliverable(deliverable.deliverableId);
    }, [deliverable.deliverableId, onDeleteDeliverable]);

    const DeliverableTitle = isEditing ? (
        <div className="flex items-center gap-2 flex-grow min-w-0">
            {/* Input field */}
            <Input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                }}
                className="h-8 py-0 px-2 text-sm font-semibold flex-grow min-w-0"
                autoFocus
            />
            {/* Save/Cancel Buttons */}
            <Button size="icon" variant="ghost" className="h-7 w-7 p-0 text-green-600 hover:bg-green-50" onClick={handleSaveEdit} disabled={!draftName.trim()}>
                <Check size={16} />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 p-0 text-red-500 hover:bg-red-50" onClick={handleCancelEdit}>
                <X size={16} />
            </Button>
        </div>
    ) : (
        <div
            className="flex items-center flex-grow min-w-0"
            onDoubleClick={canEditStructure ? handleStartEdit : undefined} // 🆕 Double-click to edit
        >
            <span className="text-sm font-medium text-gray-500">{deliverable.key}</span>
            <span className="ml-3 text-sm font-semibold text-gray-900 truncate">
                {deliverable.name}
            </span>
        </div>
    );

    return (
        <div
            ref={setNodeRef}
            style={style}
            id={deliverable.deliverableIdStr}
            className="my-3 bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
        >
            {/* The draggable header part (Deliverable header) */}
            <div
                className={cn(`flex items-center group w-full py-3 px-5 bg-gray-50`,
                    isExpanded ? 'border-b border-gray-200' : '',
                    canEditStructure ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                )}
                // Spread dnd-kit attributes and listeners here
                {...(canEditStructure ? attributes : {})}
                {...(canEditStructure ? listeners : {})}
            >
                {/* Toggle Button */}
                <button
                    type="button"
                    onClick={handleToggle}
                    className="p-1 mr-2 rounded-full hover:bg-gray-200"
                >
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isExpanded ? "rotate-0" : "-rotate-90"
                        )}
                    />
                </button>

                {/* Deliverable Title / Input Field */}
                {DeliverableTitle}

                <span className="w-2"></span>

                {/* More button with Dropdown Menu (only visible when not editing) */}
                {!isEditing && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:opacity-100 hover:bg-gray-200 hover:text-gray-700 group-hover:text-gray-500"
                            >
                                <MoreHorizontal size={16} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* Option 1: Edit Name (Alternative to double-click) */}
                            {canEditStructure && (
                                <DropdownMenuItem className="cursor-pointer" onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartEdit();
                                }}>
                                    <span>Edit Name</span>
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            {/* Option 2: Delete (Red Text) */}
                            {canEditStructure && (
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-700 cursor-pointer focus:bg-red-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete();
                                    }}
                                >
                                    <span>Delete Deliverable</span>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* The collapsible container for Phases (rest of the code remains the same) */}
            <div
                className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-in-out",
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
            >
                <div className="overflow-hidden">
                    {canEditStructure ? (
                        <SortableContext
                            items={deliverable.phases.map((p) => p.phaseIdStr)}
                            strategy={verticalListSortingStrategy}
                        >
                            {deliverable.phases.map((phase) => (
                                <PM_PhaseItem
                                    key={phase.phaseIdStr}
                                    phase={phase}
                                    isExpanded={expandedPhaseIds.has(phase.phaseIdStr)}
                                    onAddTask={onAddTask}
                                    onToggle={onTogglePhase}
                                    onUpdatePhaseName={onUpdatePhaseName}
                                    onDeletePhase={onDeletePhase}
                                    onUpdateTask={onUpdateTask}
                                    onDeleteTask={onDeleteTask}
                                />
                            ))}
                        </SortableContext>
                    ) : (
                        <>
                            {deliverable.phases.map((phase) => (
                                <PM_PhaseItem
                                    key={phase.phaseIdStr}
                                    phase={phase}
                                    isExpanded={expandedPhaseIds.has(phase.phaseIdStr)}
                                    onAddTask={onAddTask}
                                    onToggle={onTogglePhase}
                                    onUpdatePhaseName={onUpdatePhaseName}
                                    onDeletePhase={onDeletePhase}
                                    onUpdateTask={onUpdateTask}
                                    onDeleteTask={onDeleteTask}
                                />
                            ))}
                        </>
                    )}

                    {/* New Phase Input UI */}
                    {isAddingPhase && canEditStructure && (
                        <NewPhaseInputComponent
                            onSave={handleSaveNewPhase}
                            onCancel={handleCancelAddPhase}
                        />
                    )}

                    {/* "Create phase" button to trigger input visibility */}
                    {!isAddingPhase && canEditStructure && (
                        <button
                            onClick={() => setIsAddingPhase(true)}
                            className="flex items-center w-full text-left py-2.5 px-5 ml-5 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            <Plus size={16} className="mr-2" />
                            Create phase
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const NewPhaseInputComponent = ({
    onSave,
    onCancel
}: {
    onSave: (name: string) => void;
    onCancel: () => void;
}) => {
    const [name, setName] = useState("");

    return (
        <div className="py-2 px-5 ml-5 border-t border-gray-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
            <Input
                autoFocus
                placeholder="Enter phase name..."
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

export const PM_DeliverableItem = memo(PM_DeliverableItemBase);
