"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateBarPosition, cn, getDaysDiff, getId, getOrthogonalPath, toDayJs } from "@/lib/utils";
import { ProjectDependency, ProjectTimelineStructure, TimelineItem, TimelineMilestone } from '@/model/project-management';
import { projectRepository } from "@/repository/project-repository";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { isEqual } from "lodash";
import { ChevronDown, ChevronRight, Link2, Link2Off, Loader2, Save, X } from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { finalize } from "rxjs";
import { toast } from "sonner";
import { TeamProjectContext, TeamProjectContextProps } from '../../team-project-context';
import GanttBar from "./components/gnatt-bar";
import { AlertMessage, AlertModal } from "@/components/core/alert-modal/alert-modal";
dayjs.extend(isoWeek);

export interface GanttTimelineBoardProps {
};

export function GanttTimelineBoard({ }: GanttTimelineBoardProps) {
    const timelineScrollRef = useRef<HTMLDivElement>(null);
    const hierarchyScrollRef = useRef<HTMLDivElement>(null);
    const [expandedDeliverables, setExpandedDeliverables] = useState<Set<number>>(new Set());
    const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set());
    const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);
    const [timelineStructure, setTimelineStructure] = useState<ProjectTimelineStructure | null>(null);
    const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isAddingDependency, setIsAddingDependency] = useState(false);
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
    const [dependencyDragLine, setDependencyDragLine] = useState<{
        startX: number;
        startY: number;
        currentX: number;
        currentY: number;
    } | null>(null);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [dependencySource, setDependencySource] = useState<TimelineItem | null>(null);
    const [dependencies, setDependencies] = useState<ProjectDependency[]>([]);
    const [dependencyBeingHovered, setDependencyBeingHovered] = useState<ProjectDependency | null>(null);

    const {
        timelineData: originalTimelineStructure,
        getItemDependencies,
        dependencies: originalDependencies,
        selectedProject,
        getProjectTimeline,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const getLocalCoordinates = useCallback((e: MouseEvent | React.MouseEvent) => {
        if (!timelineScrollRef.current) return { x: 0, y: 0 };

        const rect = timelineScrollRef.current.getBoundingClientRect();
        return {
            x: e.clientX - rect.left + timelineScrollRef.current.scrollLeft,
            y: e.clientY - rect.top + timelineScrollRef.current.scrollTop
        };
    }, []);

    const handleMouseMoveWhenAddingDependency = (moveEvent: MouseEvent) => {
        const local = getLocalCoordinates(moveEvent);
        setDependencyDragLine(prev => prev ? ({
            ...prev,
            currentX: local.x,
            currentY: local.y
        }) : null);
    };

    const handleMouseUpWhenAddingDependency = () => {
        document.removeEventListener('mousemove', handleMouseMoveWhenAddingDependency);
        document.removeEventListener('mouseup', handleMouseUpWhenAddingDependency);

        setDependencyDragLine(null);
    };

    const originalItemsMap = useMemo(() => {
        const map = new Map<string, TimelineItem>();

        const traverse = (items: TimelineItem[]) => {
            items.forEach(item => {
                map.set(getId(item.type, item.id), item);

                if (item.children) traverse(item.children);
            });
        };

        if (originalTimelineStructure?.items) {
            traverse(originalTimelineStructure.items);
        }

        return map;
    }, [originalTimelineStructure]);

    const handleDraggingLineDropWhenAddingDependency = (target: TimelineItem) => {
        // If target is null, or source is null, or target type differs from source type, show alert and cancel create dependency
        if (!dependencySource || !target || !isEqual(dependencySource?.type, target.type)) {
            setAlertMessage({
                type: "error",
                title: "Could not create dependency",
                description: "Could not create dependency between 2 items with different types"
            });

            return;
        }
        const updatedDependencies = [...dependencies];
        const newDependency: ProjectDependency = {
            type: target.type,
            fromId: dependencySource?.id as number,
            toId: target.id,
        };
        updatedDependencies.push(newDependency)
        setDependencies(updatedDependencies);
        setSelectedItem(target);

        const subscription = projectRepository.createDependency({
            projectId: selectedProject?.id as number,
        }, {
            type: newDependency.type,
            fromId: newDependency.fromId,
            toId: newDependency.toId,
        })
            .pipe(finalize(() => {
                setDependencySource(null);
                setIsAddingDependency(false);
                getProjectTimeline();
            }))
            .subscribe({
                next: res => {
                    if (res?.status) {
                        setSelectedItem(target);
                        toast.success(res?.msg || res?.message);
                    }
                    else {
                        setAlertMessage({
                            type: "warning",
                            title: res?.message || res?.msg,
                            description: res?.data,
                        });

                        setSelectedItem(null);
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

                    setSelectedItem(null);
                },
            });

        return () => {
            subscription.unsubscribe();
        }
    };

    const handleMouseDownWhenAddingDependency = (e: any, item: TimelineItem) => {
        const startCoordinates = getLocalCoordinates(e);

        if (isAddingDependency && startCoordinates) {
            e.stopPropagation();
            e.preventDefault();


            const startX = startCoordinates.x;
            const startY = startCoordinates.y;

            setDependencyDragLine({
                startX: startX,
                startY: startY,
                currentX: startX,
                currentY: startY
            });

            setDependencySource(item);

            // Add listeners
            document.addEventListener('mousemove', handleMouseMoveWhenAddingDependency);
            document.addEventListener('mouseup', handleMouseUpWhenAddingDependency);
        }
    };

    const handleDeleteDependency = useCallback(() => {
        if (!dependencyBeingHovered) {
            return;
        }

        const deleteDependencyIndex = dependencies.findIndex(dep => isEqual(dep.type, dependencyBeingHovered.type)
            && isEqual(dep.fromId, dependencyBeingHovered.fromId) && isEqual(dep.toId, dependencyBeingHovered.toId));
        if (deleteDependencyIndex === -1) {
            return;
        }
        const updatedDependencies = [...dependencies];
        updatedDependencies.splice(deleteDependencyIndex, 1);
        setDependencies(updatedDependencies);

        const subscription = projectRepository.deleteDependency({
            projectId: selectedProject?.id as number,
        }, {
            ...dependencyBeingHovered,
        })
            .pipe(finalize(() => {
                getProjectTimeline();
            }))
            .subscribe({
                next: res => {
                    if (res?.status) {
                        toast.success(res?.message || res?.msg);
                        setDependencyBeingHovered(null);
                    }
                    else {
                        toast.error(res?.message || res?.msg);
                    }
                },
                error: err => { },
            });

        return () => {
            subscription.unsubscribe();
        }
    }, [selectedProject, getProjectTimeline, dependencyBeingHovered, dependencies]);

    const initUpdateTimelineItemsBody = (item: TimelineItem, body: TimelineItem[]) => {
        const originalItem = originalItemsMap.get(getId(item.type, item.id));

        if (!originalItem) {
            return body;
        }
        if (!isEqual(originalItem.startDate, item.startDate) || !isEqual(originalItem.endDate, item.endDate)) {
            body.push(item);
        }
        if (!item.children || !item.children.length) {
            return body;
        }
        item.children.forEach((child: TimelineItem) => {
            initUpdateTimelineItemsBody(child, body);
        });
        return body;
    };

    const handleUpdateTimelineDates = useCallback(() => {
        let body: any[] = [];

        setIsUpdating(true);
        
        (timelineStructure?.items || []).forEach((item: TimelineItem) => {
            initUpdateTimelineItemsBody(item, body);
        });
        const subscription = projectRepository.updateTimelineDates({
            projectId: selectedProject?.id as number,
        }, {
            type: body[0].type,
            id: body[0].id,
            start_date: body[0].startDate,
            end_date: body[0].endDate,
        })
        .pipe(finalize(() => {
            setIsUpdating(false);
        }))
        .subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getProjectTimeline();
                }
                else {
                    setAlertMessage({
                        type: "error",
                        title: res?.msg || res?.message,
                        description: res?.data
                    });
                }
            },
            error: err => {
                const errors = err?.response?.data?.data;
                const message = err?.response?.data?.msg || err?.response?.data?.message;
                setAlertMessage({
                    type: "error",
                    title: message,
                    description: errors,
                });
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [selectedProject, timelineStructure]);

    const hasUnsavedChanges = useMemo(() => {
        if (!timelineStructure || !originalTimelineStructure) {
            return false;
        }

        return !isEqual(timelineStructure, originalTimelineStructure);
    }, [timelineStructure, originalTimelineStructure, selectedItem, hoveredRowId]);

    const relatedIds = useMemo(() => {
        // If nothing is selected, the set is empty (logic handled in render)
        if (!selectedItem) return new Set<string>();

        const startId = getId(selectedItem.type, selectedItem.id);
        const visited = new Set<string>();
        const queue = [startId];

        while (queue.length > 0) {
            const currentId = queue.shift()!;

            if (visited.has(currentId)) continue;
            visited.add(currentId);

            dependencies.forEach(dep => {
                const source = getId(dep.type, dep.fromId);
                const target = getId(dep.type, dep.toId);

                if (source === currentId) {
                    if (!visited.has(target)) queue.push(target);
                } else if (target === currentId) {
                    if (!visited.has(source)) queue.push(source);
                }
            });
        }

        return visited;
    }, [selectedItem, dependencies]);

    const { months, weeks } = useMemo(() => {
        if (!timelineStructure?.projectStartDate) {
            return { weeks: [], months: [] };
        }

        const weeks: string[] = [];
        const months: { label: string; colSpan: number }[] = [];

        let currentWeek = dayjs(timelineStructure.projectStartDate).startOf('isoWeek');
        const endOfYear = dayjs(timelineStructure.projectStartDate).endOf('year');

        let currentMonthLabel = currentWeek.format("MMMM YYYY");
        let currentMonthSpan = 0;

        while (currentWeek.isBefore(endOfYear) || currentWeek.isSame(endOfYear, 'week')) {
            weeks.push(`Week ${currentWeek.isoWeek()}`);

            const monthLabel = currentWeek.format("MMMM YYYY");

            if (monthLabel !== currentMonthLabel) {
                months.push({ label: currentMonthLabel, colSpan: currentMonthSpan });
                currentMonthLabel = monthLabel;
                currentMonthSpan = 1;
            } else {
                currentMonthSpan++;
            }

            currentWeek = currentWeek.add(1, 'week');
        }

        // Push the final month
        if (currentMonthSpan > 0) {
            months.push({ label: currentMonthLabel, colSpan: currentMonthSpan });
        }

        return { weeks, months };
    }, [timelineStructure?.projectStartDate]);

    const totalViewDays = useMemo(() => getDaysDiff(
        new Date(timelineStructure?.projectStartDate || toDayJs().format("YYYY-MM-DD")),
        new Date(toDayJs().endOf("year").format("YYYY-MM-DD"))) + 1,
        [timelineStructure]);


    // --- 3. Handlers ---
    const toggleDeliverable = useCallback((id: number) => {
        setExpandedDeliverables(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    }, []);

    const togglePhase = useCallback((id: number) => {
        setExpandedPhases(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    }, []);

    const toggleExpand = useCallback((item: TimelineItem) => {
        if (item.type === 'DELIVERABLE') {
            toggleDeliverable(item.id);
        }
        else {
            togglePhase(item.id);
        }
    }, [toggleDeliverable, togglePhase]);

    const handleUpdateGnattBarDate = useCallback((id: number | string, newStart: string, newEnd: string) => {
        setTimelineStructure((prevStructure) => {
            if (!prevStructure) return null;
            const updateRecursive = (items: TimelineItem[]): TimelineItem[] => {
                return items.map((item) => {
                    if (getId(item.type, item.id) === id) {
                        return {
                            ...item,
                            startDate: newStart,
                            endDate: newEnd
                        };
                    }
                    if (item.children && item.children.length > 0) {
                        return {
                            ...item,
                            // Create a new array reference for children
                            children: updateRecursive(item.children)
                        };
                    }
                    return item;
                });
            };
            return {
                ...prevStructure,
                items: updateRecursive(prevStructure.items || [])
            };
        });
    }, []);

    const handleMoveGnattBar = useCallback((id: number | string, daysShift: number) => {
        setTimelineStructure((prevStructure) => {
            if (!prevStructure) return null;

            const shiftItemAndSubtree = (item: TimelineItem): TimelineItem => {
                return {
                    ...item,
                    startDate: toDayJs(item.startDate, 0).add(daysShift, 'day').format('YYYY-MM-DD'),
                    endDate: toDayJs(item.endDate, 0).add(daysShift, 'day').format('YYYY-MM-DD'),
                    children: item.children ? item.children.map(shiftItemAndSubtree) : []
                };
            };

            const findAndShiftRecursive = (items: TimelineItem[]): TimelineItem[] => {
                return items.map((item) => {
                    if (getId(item.type, item.id) === id) {
                        return shiftItemAndSubtree(item);
                    }
                    if (item.children && item.children.length > 0) {
                        return {
                            ...item,
                            children: findAndShiftRecursive(item.children)
                        };
                    }
                    return item;
                });
            };

            return {
                ...prevStructure,
                items: findAndShiftRecursive(prevStructure.items || [])
            };
        });
    }, []);

    // --- 4. Flattening Logic ---
    const getVisibleItems = useCallback((items: TimelineItem[]): { item: TimelineItem, depth: number }[] => {
        let visible: { item: TimelineItem, depth: number }[] = [];

        items.forEach(item => {
            visible.push({ item, depth: 0 }); // Add parent
            if (((expandedDeliverables.has(item.id) && item.type === 'DELIVERABLE') || (expandedPhases.has(item.id) && item.type === 'PHASE')) && item.children) {
                const children = getVisibleItems(item.children); // Recurse
                // Adjust depth for children
                visible = visible.concat(children.map(c => ({ ...c, depth: c.depth + 1 })));
            }
        });

        return visible;
    }, [expandedDeliverables, expandedPhases]);

    const visibleRows = useMemo(() => getVisibleItems(timelineStructure?.items || []), [timelineStructure, getVisibleItems]);

    const isItemExpanded = useCallback((item: TimelineItem) => {
        return (expandedDeliverables.has(item.id) && item.type === 'DELIVERABLE')
            || (expandedPhases.has(item.id) && item.type === 'PHASE');
    }, [expandedDeliverables, expandedPhases]);

    const itemCoordinates = useMemo(() => {
        const coords = new Map<string, { xStart: number; xEnd: number; y: number }>();

        let currentY = 0;
        const ROW_HEIGHT = 48; // Must match your CSS h-12 (12 * 4px = 48px)
        const HEADER_HEIGHT = 88; // Height of the date header

        // Calculate Total Width in Pixels (Crucial for SVG)
        // We assume 150px per week column as defined in your TableHead
        const realTableWidth = containerWidth
            ? containerWidth
            : (weeks.length * 150);

        const TOTAL_WIDTH = realTableWidth;

        visibleRows.forEach(({ item }) => {
            // Y Coordinate: Top of row + Half Height + Header Offset
            const centerY = currentY + (ROW_HEIGHT / 2) + HEADER_HEIGHT;

            // X Coordinates: Calculate percentage, then convert to pixels based on TOTAL_WIDTH
            // Reuse your existing logic for math
            const start = new Date(item.startDate || originalTimelineStructure?.projectStartDate || toDayJs().format("YYYY-MM-DD"));
            const end = new Date(item.endDate || originalTimelineStructure?.projectStartDate || toDayJs().format("YYYY-MM-DD"));

            const daysFromStart = getDaysDiff(start, new Date(originalTimelineStructure?.projectStartDate || toDayJs().format("YYYY-MM-DD")));
            const duration = getDaysDiff(end, start) + 1;

            const leftPercent = (daysFromStart / totalViewDays);
            const widthPercent = (duration / totalViewDays);

            const xStartPixel = leftPercent * TOTAL_WIDTH;
            const xEndPixel = (leftPercent + widthPercent) * TOTAL_WIDTH;

            coords.set(getId(item.type, item.id), {
                xStart: xStartPixel,
                xEnd: xEndPixel,
                y: centerY
            });

            currentY += ROW_HEIGHT;
        });

        return { coords, totalHeight: currentY + HEADER_HEIGHT, totalWidth: TOTAL_WIDTH };
    }, [visibleRows, originalTimelineStructure?.projectStartDate, weeks, containerWidth]);

    const getParentStartDateEndDate = useCallback((timelineItem: TimelineItem) => {
        let parentStartDate = timelineStructure?.projectStartDate || toDayJs(undefined, 0).format("YYYY-MM-DD");
        let parentEndDate = toDayJs(undefined, 0).endOf("year").format("YYYY-MM-DD");
        if (timelineItem.type === 'DELIVERABLE') {
            return {
                parentStartDate,
                parentEndDate,
            }
        }
        (timelineStructure?.items || []).forEach(item => {
            if ((item.children || []).some(child => child.id === timelineItem.id)) {
                parentStartDate = item.startDate || parentStartDate;
                parentEndDate = item.endDate || parentEndDate;
            }
        });

        return {
            parentStartDate,
            parentEndDate,
        }
    }, [timelineStructure]);

    // --- Scroll Synchronization ---
    useEffect(() => {
        const timelineEl = timelineScrollRef.current;
        const hierarchyEl = hierarchyScrollRef.current;

        if (!timelineEl || !hierarchyEl) return;

        const handleTimelineScroll = () => {
            // Sync vertical scroll from Right -> Left
            if (hierarchyEl.scrollTop !== timelineEl.scrollTop) {
                hierarchyEl.scrollTop = timelineEl.scrollTop;
            }
        };

        const handleHierarchyScroll = () => {
            // Sync vertical scroll from Left -> Right
            if (timelineEl.scrollTop !== hierarchyEl.scrollTop) {
                timelineEl.scrollTop = hierarchyEl.scrollTop;
            }
        };

        timelineEl.addEventListener('scroll', handleTimelineScroll);
        hierarchyEl.addEventListener('scroll', handleHierarchyScroll);

        return () => {
            timelineEl.removeEventListener('scroll', handleTimelineScroll);
            hierarchyEl.removeEventListener('scroll', handleHierarchyScroll);
        };
    }, []);

    useEffect(() => {
        setTimelineStructure({
            projectStartDate: originalTimelineStructure?.projectStartDate || toDayJs().format("YYYY-MM-DD"),
            items: [...(originalTimelineStructure?.items || [])],
            milestones: [...(originalTimelineStructure?.milestones || [])],
        });
    }, [originalTimelineStructure]);

    useEffect(() => {
        setDependencies([...originalDependencies]);
    }, [originalDependencies]);

    useEffect(() => {
        if (selectedItem && !isAddingDependency) {
            getItemDependencies(selectedItem);
        }
    }, [selectedItem, isAddingDependency]);

    useEffect(() => {
        // Function to update width
        const handleResize = () => {
            if (timelineScrollRef.current) {
                // We track the scrollWidth or clientWidth to detect layout changes
                setContainerWidth(timelineScrollRef.current.clientWidth);
            }
        };

        // 1. Initial measurement
        handleResize();

        // 2. Window resize listener
        window.addEventListener('resize', handleResize);

        // 3. (Optional but recommended) ResizeObserver for the specific container
        // This catches layout changes that aren't just window resizes (e.g. sidebar toggles)
        const resizeObserver = new ResizeObserver(handleResize);
        if (timelineScrollRef.current) {
            resizeObserver.observe(timelineScrollRef.current);
        }

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (dependencyBeingHovered && (e.key === 'Delete' || e.key === 'Backspace')) {
                e.preventDefault();
                handleDeleteDependency();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dependencyBeingHovered]);

    // --- 5. Render ---
    return (
        <div className="grid grid-cols-[350px_1fr] h-full overflow-hidden border rounded-xl shadow-lg bg-white">

            {/* === LEFT PANEL: HIERARCHY === */}
            <div className="flex flex-col border-r border-gray-200 h-full bg-white z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                {/* Header */}
                <div className="border-b border-gray-100 flex items-center justify-between px-1 bg-gray-50/50" style={{ height: 89 }}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        <Button
                            size="sm"
                            onClick={() => setIsAddingDependency(!isAddingDependency)}
                            className={cn(
                                "h-7 px-3 text-xs cursor-pointer font-medium shadow-sm transition-all animate-in fade-in zoom-in duration-300",
                                isAddingDependency
                                    ? "bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-200" // Cancel Style
                                    : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"       // Add Style
                            )}
                        >
                            {isAddingDependency ? (
                                <>
                                    <Link2Off className="w-3.5 h-3.5 mr-1.5" />
                                    Cancel add
                                </>
                            ) : (
                                <>
                                    <Link2 className="w-3.5 h-3.5 mr-1.5" />
                                    Add dependency
                                </>
                            )}
                        </Button>

                        {(selectedItem || hasUnsavedChanges) && (
                            <>
                                {(selectedItem || hasUnsavedChanges) && (
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedItem(null);
                                            setTimelineStructure({
                                                projectStartDate: originalTimelineStructure?.projectStartDate || toDayJs().format("YYYY-MM-DD"),
                                                items: [...(originalTimelineStructure?.items || [])],
                                                milestones: [...(originalTimelineStructure?.milestones || [])],
                                            });
                                        }}
                                        className="h-7 px-3 text-xs cursor-pointer font-medium bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 shadow-sm transition-all animate-in fade-in zoom-in duration-300"
                                    >
                                        <X className="w-3.5 h-3.5 mr-1.5" />
                                        Cancel
                                    </Button>
                                )}
                                {hasUnsavedChanges && (
                                    <>
                                        <Button
                                            size="sm"
                                            onClick={handleUpdateTimelineDates}
                                            className="h-7 px-3 text-xs cursor-pointer font-medium bg-indigo-500 hover:bg-indigo-700 text-white shadow-sm transition-all animate-in fade-in zoom-in duration-300"
                                            disabled={isUpdating}
                                        >
                                            {!isUpdating && <Save className="w-3.5 h-3.5 mr-1.5" />}
                                            {isUpdating && <Loader2 className="w-3.5 h-3.5 mr-1.5" />}
                                            {!isUpdating ? "Update" : "Updating..."}
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Scrollable List */}
                <div
                    ref={hierarchyScrollRef}
                    className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide" // Hide scrollbar on left, rely on right
                >
                    <Table>
                        <TableBody>
                            {visibleRows.map(({ item, depth }) => {
                                const hasChildren = item.children && item.children.length > 0;
                                const isExpanded = isItemExpanded(item);
                                const isHovered = hoveredRowId === item.id;

                                return (
                                    <TableRow
                                        key={item.id}
                                        className={cn(
                                            "h-12 border-b border-gray-50 transition-colors",
                                            isHovered ? "bg-blue-50/50" : "hover:bg-transparent"
                                        )}
                                        onMouseEnter={() => setHoveredRowId(item.id)}
                                        onMouseLeave={() => setHoveredRowId(null)}
                                    >
                                        <TableCell className="p-0 border-none">
                                            <div
                                                className="flex items-center h-full pr-4 cursor-pointer select-none"
                                                style={{ paddingLeft: `${(depth * 20) + 16}px` }}
                                                onClick={() => hasChildren && toggleExpand(item)}
                                            >
                                                {/* Collapse Icon */}
                                                <div className={cn(
                                                    "mr-2 p-0.5 rounded-md transition-colors",
                                                    hasChildren ? "text-gray-400 hover:bg-gray-200 hover:text-gray-700" : "opacity-0"
                                                )}>
                                                    {isExpanded ? <ChevronDown size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
                                                </div>

                                                {/* Text Label */}
                                                <span className={cn(
                                                    "text-sm truncate",
                                                    item.type === 'DELIVERABLE' ? "font-semibold text-gray-800" :
                                                        item.type === 'PHASE' ? "font-medium text-gray-700" : "text-gray-600 font-light"
                                                )}>
                                                    {item.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {/* Empty state filler if needed */}
                            {visibleRows.length === 0 && (
                                <TableRow>
                                    <TableCell className="text-center text-gray-400 py-8">No items found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* === RIGHT PANEL: TIMELINE === */}
            <div className="flex flex-col h-full overflow-hidden bg-white relative">
                {/* Scrollable Timeline Body (Both X and Y) */}
                <div
                    ref={timelineScrollRef}
                    className="flex-1 overflow-auto relative"
                >
                    {/* BACKDROP OVERLAY */}
                    {/* Covers the entire scrollable area when an item is selected */}
                    <div
                        className={cn(
                            "absolute inset-0 bg-black/40 z-10 transition-opacity duration-300 pointer-events-none",
                            selectedItem ? "opacity-100" : "opacity-0"
                        )}
                        style={{
                            // Ensure backdrop covers the full calculated width/height of content
                            width: `${Math.max(itemCoordinates.totalWidth, containerWidth)}px`,
                            height: `${itemCoordinates.totalHeight}px`,
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(null);
                        }}
                    />

                    {/* 2a. TODAY LINE (Single Instance) */}
                    {(() => {
                        const today = dayjs(); // Current Date
                        const startDate = dayjs(timelineStructure?.projectStartDate || toDayJs(undefined, 0).format("YYYY-MM-DD"));
                        const diffDays = today.diff(startDate, 'day');

                        // Check if today is within view
                        if (diffDays >= 0 && diffDays <= totalViewDays) {
                            const leftPixel = (diffDays / totalViewDays) * itemCoordinates.totalWidth;

                            return (
                                <div
                                    className="absolute top-0 z-40 flex flex-col items-center pointer-events-none"
                                    style={{
                                        left: `${leftPixel}px`,
                                        height: `${itemCoordinates.totalHeight + 2}px`,
                                        transform: 'translateX(-50%)'
                                    }}
                                >
                                    {/* Hitbox area for hover */}
                                    <div className="h-full w-4 flex flex-col items-center group pointer-events-auto">

                                        {/* Visible Blue Line */}
                                        <div className="h-full w-[2px] bg-blue-400 relative shadow-[0_0_8px_rgba(96,165,250,0.6)]">
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-400 rounded-full border-2 border-white shadow-sm" />
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-400 rounded-full border-2 border-white shadow-sm" />
                                        </div>

                                        {/* Tooltip */}
                                        <div className="absolute top-8 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                                            Today - {today.format('DD/MM/YY')}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    {/* 2b. MILESTONE LINES */}
                    {(timelineStructure?.milestones || []).map((milestone: TimelineMilestone) => {
                        const milestoneDate = dayjs(milestone.date);
                        const startDate = dayjs(timelineStructure?.projectStartDate || toDayJs(undefined, 0).format("YYYY-MM-DD"));
                        const diffDays = milestoneDate.diff(startDate, 'day');

                        // Only render if visible
                        if (diffDays >= 0 && diffDays <= totalViewDays) {
                            const leftPixel = (diffDays / totalViewDays) * itemCoordinates.totalWidth;

                            // Choose color (e.g., Orange for milestones)
                            const colorClass = "bg-orange-500";

                            return (
                                <div
                                    key={milestone.id}
                                    className="absolute top-0 z-30 flex flex-col items-center pointer-events-none"
                                    style={{
                                        left: `${leftPixel}px`,
                                        height: `${itemCoordinates.totalHeight + 2}px`,
                                        transform: 'translateX(-50%)'
                                    }}
                                >
                                    {/* Hitbox */}
                                    <div className="h-full w-4 flex flex-col items-center group pointer-events-auto">

                                        {/* Visible Line */}
                                        <div className={`h-full w-[2px] ${colorClass} relative`}>
                                            <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 ${colorClass} rounded-full border-2 border-white shadow-sm`} />
                                            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 ${colorClass} rounded-full border-2 border-white shadow-sm`} />
                                        </div>

                                        {/* Tooltip */}
                                        <div className="absolute top-8 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                                            {milestone.name} - {milestoneDate.format('DD/MM/YY')}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                    <table className="w-full caption-bottom text-sm" style={{ minWidth: '100%' }}>
                        {/* SVG LAYER (Z-Curve Connections) */}
                        <svg
                            className={cn("absolute top-0 left-0 pointer-events-none z-10", { "z-98": isAddingDependency })}
                            style={{
                                width: `${itemCoordinates.totalWidth}px`,
                                height: `${itemCoordinates.totalHeight}px`,
                            }}
                        >
                            {dependencies.map(dep => {
                                let source = itemCoordinates.coords.get(getId(dep.type, dep.fromId));
                                let target = itemCoordinates.coords.get(getId(dep.type, dep.toId));

                                if (!source || !target) return null;

                                const isBackwardsOrTouching = source.xEnd >= target.xStart;

                                const lineColor = isBackwardsOrTouching ? "#33BFFF" : "#E62E7B"; // Blue : Red
                                const hoverColorClass = isBackwardsOrTouching ? "group-hover:stroke-blue-700" : "group-hover:stroke-red-700";
                                const isRelevant = (relatedIds.has(getId(dep.type, dep.fromId)) && relatedIds.has(getId(dep.type, dep.toId)));

                                let p1 = { x: source.xEnd, y: source.y };   // Source Tail
                                let p2 = { x: target.xStart, y: target.y }; // Target Head

                                // if (p1.y > p2.y) {
                                //     [p1, p2] = [p2, p1];
                                // }

                                // Connect: Source Right (Tail) -> Target Left (Head)
                                const pathData = getOrthogonalPath(p1, p2);
                                const opacity = isRelevant ? 1 : 0;
                                const midX = p1.x + (p2.x - p1.x) / 2;
                                const midY = p1.y + (p2.y - p1.y) / 2;
                                return (
                                    <g
                                        className="group"
                                        style={{
                                            opacity: opacity,
                                            transition: 'opacity 0.3s ease-in-out'
                                        }}
                                        onMouseEnter={() => setDependencyBeingHovered(dep)}
                                        onMouseLeave={() => setDependencyBeingHovered(null)}
                                    >
                                        {/* Thick invisible stroke for easier hovering */}
                                        <path d={pathData} stroke="transparent" strokeWidth="10" fill="none" />

                                        {/* The visible line */}
                                        <path
                                            d={pathData}
                                            stroke={lineColor}
                                            strokeWidth="3"
                                            fill="none"
                                            className={`transition-colors cursor-pointer pointer-events-auto duration-200 ${isRelevant ? hoverColorClass : ''}`}
                                        />

                                        {dependencyBeingHovered && (
                                            <g
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteDependency();
                                                }}
                                                className="cursor-pointer pointer-events-auto"
                                                transform={`translate(${midX}, ${midY})`}
                                                style={{ transform: `translate(${midX}px, ${midY}px)` }}
                                            >
                                                {/* White background circle */}
                                                <circle r="10" fill="white" stroke="#ef4444" strokeWidth="1" />
                                                {/* X Icon (SVG Lines) */}
                                                <line x1="-4" y1="-4" x2="4" y2="4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                                                <line x1="4" y1="-4" x2="-4" y2="4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                                            </g>
                                        )}
                                    </g>
                                );
                            })}
                            {dependencyDragLine && (
                                <line
                                    x1={dependencyDragLine.startX}
                                    y1={dependencyDragLine.startY}
                                    x2={dependencyDragLine.currentX}
                                    y2={dependencyDragLine.currentY}
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                    strokeDasharray="5,5"
                                    className="transition-all duration-75 ease-linear"
                                />
                            )}
                        </svg>
                        <TableHeader>

                            <TableRow className="h-8 border-b border-gray-100">
                                {months.map((month: any, i: number) => (
                                    <TableHead
                                        key={i}
                                        colSpan={month.colSpan}
                                        className="text-center text-xs font-bold text-gray-700 bg-gray-100/50 border-l border-gray-200"
                                    >
                                        {month.label}
                                    </TableHead>
                                ))}
                            </TableRow>

                            <TableRow className="h-12 border-b border-gray-200">
                                {weeks.map((week: string, i: number) => (
                                    <TableHead key={i} className="min-w-[150px] border-l border-gray-100 text-center text-xs font-semibold text-gray-700 bg-gray-50/80">
                                        {week}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visibleRows.map(({ item }) => {
                                const barPosition = calculateBarPosition(item.startDate, item.endDate, new Date(timelineStructure?.projectStartDate || toDayJs().format("YYYY-MM-DD")), totalViewDays);
                                const isHovered = hoveredRowId === item.id;
                                const isRelated = !selectedItem || relatedIds.has(getId(item.type, item.id));
                                const parentDates = getParentStartDateEndDate(item);

                                return (
                                    <TableRow
                                        key={item.id}
                                        className={
                                            cn(
                                                "h-12 border-b border-gray-50 transition-colors relative group",
                                            )}
                                        onMouseEnter={() => setHoveredRowId(item.id)}
                                        onMouseLeave={() => setHoveredRowId(null)}
                                    >
                                        {/* Render Grid Cells (Background) */}
                                        {weeks.map((_: string, i: number) => (
                                            <TableCell key={i} className="p-0 border-l border-gray-100 min-w-[150px] relative pointer-events-none" />
                                        ))}

                                        {/* Render Gantt Bar (Absolute Overlay) */}
                                        <div className="absolute inset-0 w-full h-full pointer-events-none">
                                            <div className="relative w-full h-full pointer-events-auto"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedItem(item);
                                                }}
                                            >
                                                <GanttBar
                                                    item={item}
                                                    originalStyle={barPosition}
                                                    projectStartDate={new Date(timelineStructure?.projectStartDate || toDayJs().format("YYY-MM-DD"))}
                                                    isHovered={isHovered}
                                                    isRelated={isRelated}
                                                    totalViewDays={totalViewDays}
                                                    onDateUpdate={handleUpdateGnattBarDate}
                                                    parentStartDate={parentDates.parentStartDate}
                                                    parentEndDate={parentDates.parentEndDate}
                                                    handleMoveGnattBar={handleMoveGnattBar}
                                                    isAddingDependency={isAddingDependency}
                                                    hasUnsavedChanges={hasUnsavedChanges}
                                                    handleMouseDownWhenAddingDependency={handleMouseDownWhenAddingDependency}
                                                    handleDraggingLineDropWhenAddingDependency={handleDraggingLineDropWhenAddingDependency}
                                                />
                                            </div>
                                        </div>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </table>
                </div>
            </div>
            {alertMessage && (
                <AlertModal
                    alertMessage={alertMessage}
                    onClose={() => setAlertMessage(null)}
                />
            )}
        </div>
    );
}