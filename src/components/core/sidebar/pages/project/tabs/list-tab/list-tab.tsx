import { AlertMessage, AlertModal } from "@/components/core/alert-modal/alert-modal";
import { PM_DeliverableItem } from "@/components/core/project-management/pm-deliverable";
import { PM_DraggableItemData } from "@/components/core/project-management/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PM_Deliverable } from "@/model/project-management";
import { projectRepository } from "@/repository/project-repository";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Check, Plus, Search, X } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { TeamProjectContext, TeamProjectContextProps } from "../../team-project-context";

export interface ListTabProps { };

export const LIST_GRID_LAYOUT = "grid grid-cols-[1fr_150px_150px_120px] gap-4 items-center px-4";

export const ListTab = ({ }: ListTabProps) => {
    const [isAddingDeliverable, setIsAddingDeliverable] = useState(false);
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

    const [deliverables, setDeliverables] = useState<PM_Deliverable[]>([]);
    const [expandedDeliverables, setExpandedDeliverables] = useState<Set<string>>(
        new Set([])
    );
    const [expandedPhases, setExpandedPhases] = useState<Set<string>>(
        new Set([])
    );

    const {
        selectedProject,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            // Require the pointer to move by 5px before activating a drag
            // This prevents a simple click from being treated as a drag
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const getProjectStructure = useCallback(() => {
        const subscription = projectRepository.getProjectStructure({
            projectId: selectedProject?.id,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    const projectDeliverables = res?.data?.data || [];

                    // --- Transformation Logic ---
                    const updatedProjectDeliverables = projectDeliverables.map((deliverable: any) => {
                        const deliverableIdStr = `del-${deliverable.id}`;

                        const phases = (deliverable.phases || []).map((phase: any) => {
                            const phaseIdStr = `phase-${phase.id}`;

                            const tasks = (phase.tasks || []).map((task: any) => {
                                const taskIdStr = `task-${task.id}`;

                                return {
                                    ...task,
                                    taskId: task.id,
                                    taskIdStr,
                                    phaseId: phase.id,
                                    phaseIdStr,
                                    status: task.status.toUpperCase().split(/\s+/).join("_"),
                                    priority: task.priority.toUpperCase(),
                                };
                            });

                            return {
                                ...phase,
                                tasks,
                                phaseId: phase.id,
                                phaseIdStr,
                                deliverableId: deliverable.id,
                                deliverableIdStr,
                            };
                        });

                        return {
                            ...deliverable,
                            phases,
                            deliverableId: deliverable.id,
                            deliverableIdStr,
                        };
                    });

                    setDeliverables(updatedProjectDeliverables);
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });

        // 2. Return the cleanup function
        return () => {
            subscription.unsubscribe();
        };
    }, [selectedProject]);

    // Deliverable handlers

    const handleAddDeliverable = useCallback((name: string) => {
        projectRepository.createDeliverable({
            projectId: selectedProject?.id,
        }, {
            name: name,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getProjectStructure();
                }
                else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
                }
            },
            error: err => {
                const errors = err?.response?.data?.data;
                const message = err?.response?.data?.msg || err?.response?.data?.message;
                setAlertMessage({
                    type: "warning",
                    title: message,
                    description: errors,
                });
            },
        });
    }, [selectedProject]);

    const handleUpdateDeliverable = useCallback((deliverableId: number, name: string) => {
        projectRepository.updateDeliverable({
            projectId: selectedProject?.id,
            deliverableId: deliverableId,
        }, {
            name: name,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getProjectStructure();
                }
                else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
                }
            },
            error: err => {
                const errors = err?.response?.data?.data;
                const message = err?.response?.data?.msg || err?.response?.data?.message;
                setAlertMessage({
                    type: "warning",
                    title: message,
                    description: errors,
                });
            },
        });
    }, [selectedProject]);

    const handleDeleteDeliverable = useCallback((deliverableId: number) => {
        projectRepository.deleteDeliverable({
            projectId: selectedProject?.id,
            deliverableId: deliverableId,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getProjectStructure();
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });
    }, [selectedProject]);

    const handleAddPhase = useCallback((deliverableId: number, name: string) => {
        projectRepository.createPhase({
            projectId: selectedProject?.id,
            deliverableId: deliverableId,
        }, {
            name: name,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getProjectStructure();
                }
                else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
                }
            },
            error: err => {
                const errors = err?.response?.data?.data;
                const message = err?.response?.data?.msg || err?.response?.data?.message;
                setAlertMessage({
                    type: "warning",
                    title: message,
                    description: errors,
                });
            },
        });
    }, [selectedProject]);

    const handleUpdatePhase = useCallback((phaseId: number, name: string) => {
        projectRepository.updatePhase({
            projectId: selectedProject?.id,
            phaseId: phaseId,
        }, {
            name: name,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getProjectStructure();
                }
                else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
                }
            },
            error: err => {
                const errors = err?.response?.data?.data;
                const message = err?.response?.data?.msg || err?.response?.data?.message;
                setAlertMessage({
                    type: "warning",
                    title: message,
                    description: errors,
                });
            },
        });
    }, [selectedProject]);

    const handleDeletePhase = useCallback((phaseId: number) => {
        projectRepository.deletePhase({
            projectId: selectedProject?.id,
            phaseId: phaseId,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getProjectStructure();
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });
    }, [selectedProject]);

    // Task handlers
    const handleAddTask = useCallback((phaseId: number, name: string) => {
        projectRepository.createTask({
            projectId: selectedProject?.id,
            phaseId: phaseId,
        }, {
            name: name,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getProjectStructure();
                }
                else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
                }
            },
            error: err => {
                const errors = err?.response?.data?.data;
                const message = err?.response?.data?.msg || err?.response?.data?.message;
                setAlertMessage({
                    type: "warning",
                    title: message,
                    description: errors,
                });
            },
        });
    }, [selectedProject]);

    const handleUpdateTask = useCallback((taskId: number, updatedTask: any) => {
        projectRepository.updateTask({
            projectId: selectedProject?.id,
            taskId: taskId,
        }, {
            name: updatedTask.name,
            status: updatedTask.status,
            priority: updatedTask.priority,
            startDate: updatedTask.startDate,
            endDate: updatedTask.endDate,
            assigneeIds: updatedTask.assigneeIds || [],
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getProjectStructure();
                }
                else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
                }
            },
            error: err => {
                const errors = err?.response?.data?.data;
                const message = err?.response?.data?.msg || err?.response?.data?.message;
                setAlertMessage({
                    type: "warning",
                    title: message,
                    description: errors,
                });
            },
        });
    }, [selectedProject]);

    const handleDeleteTask = useCallback((taskId: number) => {
        projectRepository.deletePhase({
            projectId: selectedProject?.id,
            taskId: taskId,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getProjectStructure();
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });
    }, [selectedProject]);

    const handleTogglePhase = useCallback((id: string) => {
        setExpandedPhases(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    const handleToggleDeliverable = useCallback((id: string) => {
        setExpandedDeliverables(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const activeData = active.data.current as PM_DraggableItemData;
        const overData = over.data.current as PM_DraggableItemData;

        // --- Case 1: Reordering Deliverables ---
        if (activeData.type === 'Deliverable' && overData.type === 'Deliverable') {
            setDeliverables(items => {
                const activeIndex = items.findIndex(
                    item => item.deliverableIdStr === active.id
                );
                const overIndex = items.findIndex(
                    item => item.deliverableIdStr === over.id
                );
                return arrayMove(items, activeIndex, overIndex);
            });
            return;
        }

        // --- Case 2: Reordering Phases ---
        if (
            activeData.type === 'Phase' &&
            overData.type === 'Phase' &&
            activeData.parentId === overData.parentId
        ) {
            const deliverableId = activeData.parentId;
            setDeliverables(items =>
                items.map(del => {
                    if (del.deliverableIdStr === deliverableId) {
                        const activeIndex = del.phases.findIndex(
                            p => p.phaseIdStr === active.id
                        );
                        const overIndex = del.phases.findIndex(
                            p => p.phaseIdStr === over.id
                        );
                        return {
                            ...del,
                            phases: arrayMove(del.phases, activeIndex, overIndex),
                        };
                    }
                    return del;
                })
            );
            return;
        }

        // --- Case 3: Reordering Tasks ---
        if (
            activeData.type === 'Task' &&
            overData.type === 'Task' &&
            activeData.parentId === overData.parentId
        ) {
            const phaseId = activeData.parentId;
            setDeliverables(items =>
                items.map(del => ({
                    ...del,
                    phases: del.phases.map(phase => {
                        if (phase.phaseIdStr === phaseId) {
                            const activeIndex = phase.tasks.findIndex(
                                t => t.taskIdStr === active.id
                            );
                            const overIndex = phase.tasks.findIndex(
                                t => t.taskIdStr === over.id
                            );
                            return {
                                ...phase,
                                tasks: arrayMove(phase.tasks, activeIndex, overIndex),
                            };
                        }
                        return phase;
                    }),
                }))
            );
            return;
        }

        console.warn("Unhandled drag case:", { activeData, overData });
    };

    const handleAddDeliverableClick = () => {
        setIsAddingDeliverable(true);
        // Optional: Scroll to bottom logic here
    };

    const handleCancelAddDeliverable = () => {
        setIsAddingDeliverable(false);
    };

    useEffect(() => {
        getProjectStructure();
    }, []);

    return (
        <div className="relative">
            {/* --- Top Actions Bar --- */}
            <div className="flex justify-between items-center mb-4 mt-4">
                {/* Search Bar (from image) */}
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search list" className="pl-8 h-9 bg-white" />
                </div>

                <Button
                    onClick={handleAddDeliverableClick}
                    className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 mr-3 text-white flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isAddingDeliverable}
                >
                    <Plus size={16} />
                    New deliverable
                </Button>
            </div>

            {/* --- TABLE HEADER ROW --- */}
            <div className={`${LIST_GRID_LAYOUT} py-3 border-b border-gray-200 bg-white text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 z-10`}>
                <div>Deliverable</div>
                <div>Status</div>
                <div>Priority</div>
                <div>Assigned to</div>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={deliverables.map(d => d.deliverableIdStr)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col pb-10">
                        {deliverables.map(del => (
                            <PM_DeliverableItem
                                key={del.deliverableIdStr}
                                deliverable={del}
                                isExpanded={expandedDeliverables.has(del.deliverableIdStr)}
                                expandedPhaseIds={expandedPhases}
                                onToggle={handleToggleDeliverable}
                                onTogglePhase={handleTogglePhase}
                                onAddPhase={handleAddPhase}
                                onAddTask={handleAddTask}
                                onUpdateDeliverableName={handleUpdateDeliverable}
                                onDeleteDeliverable={handleDeleteDeliverable}
                                onUpdatePhaseName={handleUpdatePhase}
                                onDeletePhase={handleDeletePhase}
                                onUpdateTask={handleUpdateTask}
                                onDeleteTask={handleDeleteTask}
                            />
                        ))}
                        {isAddingDeliverable && (
                            <NewDeliverableInput
                                onSave={handleAddDeliverable}
                                onCancel={handleCancelAddDeliverable}
                            />
                        )}
                    </div>
                </SortableContext>
            </DndContext>
            {alertMessage && (
                <AlertModal
                    alertMessage={alertMessage}
                    onClose={() => {
                        setAlertMessage(null);
                    }}
                />
            )}
        </div>
    );
};

const NewDeliverableInput = ({
    onSave,
    onCancel
}: {
    onSave: (name: string) => void;
    onCancel: () => void;
}) => {
    const [name, setName] = useState("");

    return (
        <div className="my-3 bg-white rounded-lg shadow border border-gray-200 p-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <Input
                autoFocus
                placeholder="Enter deliverable name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && name.trim()) onSave(name);
                    if (e.key === "Escape") onCancel();
                }}
                className="flex-1 h-9"
            />
            <div className="flex items-center gap-1">
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 cursor-pointer text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => name.trim() && onSave(name)}
                    disabled={!name.trim()}
                >
                    <Check size={16} />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={onCancel}
                >
                    <X size={16} />
                </Button>
            </div>
        </div>
    );
};