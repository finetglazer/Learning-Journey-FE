"use client";

import { Input } from '@/components/ui/input';
import { PM_Task, TaskPriority, TaskStatus } from '@/model/project-management';
import { projectRepository } from '@/repository/project-repository';
import { closestCorners, DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { finalize } from 'rxjs';
import { toast } from 'sonner';
import { TeamProjectContext, TeamProjectContextProps } from '../sidebar/pages/project/team-project-context';
import KanbanColumn from './kanban-column';
import TaskCard from './kanban-task-card';
import { KanbanColumnsType, KanbanColumnType } from './type';
import SpinnerLoader from '../loader/spinner-loader';
import { EmptyData } from './empty-data';

export interface KanbanBoardProps {
};

const KanbanBoard: React.FC<KanbanBoardProps> = () => {
    // Define a default empty state for initial rendering
    const EMPTY_COLUMNS: KanbanColumnsType = {
        [TaskStatus.TO_DO]: { id: TaskStatus.TO_DO, title: 'TO DO', tasks: [] },
        [TaskStatus.IN_PROGRESS]: { id: TaskStatus.IN_PROGRESS, title: 'IN PROGRESS', tasks: [] },
        [TaskStatus.IN_REVIEW]: { id: TaskStatus.IN_REVIEW, title: 'IN REVIEW', tasks: [] },
        [TaskStatus.DONE]: { id: TaskStatus.DONE, title: 'DONE', tasks: [] },
    };

    const [tasks, setTasks] = useState<PM_Task[]>([]);
    const [columns, setColumns] = useState<KanbanColumnsType>(EMPTY_COLUMNS);
    const [activeTask, setActiveTask] = useState<PM_Task | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showMyTasks, setShowMyTasks] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);

    const {
        getProjectStructure,
        selectedProject,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const findColumn = useCallback((id: string) => {
        if (columns && Object.keys(columns).includes(id)) {
            return id as TaskStatus;
        }

        const column = Object.values(columns).find(
            (col: KanbanColumnType) => col.tasks.some(task => task.status === id)
        );
        return column ? column.id : null;
    }, [columns]);

    const handleSaveTaskStatusOnly = useCallback((taskId: number, updatedStatus: TaskStatus) => {
        const subscription = projectRepository.updateTaskStatusOnly({
            projectId: selectedProject?.id,
            taskId: taskId,
        }, {
            status: updatedStatus,
        })
            .pipe(finalize(() => getProjectStructure()))
            .subscribe({
                next: res => {
                    if (res?.status) {
                        toast.success(res?.msg || res?.message);
                    } else {
                        toast.error(res?.message || res?.msg);
                    }
                },
                error: err => {
                    toast.error("Failed to update status.");
                },
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [selectedProject, activeTask, getProjectStructure]);

    const handleDragStart = useCallback((event: any) => {
        const task: PM_Task = event.active.data.current.task;
        const columnId = findColumn(task.status);
        if (!columnId) return;
        // const task = columns[columnId].tasks.find(t => t.taskIdStr === taskId);
        setActiveTask(task || null);
    }, [columns, findColumn]);


    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;
        const activeColumnId = findColumn(active.data.current?.task.status);
        const overColumnId = findColumn(String(over.id)) || (over.id as TaskStatus);

        if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) {
            return;
        }

        // --- Move task between columns ---
        setColumns((prevColumns) => {
            const sourceColumn = prevColumns[activeColumnId];
            const destinationColumn = prevColumns[overColumnId];

            const taskIndex = sourceColumn.tasks.findIndex(t => t.taskIdStr === active.id);
            if (taskIndex === -1) return prevColumns;

            const [movedTask] = sourceColumn.tasks.splice(taskIndex, 1);

            movedTask.status = overColumnId;

            destinationColumn.tasks.push(movedTask);

            return { ...prevColumns };
        });

        handleSaveTaskStatusOnly(active.data.current?.task.taskId, over.id as TaskStatus);

    }, [findColumn]);

    // Helper to find data needed for TaskCard in DragOverlay
    const getTaskCardProps = () => {
        if (!activeTask) return null;

        const totalAssignees = (activeTask.assignees.length > 3)
            ? activeTask.assignees.length - 3
            : 0;

        return {
            task: activeTask,
            totalAssignees: totalAssignees
        };
    };

    const taskCardProps = getTaskCardProps();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const fetchTasks = useCallback(() => {
        if (!selectedProject?.id) {
            setTasks([]);
            return () => { };
        }

        const subscription = projectRepository.getTasks({
            projectId: selectedProject.id,
        }, {
            search: searchQuery,
            showMyTask: showMyTasks,
        })
            .pipe(finalize(() => {
                setFetching(false);
            }))
            .subscribe({
                next: res => {
                    if (res?.status) {
                        const updatedTasks = (res?.data || []).map((task: any) => {
                            return {
                                ...task,
                                taskId: task.id,
                                taskIdStr: "task-".concat(String(task.id)),
                                phaseId: task.phaseId,
                                phaseIdStr: "phase-".concat(String(task.phaseId)),
                                status: task.status.toUpperCase().trim().split(/\s+/).join("_") as TaskStatus,
                                priority: task.priority.toUpperCase() as TaskPriority,
                            }
                        });

                        setTasks(updatedTasks);
                    } else {
                        toast.error(res?.msg || res?.message);
                    }
                },
                error: err => { },
            });

        return () => {
            subscription.unsubscribe();
        };
    }, [selectedProject, searchQuery, showMyTasks, setTasks]);


    // --- 2. Create the Debounced Wrapper ---
    const debouncedFetchTasks = useMemo(
        () => debounce(fetchTasks, 100),
        [fetchTasks]
    );

    // --- 3. useEffect to trigger the debounced function on dependency change ---
    useEffect(() => {
        setFetching(true);
        debouncedFetchTasks();

        // Cleanup: Important! Cancel any pending debounced calls when dependencies change
        // or the component unmounts to prevent stale state updates.
        return () => {
            debouncedFetchTasks.cancel();
        };
    }, [searchQuery, showMyTasks, debouncedFetchTasks]);

    useEffect(() => {
        if (!tasks || tasks.length === 0) {
            setColumns(EMPTY_COLUMNS);
            return;
        }

        const newColumns: KanbanColumnsType = {
            ...EMPTY_COLUMNS
        };

        tasks.forEach(task => {
            const status = task.status.toUpperCase().trim().split(/\s+/).join("_") as TaskStatus;
            if (newColumns[status] && !newColumns[status].tasks.some(colTask => colTask.taskId === task.taskId)) {
                newColumns[status].tasks.push(task);
            }
        });

        setColumns(newColumns);
    }, [tasks]);

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            {/* Kanban board header */}
            <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200">

                {/* 1. Search Task Board Input */}
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Search task board"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-9 bg-transparent border border-gray-300 focus:border-blue-500 transition-colors rounded-lg"
                    />
                </div>

                {/* 2. My Tasks Checkbox */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="my-tasks-checkbox"
                        checked={showMyTasks}
                        onChange={(e) => setShowMyTasks(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="my-tasks-checkbox" className="text-sm text-gray-700 select-none">
                        My tasks
                    </label>
                </div>

            </div>
            {fetching && (
                <div className="ml-[700px] w-[500px]">
                    <SpinnerLoader
                        sizeClass="24"
                        message="Getting tasks..."
                    />
                </div>
            )}
            {(!fetching && (!tasks || !tasks.length)) ? (
                <EmptyData
                    title="No tasks found"
                    message={!searchQuery ? "You haven't added any tasks yet. Add one to get started." : `No tasks found with "${searchQuery}"`}
                />
            ) : null}
            {(!fetching && tasks && tasks.length) ? (
                <div className="grid grid-cols-4 gap-4">
                    <DndContext
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        collisionDetection={closestCorners}
                        sensors={sensors}
                    >
                        {Object.values(columns).map((column: KanbanColumnType) => (
                            <KanbanColumn key={column.id} column={column} />
                        ))}

                        <DragOverlay>
                            {taskCardProps ? (
                                <TaskCard
                                    task={taskCardProps.task}
                                />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            ) : null}
        </div>
    );
};

export default KanbanBoard;