"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateBarPosition, cn, getDaysDiff, getId, getOrthogonalPath, toDayJs } from "@/lib/utils";
import { ProjectDependency, ProjectTimelineStructure, TimelineItem } from '@/model/project-management';
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { ChevronDown, ChevronRight, Save, Undo2 } from "lucide-react";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { TeamProjectContext, TeamProjectContextProps } from '../../team-project-context';
import { isEqual } from "lodash";
import { Button } from "@/components/ui/button";
import GanttBar from "./components/gnatt-bar";
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

    const {
        timelineData: originalTimelineStructure,
        getItemDependencies,
        dependencies,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const hasUnsavedChanges = useMemo(() => {
        if (!timelineStructure || !originalTimelineStructure) {
            return false;
        }

        return !isEqual(timelineStructure, originalTimelineStructure);
    }, [timelineStructure, originalTimelineStructure]);

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
                    if (item.id === id) {
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
        const HEADER_HEIGHT = 48; // Height of the date header

        // Calculate Total Width in Pixels (Crucial for SVG)
        // We assume 150px per week column as defined in your TableHead
        const TOTAL_WIDTH = weeks.length * 150;

        visibleRows.forEach(({ item }) => {
            // Y Coordinate: Top of row + Half Height + Header Offset
            const centerY = currentY + (ROW_HEIGHT / 2) + HEADER_HEIGHT;

            // X Coordinates: Calculate percentage, then convert to pixels based on TOTAL_WIDTH
            // Reuse your existing logic for math
            const start = new Date(item.startDate);
            const end = new Date(item.endDate);

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
    }, [visibleRows, originalTimelineStructure?.projectStartDate, weeks]);

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
        setTimelineStructure(originalTimelineStructure);
    }, [originalTimelineStructure]);

    useEffect(() => {
        if (selectedItem) {
            getItemDependencies(selectedItem);
        }
    }, [selectedItem]);

    // --- 5. Render ---
    return (
        <div className="grid grid-cols-[350px_1fr] h-full overflow-hidden border rounded-xl shadow-lg bg-white">

            {/* === LEFT PANEL: HIERARCHY === */}
            <div className="flex flex-col border-r border-gray-200 h-full bg-white z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                {/* Header */}
                <div className="border-b border-gray-100 flex items-center justify-between px-4 bg-gray-50/50" style={{ height: 89 }}>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Work Item
                    </span>

                    {hasUnsavedChanges && (
                        <div className="flex items-center gap-3">
                            <Button
                                size="sm"
                                onClick={() => {
                                    setTimelineStructure(originalTimelineStructure);
                                }}
                                className="h-7 px-3 text-xs cursor-pointer font-medium bg-red-500 hover:bg-red-600 text-white shadow-sm transition-all animate-in fade-in zoom-in duration-300"
                            >
                                <Undo2 className="w-3.5 h-3.5 mr-1.5" />
                                Discard
                            </Button>
                            <Button
                                size="sm"
                                // onClick={onSave}
                                className="h-7 px-3 text-xs cursor-pointer font-medium bg-indigo-500 hover:bg-indigo-700 text-white shadow-sm transition-all animate-in fade-in zoom-in duration-300"
                            >
                                <Save className="w-3.5 h-3.5 mr-1.5" />
                                Update
                            </Button>
                        </div>
                    )}
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

                {/* Header (Dates) */}
                {/* We create a separate scroll container for the header to sync X-axis later if needed, 
                    but usually, the main body handles X-scroll. Here we stick header to top. */}
                <div className="h-12 border-b border-gray-100 flex bg-gray-50/50 absolute top-0 left-0 right-0 z-30 pointer-events-none">
                    {/* Note: In a real app, this header needs to scroll horizontally with the body. 
                        For simplicity in this grid layout, we often render it inside the scroll container 
                        or use a sync-scroll hook for X-axis too. 
                        Here, I will render it inside the scroll container for automatic X alignment. */}
                </div>

                {/* Scrollable Timeline Body (Both X and Y) */}
                <div
                    ref={timelineScrollRef}
                    className="flex-1 overflow-auto relative"
                >
                    {/* SVG LAYER (Z-Curve Connections) */}
                    <svg
                        className="absolute top-0 left-0 pointer-events-none z-0"
                        style={{
                            width: `${itemCoordinates.totalWidth}px`,
                            height: `${itemCoordinates.totalHeight}px`
                        }}
                    >
                        <defs>
                            {/* Arrowhead Marker */}
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                            </marker>
                        </defs>

                        {dependencies.map(dep => {
                            const source = itemCoordinates.coords.get(getId(dep.type, dep.fromId));
                            const target = itemCoordinates.coords.get(getId(dep.type, dep.toId));

                            // Only draw if both items are currently visible (expanded)
                            if (!source || !target) return null;

                            // Connect: Source Right (Tail) -> Target Left (Head)
                            const pathData = getOrthogonalPath(
                                { x: source.xEnd, y: source.y },
                                { x: target.xStart, y: target.y }
                            );

                            return (
                                <g className="group">
                                    {/* Thick invisible stroke for easier hovering */}
                                    <path d={pathData} stroke="transparent" strokeWidth="10" fill="none" />
                                    {/* The visible line */}
                                    <path
                                        d={pathData}
                                        stroke="#cbd5e1" // slate-300
                                        strokeWidth="2"
                                        fill="none"
                                        markerEnd="url(#arrowhead)"
                                        className="transition-colors duration-200 group-hover:stroke-blue-500"
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    <Table style={{ minWidth: '100%' }}> {/* Ensure table can expand horizontally */}
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

                                return (
                                    <TableRow
                                        key={item.id}
                                        className={cn(
                                            "h-12 border-b border-gray-50 transition-colors relative group",
                                            isHovered ? "bg-blue-50/50" : "hover:bg-transparent"
                                        )}
                                        onMouseEnter={() => setHoveredRowId(item.id)}
                                        onMouseLeave={() => setHoveredRowId(null)}
                                    >
                                        {/* Render Grid Cells (Background) */}
                                        {weeks.map((_: string, i: number) => (
                                            <TableCell key={i} className="p-0 border-l border-gray-100 min-w-[150px] relative pointer-events-none" />
                                        ))}

                                        {/* Render Gantt Bar (Absolute Overlay) */}
                                        {/* We place this absolute relative to the row */}
                                        <div className="absolute inset-0 w-full h-full pointer-events-none">
                                            {/* Container for the bar allows us to use % width relative to the whole timeline row width 
                                                Note: For % width to work based on viewStartDate/EndDate, the row width must represent the total view time. 
                                                If the table is wider than the view (horizontal scroll), the math needs to account for pixel width.
                                                
                                                *Simplification*: We assume the TableRow width spans the visual area. 
                                                For a robust chart, you usually use a specific pixel width per day (e.g., 40px) 
                                                and calculate Left/Width in pixels, not %.
                                            */}

                                            {/* For this demo, we assume the Table width tracks the full view duration. */}
                                            <div className="relative w-full h-full pointer-events-auto" onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedItem(item);
                                            }}>
                                                <GanttBar
                                                    item={item}
                                                    originalStyle={barPosition}
                                                    projectStartDate={new Date(timelineStructure?.projectStartDate || toDayJs().format("YYY-MM-DD"))}
                                                    isHovered={isHovered}
                                                    totalViewDays={totalViewDays}
                                                    onDateUpdate={handleUpdateGnattBarDate}
                                                />
                                            </div>
                                        </div>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}