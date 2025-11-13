import { CSS } from '@dnd-kit/utilities';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PM_Phase } from '@/model/project-management';
import { PM_DraggableItemData } from './type';
import { PM_TaskItem } from './pm-task-item';

type PhaseItemProps = {
    phase: PM_Phase;
    isExpanded: boolean;
    onToggle: (id: string) => void;
};

export function PM_PhaseItem({ phase, isExpanded, onToggle }: PhaseItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: phase.phaseId,
        data: {
            type: 'Phase',
            parentId: phase.deliverableId,
        } as PM_DraggableItemData,
    });

    // 3. Keep dynamic styles for dnd-kit
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        // 4. setNodeRef and style go on the main container
        <div ref={setNodeRef} style={style} className="ml-5 my-2"> {/* Indentation */}
            {/* 5. The draggable header part */}
            <div
                className={`
          flex items-center w-full
          py-2.5 px-4
          bg-gray-50 border border-gray-200 rounded-lg shadow-sm
          cursor-grab active:cursor-grabbing
          ${isDragging ? 'shadow-lg' : ''}
        `}
                {...attributes} 
                {...listeners}  
            >
                {/* Toggle Button */}
                <button
                    type="button"
                    // 6. Stop drag from starting when clicking the button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(phase.phaseId);
                    }}
                    className="p-1 mr-2 rounded-full hover:bg-gray-200"
                >
                    {/* A simple, styled text icon */}
                    <span className="w-5 h-5 flex items-center justify-center text-gray-500">
                        {isExpanded ? '▼' : '►'}
                    </span>
                </button>

                {/* Content */}
                <span className="text-sm font-medium text-gray-600">{phase.key}</span>
                <span className="ml-3 text-sm font-semibold text-gray-900">
                    {phase.name}
                </span>
            </div>

            {/* 7. The collapsible container for Tasks */}
            {isExpanded && (
                <SortableContext
                    // 8. Use the correct task IDs for the context
                    items={phase.tasks.map((t) => t.taskId)}
                    strategy={verticalListSortingStrategy}
                >
                    {phase.tasks.map((task) => (
                        // 9. Pass the full task object.
                        // TaskItem now gets its parentId from the task prop itself.
                        <PM_TaskItem key={task.taskId} task={task} />
                    ))}
                </SortableContext>
            )}
        </div>
    );
};