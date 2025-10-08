"use client";

import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task, TaskStep } from "@/model/task";
import { Dispatch, SetStateAction } from "react";

function SortableSubTask({ subtask }: { subtask: Task | TaskStep }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: subtask.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between w-full bg-white p-2 rounded"
        >
            <div className="flex items-center gap-2">
                <button {...attributes} {...listeners} className="cursor-grab text-gray-400">
                    <GripVertical size={20} />
                </button>
                <span className="text-sm">{(subtask as Task)?.title || (subtask as TaskStep)?.description}</span>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                <MinusCircle size={20} />
            </Button>
        </div>
    );
}


interface SubTaskListProps {
    subtasks: Task[] | TaskStep[];
    fieldName: string;
    onSubtasksChange: (fieldName: string, value: any) => void;
}

export const SubTaskList = ({ subtasks, fieldName, onSubtasksChange }: SubTaskListProps) => {
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = (subtasks as Task[]).findIndex((item) => item.id === active.id);
            const newIndex = (subtasks as Task[]).findIndex((item) => item.id === over?.id);
            onSubtasksChange(fieldName, arrayMove(subtasks as Task[], oldIndex, newIndex));
        }
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={subtasks} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                    {subtasks.map((subtask) => (
                        <SortableSubTask key={subtask.id} subtask={subtask} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}