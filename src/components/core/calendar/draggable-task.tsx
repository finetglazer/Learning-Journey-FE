import { Task } from '@/model/task';
import { useDraggable } from '@dnd-kit/core';
import { BaseTask, BaseTaskProps } from '../task/base-task';

export interface DraggableTaskProps extends BaseTaskProps {
    handleTaskDoubleClick: (e: React.MouseEvent<HTMLDivElement>, taskId: number) => void;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
    isOverlay?: boolean;
    draggable?: boolean;
}

export const DraggableTask = ({
    task,
    isOverlay = false,
    handleTaskDoubleClick,
    scrollContainerRef,
    draggable = true,
    ...baseTaskProps
}: DraggableTaskProps) => {
    // Get `isDragging` from the hook
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task?.id as number,
        data: task,
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
                    onDoubleClick={(e) => handleTaskDoubleClick(e, task?.id as number)}
                >
                    <BaseTask task={task} {...baseTaskProps} />
                </div>
            ) : (
                <div
                    ref={setNodeRef}
                    style={style}
                    className="cursor-grab"
                    onDoubleClick={(e) => handleTaskDoubleClick(e, task?.id as number)}
                >
                    <BaseTask task={task} {...baseTaskProps} />
                </div>
            )}
        </>
    );
}