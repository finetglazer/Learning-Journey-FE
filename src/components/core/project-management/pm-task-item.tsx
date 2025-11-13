import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { PM_Task, TaskPriority } from '@/model/project-management';
import { PM_DraggableItemData } from './type';

const priorityStyles: Record<TaskPriority, string> = {
    [TaskPriority.MINOR]: 'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200',
    [TaskPriority.MEDIUM]: 'bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200',
    [TaskPriority.MAJOR]: 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-200',
    [TaskPriority.CRITICAL]: 'bg-red-100 text-red-700 ring-1 ring-inset ring-red-200',
};

export function PM_TaskItem({ task }: { task: PM_Task }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.taskId,
        data: {
            type: 'Task',
            parentId: task.phaseId,
        } as PM_DraggableItemData,
    });

    // 3. dnd-kit requires transform and transition to be inline styles
    // We can also add other dynamic styles, like opacity for dragging
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
        flex items-center justify-between
        py-2.5 px-4 my-1 ml-10  /* Corresponds to old padding/margin */
        bg-white border border-gray-200 rounded-lg shadow-sm
        cursor-grab active:cursor-grabbing /* Better UX for draggable items */
        ${isDragging ? 'shadow-lg' : ''}
      `}
        >
            {/* Left Side: Key and Name */}
            <div className="flex items-center">
                {/* You could add a status icon here based on task.status */}
                <span className="text-sm font-medium text-gray-500">{task.key}</span>
                <span className="ml-3 text-sm text-gray-900">{task.name}</span>
            </div>

            {/* Right Side: Priority Badge & Assignees */}
            <div className="flex items-center space-x-3">
                {/* TODO: Render task.assignees avatars here */}

                {/* 5. Dynamic priority badge using Tailwind */}
                <span
                    className={`
            rounded-md px-2 py-0.5 text-xs font-semibold
            ${priorityStyles[task.priority] || priorityStyles[TaskPriority.MINOR]}
          `}
                >
                    {/* Format the enum text for display */
                        task.priority.charAt(0) + task.priority.slice(1).toLowerCase()
                    }
                </span>
            </div>
        </div>
    );
};