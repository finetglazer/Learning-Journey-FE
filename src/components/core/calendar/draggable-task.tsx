import { useDraggable } from '@dnd-kit/core';
import { BaseTask, BaseTaskProps } from '../task/base-task';
import { Task } from '@/model/task';

export interface DraggableTaskProps extends BaseTaskProps {
    setEditingTask: (e: React.MouseEvent<HTMLDivElement>, task: Task) => void;
    isOverlay?: boolean;
}

export const DraggableTask = ({ task, isOverlay = false, setEditingTask, ...baseTaskProps }: DraggableTaskProps) => {
    // Get `isDragging` from the hook
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
    });

    const style = transform && !isOverlay ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    // Hide the original task while it's being dragged
    if (isDragging && !isOverlay) {
        return <div ref={setNodeRef} style={{ visibility: 'hidden' }} />;
    }

    if (isOverlay) {
        const overlayWrapperStyle = {
            ...(baseTaskProps.wrapperStyle || {}),
            touchAction: 'none',
        };
        return (
            <BaseTask
                task={task}
                {...baseTaskProps}
                wrapperStyle={overlayWrapperStyle}
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="cursor-grab"
            onDoubleClick={(e) => setEditingTask(e, task)}
        >
            <BaseTask task={task} {...baseTaskProps} />
        </div>
    );
}