"use client";

import { AlertMessage, AlertModal } from "@/components/core/alert-modal/alert-modal";
import { PM_DeliverableItem } from "@/components/core/project-management/pm-deliverable";
import { PM_DraggableItemData } from "@/components/core/project-management/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PM_Phase, PM_Task, ProjectMembershipRole, ReorderType } from "@/model/project-management";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Check, Plus, Search, X } from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { TeamProjectContext, TeamProjectContextProps } from "../../team-project-context";
import SpinnerLoader from "@/components/core/loader/spinner-loader";
import { debounce } from "lodash";
import { finalize } from "rxjs";
import { EmptyData } from "@/components/core/project-management/empty-data";
import { useProjectSkeleton } from "@/hooks/use-project-structure";

export interface ListTabProps { };

export const LIST_GRID_LAYOUT = "grid grid-cols-[1fr_150px_150px_120px] gap-4 items-center px-4";

export const ListTab = ({ }: ListTabProps) => {
    const [isAddingDeliverable, setIsAddingDeliverable] = useState(false);
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
    const scrollContainerRef = useRef(null);

    const {
        selectedProject,
        deliverables,
        isReordering,
        setDeliverables,
        handleReorderList,
        currentMember,
        expandedDeliverables,
        expandedPhases,
        setExpandedDeliverables,
        setExpandedPhases,
        search,
        setSearch,
        scrollToItem,
        setScrollToItem,
        isNavigatingFromTaskBoard,
        setIsNavigatingFromTaskBoard,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const { projectRepository } = useContext<AppContextProps>(AppContext);

    // 🆕 React Query: Fetch skeleton structure
    const { data: skeletonData, isLoading: isFetchingSkeleton, refetch: refetchSkeleton } = useProjectSkeleton(selectedProject?.id?.toString());

    // 🆕 Phase 6: Track lazily-loaded tasks per phase
    const [phaseTasks, setPhaseTasks] = useState<Record<number, any[]>>({});

    // 🆕 Track loading state per phase for skeleton UI
    const [phaseLoadingStates, setPhaseLoadingStates] = useState<Record<number, boolean>>({});

    // Merge skeleton deliverables with lazily-loaded tasks for rendering
    const mergedDeliverables = useMemo(() => {
        const result = deliverables.map(deliverable => ({
            ...deliverable,
            phases: deliverable.phases?.map(phase => ({
                ...phase,
                tasks: phaseTasks[phase.phaseId] || phase.tasks || [], // Use loaded tasks or empty
                isLoadingTasks: phaseLoadingStates[phase.phaseId] || false, // Track loading state
            })) || [],
        }));
        console.log('🔀 mergedDeliverables recalculated:', result);
        console.log('🔀 phaseTasks state:', phaseTasks);
        return result;
    }, [deliverables, phaseTasks, phaseLoadingStates]);

    // Sync skeleton data with context
    useEffect(() => {
        // BUGFIX: Extract data array from response object
        const dataArray = skeletonData?.data || skeletonData;

        if (dataArray && Array.isArray(dataArray)) {
            // Transform skeleton data to match frontend structure
            const transformedData = dataArray.map((deliverable: any) => ({
                ...deliverable,
                deliverableId: deliverable.id,
                deliverableIdStr: String(deliverable.id),
                phases: deliverable.phases?.map((phase: any) => ({
                    ...phase,
                    phaseId: phase.id,
                    phaseIdStr: String(phase.id),
                    tasks: [], // Empty for now - will be lazy loaded in Phase 6
                })) || [],
            }));

            setDeliverables(transformedData);
        }
    }, [skeletonData, setDeliverables]);

    // RBAC Check
    const canEditStructure = currentMember?.role === ProjectMembershipRole.OWNER;

    // Helper function to refetch tasks for a specific phase
    const refetchPhaseTask = useCallback((phaseId: number) => {
        if (!projectRepository || !selectedProject?.id) return;

        console.log('🔄 refetchPhaseTask called for phase:', phaseId);
        projectRepository.getTasksByPhase({
            projectId: selectedProject.id.toString(),
            phaseId: phaseId,
        }).subscribe({
            next: (res) => {
                console.log('📦 API Response:', res);
                if (res?.status) {
                    // Handle both direct and nested data formats
                    const tasks = res.data.data || res.data || [];
                    console.log('✅ Extracted tasks:', tasks);
                    const transformedTasks = tasks.map((task: any) => ({
                        ...task,
                        taskId: task.id,
                        taskIdStr: `task-${task.id}`,
                        phaseId: phaseId,
                        phaseIdStr: `phase-${phaseId}`,
                        status: task.status?.toUpperCase().split(/\s+/).join("_"),
                        priority: task.priority?.toUpperCase(),
                    }));
                    console.log('🔧 Transformed tasks:', transformedTasks);
                    setPhaseTasks(prev => {
                        const updated = {
                            ...prev,
                            [phaseId]: transformedTasks,
                        };
                        console.log('💾 Setting phaseTasks:', updated);
                        return updated;
                    });
                }
            },
            error: (err) => {
                console.error('Failed to refetch tasks for phase:', phaseId, err);
            },
        });
    }, [projectRepository, selectedProject]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            // Require the pointer to move by 5px before activating a drag
            // This prevents a simple click from being treated as a drag
            activationConstraint: {
                distance: 5,
            },
        })
    );

    // Deliverable handlers

    const handleAddDeliverable = useCallback((name: string) => {
        if (!projectRepository) return;
        projectRepository.createDeliverable({
            projectId: selectedProject?.id,
        }, {
            name: name,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    setIsAddingDeliverable(false);
                    refetchSkeleton(); // React Query refetch
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
    }, [selectedProject, projectRepository]);

    const handleUpdateDeliverable = useCallback((deliverableId: number, name: string) => {
        if (!projectRepository) return;
        projectRepository.updateDeliverable({
            projectId: selectedProject?.id,
            deliverableId: deliverableId,
        }, {
            name: name,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    refetchSkeleton(); // React Query: refetch skeleton after update
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
    }, [selectedProject, projectRepository]);

    const handleDeleteDeliverable = useCallback((deliverableId: number) => {
        if (!projectRepository) return;
        projectRepository.deleteDeliverable({
            projectId: selectedProject?.id,
            deliverableId: deliverableId,
        })
            .pipe(finalize(() => {
                refetchSkeleton(); // React Query: refetch skeleton after delete
            }))
            .subscribe({
                next: res => {
                    if (res?.status) {
                        toast.success(res?.message || res?.msg);
                    }
                    else {
                        toast.error(res?.message || res?.msg);
                    }
                },
                error: err => { },
            });
    }, [selectedProject, projectRepository]);

    const handleAddPhase = useCallback((deliverableId: number, name: string) => {
        if (!projectRepository) return;
        projectRepository.createPhase({
            projectId: selectedProject?.id,
            deliverableId: deliverableId,
        }, {
            name: name,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    refetchSkeleton(); // React Query: refetch skeleton after phase create
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
    }, [selectedProject, projectRepository]);

    const handleUpdatePhase = useCallback((phaseId: number, name: string) => {
        if (!projectRepository) return;
        projectRepository.updatePhase({
            projectId: selectedProject?.id,
            phaseId: phaseId,
        }, {
            name: name,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    refetchSkeleton(); // React Query: refetch skeleton after phase update
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
    }, [selectedProject, projectRepository]);

    const handleDeletePhase = useCallback((phaseId: number) => {
        if (!projectRepository) return;
        projectRepository.deletePhase({
            projectId: selectedProject?.id,
            phaseId: phaseId,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    refetchSkeleton(); // React Query: refetch skeleton after phase delete
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });
    }, [selectedProject, projectRepository]);

    // Task handlers
    const handleAddTask = useCallback((phaseId: number, name: string) => {
        if (!projectRepository) return;
        projectRepository.createTask({
            projectId: selectedProject?.id,
            phaseId: phaseId,
        }, {
            name: name,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    refetchPhaseTask(phaseId); // Refetch only this phase's tasks
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
    }, [selectedProject, projectRepository]);

    const handleUpdateTask = useCallback((taskId: number, updatedTask: any) => {
        if (!projectRepository) return;
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
                    refetchPhaseTask(updatedTask.phaseId); // Refetch only this phase's tasks
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
    }, [selectedProject, projectRepository]);

    const handleDeleteTask = useCallback((taskId: number) => {
        if (!projectRepository) return;

        // Find the phaseId for this task
        let targetPhaseId: number | null = null;
        for (const deliverable of mergedDeliverables) {
            for (const phase of deliverable.phases || []) {
                if (phase.tasks?.some((t: any) => t.taskId === taskId)) {
                    targetPhaseId = phase.phaseId;
                    break;
                }
            }
            if (targetPhaseId) break;
        }

        projectRepository.deleteTask({
            projectId: selectedProject?.id,
            taskId: taskId,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    if (targetPhaseId) {
                        refetchPhaseTask(targetPhaseId); // Refetch only this phase's tasks
                    }
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });
    }, [selectedProject, projectRepository, mergedDeliverables, refetchPhaseTask]);

    const handleTogglePhase = useCallback((id: string) => {
        const phaseId = parseInt(id.replace('phase-', ''));
        const isExpanding = !expandedPhases.has(id);

        // If expanding and tasks not yet loaded, fetch them
        if (isExpanding && !phaseTasks[phaseId] && projectRepository && selectedProject?.id) {
            // Set loading state
            setPhaseLoadingStates(prev => ({ ...prev, [phaseId]: true }));

            projectRepository.getTasksByPhase({
                projectId: selectedProject.id.toString(),
                phaseId: phaseId,
            }).subscribe({
                next: (res) => {
                    if (res?.status) {
                        const tasks = res.data.data || res.data || [];
                        // Transform tasks to match frontend structure
                        const transformedTasks = tasks.map((task: any) => ({
                            ...task,
                            taskId: task.id,
                            taskIdStr: `task-${task.id}`,
                            phaseId: phaseId,
                            phaseIdStr: id,
                            status: task.status?.toUpperCase().split(/\s+/).join("_"),
                            priority: task.priority?.toUpperCase(),
                        }));
                        setPhaseTasks(prev => ({
                            ...prev,
                            [phaseId]: transformedTasks,
                        }));
                        // Clear loading state
                        setPhaseLoadingStates(prev => ({ ...prev, [phaseId]: false }));
                    }
                },
                error: (err) => {
                    console.error('Failed to fetch tasks for phase:', phaseId, err);
                    // Clear loading state on error
                    setPhaseLoadingStates(prev => ({ ...prev, [phaseId]: false }));
                },
            });
        }

        // Toggle expansion state
        setExpandedPhases((prevExpanded) => {
            const newExpanded = new Set(prevExpanded);
            if (newExpanded.has(id)) {
                newExpanded.delete(id);
            } else {
                newExpanded.add(id);
            }
            return newExpanded;
        });
    }, [expandedPhases, phaseTasks, selectedProject, projectRepository, setExpandedPhases]);

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

        let newItemsSnapshot; // Will hold the final state array after arrayMove
        let commitType;
        let commitParentId: any;

        // --- Case 1: Reordering Deliverables ---
        if (activeData.type === 'Deliverable' && overData.type === 'Deliverable') {
            const activeIndex = deliverables.findIndex(item => item.deliverableIdStr === active.id);
            const overIndex = deliverables.findIndex(item => item.deliverableIdStr === over.id);

            newItemsSnapshot = arrayMove(deliverables, activeIndex, overIndex);
            commitType = ReorderType.DELIVERABLE;
            // ParentId for top level is the Project ID
            commitParentId = selectedProject?.id as number;
        }

        // --- Case 2: Reordering Phases ---
        else if (activeData.type === 'Phase' && overData.type === 'Phase' && activeData.parentId === overData.parentId) {
            const deliverableIdStr = activeData.parentId;
            const phase: PM_Phase = (active.data.current as any).phase;

            newItemsSnapshot = deliverables.map(del => {
                if (del.deliverableIdStr === deliverableIdStr) {
                    const activeIndex = del.phases.findIndex(p => p.phaseIdStr === active.id);
                    const overIndex = del.phases.findIndex(p => p.phaseIdStr === over.id);
                    return {
                        ...del,
                        phases: arrayMove(del.phases, activeIndex, overIndex),
                    };
                }
                return del;
            });
            commitType = ReorderType.PHASE;
            commitParentId = phase.deliverableId;
        }

        // --- Case 3: Reordering Tasks ---
        else if (activeData.type === 'Task' && overData.type === 'Task' && activeData.parentId === overData.parentId) {
            const phaseIdStr = activeData.parentId;
            const task: PM_Task = (active.data.current as any).task;

            newItemsSnapshot = deliverables.map(del => ({
                ...del,
                phases: del.phases.map(phase => {
                    if (phase.phaseIdStr === phaseIdStr) {
                        const activeIndex = phase.tasks.findIndex(t => t.taskIdStr === active.id);
                        const overIndex = phase.tasks.findIndex(t => t.taskIdStr === over.id);
                        return {
                            ...phase,
                            tasks: arrayMove(phase.tasks, activeIndex, overIndex),
                        };
                    }
                    return phase;
                }),
            }));
            commitType = ReorderType.TASK;
            commitParentId = task.phaseId;
        }

        // --- 2. Execute Side Effects ONLY if a snapshot was created ---
        if (newItemsSnapshot) {
            setDeliverables(newItemsSnapshot);
            let orderedIds = newItemsSnapshot.map(d => d.deliverableId);

            if (commitType === ReorderType.PHASE) {
                const modifiedDeliverable = newItemsSnapshot.find((d) => d.deliverableId === commitParentId);
                if (modifiedDeliverable) {
                    orderedIds = modifiedDeliverable.phases.map((p) => p.phaseId);
                }
            }
            else if (commitType === ReorderType.TASK) {
                const modifiedDeliverable = newItemsSnapshot.find(d => d.phases.some(p => p.phaseId === commitParentId));
                const modifiedPhase = modifiedDeliverable?.phases.find(p => p.phaseId === commitParentId);
                if (modifiedPhase) {
                    orderedIds = modifiedPhase.tasks.map((t) => t.taskId);
                }
            }
            else if (commitType === ReorderType.DELIVERABLE) {
                // orderedIds is already set to newItemsSnapshot.map(d => d.deliverableId);
            }

            handleReorderList(orderedIds, commitParentId, commitType as ReorderType);
        }
    };

    const handleAddDeliverableClick = () => {
        setIsAddingDeliverable(true);
        // Optional: Scroll to bottom logic here
    };

    const handleCancelAddDeliverable = () => {
        setIsAddingDeliverable(false);
    };

    // ✅ React Query handles fetching automatically - no manual useEffect needed!

    /**
     * 🎯 Scroll logic implementation
     * Watches the scrollToItem context state. When set, finds the element and scrolls.
     */
    useEffect(() => {
        // We only need to scroll if the item ID is set
        if (scrollToItem) {
            const element = document.getElementById(scrollToItem);

            if (element) {
                // Define all durations
                const FLASH_TOTAL_DURATION_MS = 2000;
                const FADE_DURATION_MS = 1000;
                const HOLD_DURATION_MS = FLASH_TOTAL_DURATION_MS - FADE_DURATION_MS;

                // 1. Scroll the element into view
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });

                // --- Apply styles and set up timers ---

                // Set transition property immediately
                element.style.transition = `none`;
                // Apply the bright flash color immediately
                element.style.backgroundColor = '#fce9ac'; // Light yellow flash

                requestAnimationFrame(() => {
                    element.style.transition = `background-color ${FADE_DURATION_MS}ms ease-out`;
                });

                // Timer 1: Remove the background color, initiating the smooth fade out.
                const fadeStartTimer = setTimeout(() => {
                    element.style.backgroundColor = '';
                }, HOLD_DURATION_MS);

                // Timer 2: Reset styles and state AFTER the entire visual effect is guaranteed to be complete.
                const resetCleanupTimer = setTimeout(() => {
                    // CRITICAL FIX: Reset both style properties to null to ensure the element returns
                    // to its default, un-styled state, preventing render conflicts.
                    element.style.transition = '';
                    element.style.backgroundColor = '';

                    // Reset the state to prevent re-execution
                    setScrollToItem("");
                    setIsNavigatingFromTaskBoard(false);
                }, FLASH_TOTAL_DURATION_MS + 50); // Add a tiny buffer (50ms) to ensure transition finishes

                // Cleanup function to clear both timeouts if dependencies change
                return () => {
                    clearTimeout(fadeStartTimer);
                    clearTimeout(resetCleanupTimer);
                };
            } else {
                // If element is not found, clear the state to prevent infinite attempts
                setScrollToItem("");
            }
        }
    }, [setScrollToItem, scrollToItem]);

    return (
        <div className="relative">
            {/* --- Top Actions Bar --- */}
            <div className="flex justify-between items-center mb-4 mt-4">
                {/* Search Bar */}
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search list" className="pl-8 h-9 bg-white" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                {/* Reorder Buttons / Add Button */}
                <div className="flex items-center gap-3">
                    {canEditStructure && (
                        <Button
                            onClick={handleAddDeliverableClick}
                            className="cursor-pointer bg-[#7B61FF] hover:bg-indigo-700 mr-3 text-white flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={isAddingDeliverable || isReordering}
                        >
                            <Plus size={16} />
                            New deliverable
                        </Button>
                    )}
                </div>
            </div>

            {/* --- TABLE HEADER ROW --- */}
            <div className={`${LIST_GRID_LAYOUT} py-3 border-b border-gray-200 bg-white text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 z-10`}>
                <div>Deliverable</div>
                <div>Status</div>
                <div>Priority</div>
                <div>Assigned to</div>
            </div>
            <div ref={scrollContainerRef} className="overflow-y-auto max-h-[calc(100vh-200px)]">
                {isFetchingSkeleton && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <SpinnerLoader
                            sizeClass="24"
                            message="Loading project structure..."
                        />
                    </div>
                )}
                {((!deliverables || !deliverables.length) && !isFetchingSkeleton && !isAddingDeliverable) ? (
                    <EmptyData
                        title="No deliverables found"
                        message={!search ? "You haven't added any deliverables yet. Add one to get started." : `No items found with "${search}"`}
                    />
                ) : null}
                {(!isFetchingSkeleton && mergedDeliverables && mergedDeliverables.length || isAddingDeliverable) ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        {/* @ts-ignore - React 19 type incompatibility with @dnd-kit/sortable v10.0.0 */}
                        <SortableContext
                            items={mergedDeliverables.map(d => d.deliverableIdStr)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="flex flex-col pb-10">
                                {mergedDeliverables.map(del => (
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
                ) : null}
            </div>
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