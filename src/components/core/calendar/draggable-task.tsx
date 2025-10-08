import { useDraggable } from '@dnd-kit/core';
import { BaseTask, BaseTaskProps } from '../task/base-task';

export interface DraggableTaskProps extends BaseTaskProps {
    isOverlay?: boolean;
}

export const DraggableTask = ({ task, isOverlay = false, ...baseTaskProps }: DraggableTaskProps) => {
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="cursor-grab"
        >
            <BaseTask task={task} {...baseTaskProps} />
        </div>
    );
}