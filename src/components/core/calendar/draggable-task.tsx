import { Task } from '@/model/task';
import { useDraggable } from '@dnd-kit/core';
import { BaseTask, BaseTaskProps } from '../task/base-task';

export interface DraggableTaskProps extends BaseTaskProps {
    handleTaskDoubleClick: (e: React.MouseEvent<HTMLDivElement>, task: Task, scrollContainerRef?: React.RefObject<HTMLDivElement | null>) => void;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    isOverlay?: boolean;
    onRemove?: (taskId: string) => void;
    draggable?: boolean;
}

export const DraggableTask = ({
    task,
    isOverlay = false,
    handleTaskDoubleClick,
    onRemove,
    scrollContainerRef,
    draggable = true,
    ...baseTaskProps
}: DraggableTaskProps) => {
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
        <>
            {draggable ? (
                <div
                    ref={setNodeRef}
                    style={style}
                    {...listeners}
                    {...attributes}
                    className="cursor-grab"
                    onDoubleClick={(e) => handleTaskDoubleClick(e, task, scrollContainerRef)}
                >
                    <BaseTask task={task} {...baseTaskProps} />
                </div>
            ) : (
                <div
                    ref={setNodeRef}
                    style={style}
                    className="cursor-grab"
                    onDoubleClick={(e) => handleTaskDoubleClick(e, task, scrollContainerRef)}
                >
                    <BaseTask task={task} {...baseTaskProps} />
                </div>
            )}
        </>
    );
}