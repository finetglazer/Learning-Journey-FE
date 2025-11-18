"use client";

import { cn } from '@/lib/utils';
import { PM_Deliverable } from '@/model/project-management';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, MoreHorizontal, Plus } from 'lucide-react';
import { PM_PhaseItem } from './pm-phase-item';
import { PM_DraggableItemData } from './type';

type DeliverableItemProps = {
    deliverable: PM_Deliverable;
    isExpanded: boolean;
    expandedPhaseIds: Set<string>;
    onToggle: (id: string) => void;
    onTogglePhase: (id: string) => void;
};

export function PM_DeliverableItem({
    deliverable,
    isExpanded,
    expandedPhaseIds,
    onToggle,
    onTogglePhase,
}: DeliverableItemProps) {
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
            parentId: undefined,
        } as PM_DraggableItemData,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="my-3 bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
        >
            {/* The draggable header part */}
            <div
                className={`
                    flex items-center w-full
                    py-3 px-5
                    bg-gray-50
                    cursor-grab active:cursor-grabbing
                    ${isExpanded ? 'border-b border-gray-200' : ''}
                `}
                {...attributes}
                {...listeners}
            >
                {/* Toggle Button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(deliverable.deliverableIdStr);
                    }}
                    className="p-1 mr-2 rounded-full hover:bg-gray-200"
                >
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isExpanded ? "rotate-0" : "-rotate-90"
                        )}
                    />
                </button>

                {/* Content */}
                <span className="text-sm font-medium text-gray-500">{deliverable.key}</span>
                <span className="ml-3 text-sm font-semibold text-gray-900">
                    {deliverable.name}
                </span>
                <span className="w-2"></span>
                {/* More button from image */}
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded-full opacity-0 hover:opacity-100 hover:bg-gray-200 hover:text-gray-700"
                >
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* The collapsible container for Phases */}
            <div
                className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-in-out",
                    isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
            >
                <div className="overflow-hidden">
                    <SortableContext
                        items={deliverable.phases.map((p) => p.phaseIdStr)}
                        strategy={verticalListSortingStrategy}
                    >
                        {deliverable.phases.map((phase) => (
                            <PM_PhaseItem
                                key={phase.phaseId}
                                phase={phase}
                                isExpanded={expandedPhaseIds.has(phase.phaseIdStr)}
                                onToggle={onTogglePhase}
                            />
                        ))}
                    </SortableContext>

                    <button className="flex items-center w-full text-left py-2.5 px-5 ml-5 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                        <Plus size={16} className="mr-2" />
                        Create phase
                    </button>
                </div>
            </div>
        </div>
    );
};