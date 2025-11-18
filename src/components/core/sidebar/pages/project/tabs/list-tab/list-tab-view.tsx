import { PM_DeliverableItem } from "@/components/core/project-management/pm-deliverable";
import { PM_DraggableItemData } from "@/components/core/project-management/type";
import { PM_Deliverable, PM_Phase, PM_Task, PM_TaskAssignee, TaskPriority, TaskStatus } from "@/model/project-management";
import { projectRepository } from "@/repository/project-repository";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useContext, useEffect, useState } from "react";
import { TeamProjectContext, TeamProjectContextProps } from "../../team-project-context";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface ListTabViewProps { };

export const ListTabView = ({ }: ListTabViewProps) => {
    const [isAddingDeliverable, setIsAddingDeliverable] = useState(false);

    const assignee1: PM_TaskAssignee = {
        id: 1,
        avatarUrl: "https://placehold.co/40x40/E0E0E0/707070?text=JD",
    };
    const assignee2: PM_TaskAssignee = {
        id: 2,
        avatarUrl: "https://placehold.co/40x40/C0C0C0/505050?text=AS",
    };
    const assignee3: PM_TaskAssignee = {
        id: 3,
        avatarUrl: "https://placehold.co/40x40/A0A0A0/303030?text=MB",
    };
    const mockDeliverables: PM_Deliverable[] = [
        {
            // --- Deliverable 1 ---
            deliverableId: 1,
            deliverableIdStr: "del-1",
            projectId: 1,
            name: "User Management Feature",
            key: "DEL-01",
            order: 0,
            startDate: "2025-11-10",
            endDate: "2025-11-30",
            phases: [
                {
                    // --- Phase 1.1 ---
                    phaseId: 1,
                    phaseIdStr: "phase-1",
                    deliverableIdStr: "del-1",
                    deliverableId: 1,
                    name: "Authentication",
                    key: "PH-01",
                    order: 0,
                    startDate: "2025-11-10",
                    endDate: "2025-11-18",
                    tasks: [
                        {
                            // --- Task 1.1.1 ---
                            taskId: 101,
                            taskIdStr: "task-101",
                            phaseIdStr: "phase-1",
                            phaseId: 1,
                            name: "Design Login Page UI",
                            key: "TASK-01",
                            status: TaskStatus.IN_PROGRESS,
                            priority: TaskPriority.MAJOR,
                            order: 0,
                            dateAdded: "2025-11-01",
                            startDate: "2025-11-10",
                            endDate: "2025-11-15",
                            assignees: [assignee1],
                        },
                        {
                            // --- Task 1.1.2 ---
                            taskId: 102,
                            taskIdStr: "task-102",
                            phaseIdStr: "phase-1",
                            phaseId: 1,
                            name: "Implement Login API Endpoint",
                            key: "TASK-02",
                            status: TaskStatus.TO_DO,
                            priority: TaskPriority.MAJOR,
                            order: 1,
                            dateAdded: "2025-11-01",
                            startDate: "2025-11-12",
                            endDate: "2025-11-18",
                            assignees: [assignee2, assignee3],
                        },
                    ],
                },
                {
                    // --- Phase 1.2 ---
                    phaseId: 2,
                    phaseIdStr: "phase-2",
                    deliverableIdStr: "del-1",
                    deliverableId: 1,
                    name: "User Profile",
                    key: "PH-02",
                    order: 1,
                    startDate: "2025-11-19",
                    endDate: "2025-11-30",
                    tasks: [
                        {
                            // --- Task 1.2.1 ---
                            taskId: 103,
                            taskIdStr: "task-103",
                            phaseIdStr: "phase-2",
                            phaseId: 2,
                            name: "Profile Page UI",
                            key: "TASK-03",
                            status: TaskStatus.TO_DO,
                            priority: TaskPriority.MEDIUM,
                            order: 0,
                            dateAdded: "2025-11-05",
                            startDate: "2025-11-19",
                            endDate: "2025-11-25",
                            assignees: [assignee1],
                        },
                    ],
                },
            ],
        },
        {
            // --- Deliverable 2 ---
            deliverableId: 2,
            deliverableIdStr: "del-2",
            projectId: 1,
            name: "Initial Deployment",
            key: "DEL-02",
            order: 1,
            startDate: "2025-12-01",
            endDate: "2025-12-05",
            phases: [
                {
                    // --- Phase 2.1 ---
                    phaseId: 3,
                    phaseIdStr: "phase-3",
                    deliverableIdStr: "del-2",
                    deliverableId: 2,
                    name: "Staging Environment",
                    key: "PH-03",
                    order: 0,
                    startDate: "2025-12-01",
                    endDate: "2025-12-05",
                    tasks: [
                        {
                            // --- Task 2.1.1 ---
                            taskId: 104,
                            taskIdStr: "task-104",
                            phaseIdStr: "phase-3",
                            phaseId: 3,
                            name: "Configure Docker Compose",
                            key: "TASK-04",
                            status: TaskStatus.DONE,
                            priority: TaskPriority.MEDIUM,
                            order: 0,
                            dateAdded: "2025-11-20",
                            startDate: "2025-12-01",
                            endDate: "2025-12-03",
                            assignees: [assignee2],
                        },
                        {
                            // --- Task 2.1.2 ---
                            taskId: 105,
                            taskIdStr: "task-105",
                            phaseIdStr: "phase-3",
                            phaseId: 3,
                            name: "Run E2E Tests on Staging",
                            key: "TASK-05",
                            status: TaskStatus.TO_DO,
                            priority: TaskPriority.MEDIUM,
                            order: 1,
                            dateAdded: "2025-11-20",
                            startDate: "2025-12-04",
                            endDate: "2025-12-05",
                            assignees: [], // Unassigned task
                        },
                    ],
                },
            ],
        },
    ];

    const [deliverables, setDeliverables] = useState<PM_Deliverable[]>(mockDeliverables);
    // (Using string IDs, as dnd-kit uses strings)
    const [expandedDeliverables, setExpandedDeliverables] = useState<Set<string>>(
        new Set([]) // Default expanded deliverables
    );
    const [expandedPhases, setExpandedPhases] = useState<Set<string>>(
        new Set([]) // Default expanded phases
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

    const createToggleHandler = (
        setter: React.Dispatch<React.SetStateAction<Set<string>>>
    ) => {
        return (id: string) => {
            setter(prev => {
                const newSet = new Set(prev);
                if (newSet.has(id)) {
                    newSet.delete(id);
                } else {
                    newSet.add(id);
                }
                return newSet;
            });
        };
    };

    const handleToggleDeliverable = createToggleHandler(setExpandedDeliverables);
    const handleTogglePhase = createToggleHandler(setExpandedPhases);

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
                            p => p.phaseId === active.id
                        );
                        const overIndex = del.phases.findIndex(
                            p => p.phaseId === over.id
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
                                t => t.taskId === active.id
                            );
                            const overIndex = phase.tasks.findIndex(
                                t => t.taskId === over.id
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

    const handleSaveNewDeliverable = (name: string) => {
        // 1. Create the new object (Optimistic update)
        // Ideally, you should generate a temp ID or wait for API response
        const newDeliverable: PM_Deliverable = {
            deliverableId: Date.now(), // Temporary ID
            deliverableIdStr: `del-${Date.now()}`,
            projectId: selectedProject?.id || 0,
            name: name,
            key: `DEL-NEW`, // You'd likely calculate this based on count
            order: deliverables.length,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            phases: []
        };

        setDeliverables([...deliverables, newDeliverable]);
        setIsAddingDeliverable(false);
        toast.success("Deliverable created successfully");

        // 2. Call API to persist (Example structure)
        /*
        projectRepository.createDeliverable({
            projectId: selectedProject?.id,
            name: name
        }).subscribe({
            next: (res) => { 
                // Update the temporary item with real ID from response 
            },
            error: () => toast.error("Failed to create deliverable")
        })
        */
    };

    useEffect(() => {
        projectRepository.getProjectStructure({
            projectId: selectedProject?.id,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    const deliverables = res?.data || [];
                    deliverables.map((deliverable: PM_Deliverable) => {
                        const deliverableIdStr = "del-".concat(deliverable.deliverableId.toString());
                        const phases = (deliverable.phases || []).map((phase: PM_Phase) => {
                            const phaseIdStr = "phase-".concat(phase.phaseId.toString());
                            const tasks = (phase.tasks || []).map((task: PM_Task) => {
                                const taskIdStr = "task-".concat(task.taskId.toString());
                                return {
                                    ...task,
                                    taskIdStr,
                                    phaseIdStr,
                                };
                            })
                            return {
                                ...phase,
                                tasks,
                                phaseIdStr,
                                deliverableIdStr,
                            };
                        });
                        return {
                            ...deliverable,
                            phases,
                            deliverableIdStr,
                        };
                    })

                    setDeliverables(deliverables);
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });
    }, []);

    return (
        <div className="relative">
            <div className="flex justify-end mb-4">
                <Button
                    onClick={handleAddDeliverableClick}
                    className="mt-3 mr-3 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isAddingDeliverable} // Disable while adding
                >
                    <Plus size={16} />
                    Add deliverable
                </Button>
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
                                onToggle={handleToggleDeliverable}
                                expandedPhaseIds={expandedPhases}
                                onTogglePhase={handleTogglePhase}
                            />
                        ))}
                        {isAddingDeliverable && (
                            <NewDeliverableInput
                                onSave={handleSaveNewDeliverable}
                                onCancel={handleCancelAddDeliverable}
                            />
                        )}
                    </div>
                </SortableContext>
            </DndContext>
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