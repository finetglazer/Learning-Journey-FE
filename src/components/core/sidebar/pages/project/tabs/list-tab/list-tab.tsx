import { PM_DeliverableItem } from "@/components/core/project-management/pm-deliverable";
import { PM_DraggableItemData } from "@/components/core/project-management/type";
import { PM_Deliverable } from "@/model/project-management";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";

export interface ListTabProps {
    deliverables: PM_Deliverable[];
};

export const ListTab = ({ }: ListTabProps) => {
    const [deliverables, setDeliverables] = useState<PM_Deliverable[]>([]);
    // (Using string IDs, as dnd-kit uses strings)
    const [expandedDeliverables, setExpandedDeliverables] = useState<Set<string>>(
        new Set([]) // Default expanded deliverables
    );
    const [expandedPhases, setExpandedPhases] = useState<Set<string>>(
        new Set([]) // Default expanded phases
    );

    const sensors = useSensors(
        useSensor(PointerSensor, {
            // Require the pointer to move by 5px before activating a drag
            // This prevents a simple click from being treated as a drag
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const createToggleHandler = (
        setter: React.Dispatch<React.SetStateAction<Set<string>>>
    ) => {
        return (id: string) => {
            setter(prev => {
                const newSet = new Set(prev);
                if (newSet.has(id)) {
                    newSet.delete(id);
                } else {
                    newSet.add(id);
                }
                return newSet;
            });
        };
    };

    const handleToggleDeliverable = createToggleHandler(setExpandedDeliverables);
    const handleTogglePhase = createToggleHandler(setExpandedPhases);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const activeData = active.data.current as PM_DraggableItemData;
        const overData = over.data.current as PM_DraggableItemData;

        // --- Case 1: Reordering Deliverables ---
        if (activeData.type === 'Deliverable' && overData.type === 'Deliverable') {
            setDeliverables(items => {
                const activeIndex = items.findIndex(
                    item => item.deliverableId === active.id
                );
                const overIndex = items.findIndex(
                    item => item.deliverableId === over.id
                );
                return arrayMove(items, activeIndex, overIndex);
            });
            return;
        }

        // --- Case 2: Reordering Phases ---
        if (
            activeData.type === 'Phase' &&
            overData.type === 'Phase' &&
            activeData.parentId === overData.parentId
        ) {
            const deliverableId = activeData.parentId;
            setDeliverables(items =>
                items.map(del => {
                    if (del.deliverableId === deliverableId) {
                        const activeIndex = del.phases.findIndex(
                            p => p.phaseId === active.id
                        );
                        const overIndex = del.phases.findIndex(
                            p => p.phaseId === over.id
                        );
                        return {
                            ...del,
                            phases: arrayMove(del.phases, activeIndex, overIndex),
                        };
                    }
                    return del;
                })
            );
            return;
        }

        // --- Case 3: Reordering Tasks ---
        if (
            activeData.type === 'Task' &&
            overData.type === 'Task' &&
            activeData.parentId === overData.parentId
        ) {
            const phaseId = activeData.parentId;
            setDeliverables(items =>
                items.map(del => ({
                    ...del,
                    phases: del.phases.map(phase => {
                        if (phase.phaseId === phaseId) {
                            const activeIndex = phase.tasks.findIndex(
                                t => t.taskId === active.id
                            );
                            const overIndex = phase.tasks.findIndex(
                                t => t.taskId === over.id
                            );
                            return {
                                ...phase,
                                tasks: arrayMove(phase.tasks, activeIndex, overIndex),
                            };
                        }
                        return phase;
                    }),
                }))
            );
            return;
        }

        console.warn("Unhandled drag case:", { activeData, overData });
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={deliverables.map(d => d.deliverableId)}
                strategy={verticalListSortingStrategy}
            >
                {deliverables.map(del => (
                    <PM_DeliverableItem
                        key={del.deliverableId}
                        deliverable={del}
                        isExpanded={expandedDeliverables.has(del.deliverableId)}
                        onToggle={handleToggleDeliverable}
                        expandedPhaseIds={expandedPhases}
                        onTogglePhase={handleTogglePhase}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
};