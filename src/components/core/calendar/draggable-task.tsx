import { useDraggable } from '@dnd-kit/core';
import { BaseTask, BaseTaskProps } from '../task/base-task';
import { Task } from '@/model/task';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export interface DraggableTaskProps extends BaseTaskProps {
    setEditingTask: (e: React.MouseEvent<HTMLDivElement>, task: Task) => void;
    isOverlay?: boolean;
    onRemove?: (taskId: string) => void;
}

export const DraggableTask = ({ 
    task, 
    isOverlay = false, 
    setEditingTask,
    onRemove,
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
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="cursor-grab"
            onDoubleClick={(e) => setEditingTask(e, task)}
        >
            <BaseTask task={task} {...baseTaskProps} />
            {/* <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 left-[100%] h-6 w-6 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove?.(task.id);
                }}
            >
                <Trash2 size={14} />
            </Button> */}
        </div>
    );
}