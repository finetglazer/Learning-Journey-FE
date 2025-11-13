import { CSS } from '@dnd-kit/utilities';
import {
    useSortable,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PM_Deliverable } from '@/model/project-management';
import { PM_DraggableItemData } from './type';
import { PM_PhaseItem } from './pm-phase-item';

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

    // 4. Keep dynamic styles for dnd-kit
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        // 5. setNodeRef and style go on the main container
        <div ref={setNodeRef} style={style} className="my-3">
            {/* 6. The draggable header part */}
            <div
                className={`
          flex items-center w-full
          py-3.5 px-5
          bg-gray-100 border-2 border-gray-300 rounded-lg shadow
          cursor-grab active:cursor-grabbing
          ${isDragging ? 'shadow-xl' : ''}
        `}
                {...attributes}
                {...listeners}
            >
                {/* Toggle Button */}
                <button
                    type="button"
                    // 7. Stop drag from starting when clicking the button
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log(111)
                        onToggle(deliverable.deliverableId);
                    }}
                    className="p-1 mr-3 rounded-full hover:bg-gray-300"
                >
                    {/* A simple, styled text icon */}
                    <span className="w-5 h-5 flex items-center justify-center text-gray-600">
                        {isExpanded ? '▼' : '►'}
                    </span>
                </button>

                {/* Content */}
                <span className="text-sm font-medium text-gray-500">{deliverable.key}</span>
                <span className="ml-3 text-base font-semibold text-gray-900">
                    {deliverable.name}
                </span>
            </div>

            {/* 8. The collapsible container for Phases */}
            {isExpanded && (
                <SortableContext
                    // 9. Use the correct phase IDs for the context
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
            )}
        </div>
    );
}