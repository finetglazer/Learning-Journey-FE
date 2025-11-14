import { CSS } from '@dnd-kit/utilities';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PM_Phase } from '@/model/project-management';
import { PM_DraggableItemData } from './type';
import { PM_TaskItem } from './pm-task-item';
import { MoreHorizontal, Plus } from 'lucide-react';

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

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

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
                {/* Toggle Button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(phase.phaseId);
                    }}
                    className="p-1 mr-2 rounded-full hover:bg-gray-100"
                >
                    <span className="w-5 h-5 flex items-center justify-center text-gray-500">
                        {isExpanded ? '▼' : '►'}
                    </span>
                </button>

                {/* Content */}
                <span className="text-sm font-medium text-gray-500">{phase.key}</span>
                <span className="ml-3 text-sm font-semibold text-gray-900">
                    {phase.name}
                </span>
                <span className="flex-1"></span>
                {/* More button from image */}
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* The collapsible container for Tasks */}
            {isExpanded && (
                <>
                    <SortableContext
                        items={phase.tasks.map((t) => t.taskId)}
                        strategy={verticalListSortingStrategy}
                    >
                        {phase.tasks.map((task) => (
                            <PM_TaskItem key={task.taskId} task={task} />
                        ))}
                    </SortableContext>

                    {/* "Create task" button from image */}
                    <button className="flex items-center w-full text-left py-2.5 px-4 ml-10 text-sm text-gray-500 hover:bg-gray-50">
                        <Plus size={16} className="mr-2" />
                        Create task
                    </button>
                </>
            )}
        </div>
    );
};