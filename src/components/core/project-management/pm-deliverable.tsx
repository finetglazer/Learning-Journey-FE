import { CSS } from '@dnd-kit/utilities';
import {
    useSortable,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PM_Deliverable } from '@/model/project-management';
import { PM_DraggableItemData } from './type';
import { PM_PhaseItem } from './pm-phase-item';
import { MoreHorizontal, Plus } from 'lucide-react';

type DeliverableItemProps = {
    deliverable: PM_Deliverable;
    isExpanded: boolean; // Is *this* deliverable expanded
    expandedPhaseIds: Set<string>; // A Set of all expanded phase IDs
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
        id: deliverable.deliverableId,
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
                        onToggle(deliverable.deliverableId);
                    }}
                    className="p-1 mr-2 rounded-full hover:bg-gray-200"
                >
                    <span className="w-5 h-5 flex items-center justify-center text-gray-500">
                        {isExpanded ? '▼' : '►'}
                    </span>
                </button>

                {/* Content */}
                <span className="text-sm font-medium text-gray-500">{deliverable.key}</span>
                <span className="ml-3 text-sm font-semibold text-gray-900">
                    {deliverable.name}
                </span>
                <span className="flex-1"></span>
                {/* More button from image */}
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700"
                >
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* The collapsible container for Phases */}
            {isExpanded && (
                <>
                    <SortableContext
                        items={deliverable.phases.map((p) => p.phaseId)}
                        strategy={verticalListSortingStrategy}
                    >
                        {deliverable.phases.map((phase) => (
                            <PM_PhaseItem
                                key={phase.phaseId}
                                phase={phase}
                                isExpanded={expandedPhaseIds.has(phase.phaseId)}
                                onToggle={onTogglePhase}
                            />
                        ))}
                    </SortableContext>

                    {/* "Create phase" button from image */}
                    <button className="flex items-center w-full text-left py-2.5 px-5 ml-5 text-sm text-gray-500 hover:bg-gray-50">
                        <Plus size={16} className="mr-2" />
                        Create phase
                    </button>
                </>
            )}
        </div>
    );
}