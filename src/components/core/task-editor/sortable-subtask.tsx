"use client";

import { Button } from "@/components/ui/button";
import { Task, TaskStep } from "@/model/task";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MinusCircle } from "lucide-react";
import { Model } from "react-3layer-common";

function SortableSubTask({ subtask, model, updateModel }: { subtask: Task | TaskStep, model: Model, updateModel: (fieldName: string, value: any) => void }) {
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

    const onDelete = (id: string) => {
        updateModel(model?.type === "big-task" ? "subtasks" : "steps",
            [...((model?.type === "big-task" ? model?.subtasks : model?.steps) || []).filter(
                (item: Task | TaskStep) => item.id !== id
            )]
        );
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
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500" onClick={() => onDelete(subtask.id)}>
                <MinusCircle size={20} />
            </Button>
        </div>
    );
}


interface SubTaskListProps {
    subtasks: Task[] | TaskStep[];
    fieldName: string;
    onSubtasksChange: (fieldName: string, value: any) => void;
    model: Model;
};

export const SubTaskList = ({ subtasks, fieldName, onSubtasksChange, model }: SubTaskListProps) => {
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
                        <SortableSubTask
                            key={subtask.id}
                            subtask={subtask}
                            model={model}
                            updateModel={onSubtasksChange}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};