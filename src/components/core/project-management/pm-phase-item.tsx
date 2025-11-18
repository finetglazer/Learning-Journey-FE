import { CSS } from '@dnd-kit/utilities';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PM_Phase } from '@/model/project-management';
import { PM_DraggableItemData } from './type';
import { PM_TaskItem } from './pm-task-item';
import { ChevronDown, MoreHorizontal, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        id: phase.phaseIdStr,
        data: {
            type: 'Phase',
            parentId: phase.deliverableIdStr,
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
                        onToggle(phase.phaseIdStr);
                    }}
                    className="p-1 mr-2 rounded-full hover:bg-gray-100"
                >
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isExpanded ? "rotate-0" : "-rotate-90"
                        )}
                    />
                </button>

                {/* Content */}
                <span className="text-sm font-medium text-gray-500">{phase.key}</span>
                <span className="ml-3 text-sm font-semibold text-gray-900">
                    {phase.name}
                </span>
                <span className="w-2"></span>
                {/* More button from image */}
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded-full opacity-0 hover:opacity-100 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                    <MoreHorizontal size={16} />
                </button>
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
                            <PM_TaskItem key={task.taskIdStr} task={task} />
                        ))}
                    </SortableContext>

                    {/* "Create task" button */}
                    <button className="flex items-center w-full text-left py-2.5 px-4 ml-10 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                        <Plus size={16} className="mr-2" />
                        Create task
                    </button>
                </div>
            </div>
        </div>
    );
};