"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { calculateBarPosition, cn, dateToDayJs, getId, toDayJs } from "@/lib/utils";
import { ProjectTimelineStructure, TimelineItem } from "@/model/project-management";
import { isEqual, isNil } from "lodash";
import { Dispatch, SetStateAction, useState } from "react";
import GanttBar from "./gantt-bar";

interface TimelineRowProps {
    item: TimelineItem;
    weeks: string[];
    timelineStructure: ProjectTimelineStructure | null;
    totalViewDays: number;
    timelineContainerWidth: number; // itemCoordinates.totalWidth
    canEdit: boolean;
    isAddingDependency: boolean;
    unsavedTimelineItem: TimelineItem | null;
    parentMap: Record<string, string | undefined>;
    selectedItem: TimelineItem | null;
    isRelated: boolean;
    hoveredRowId: string | null;
    setHoveredRowId: (id: string | null) => void;
    setSelectedItem: (item: TimelineItem | null) => void;
    onCreateTimelineItem: (ghostBarData: { itemId: string | number; startDate: string; endDate: string }) => void;
    onDateUpdate: (id: number | string, newStart: string, newEnd: string, isUpdate?: boolean) => void;
    handleMoveGnattBar: (id: string | number, daysShift: number) => void;
    setUnsavedTimelineItem: Dispatch<SetStateAction<TimelineItem | null>>;
    handleMouseDownWhenAddingDependency: (e: any, item: TimelineItem) => void;
    handleDraggingLineDropWhenAddingDependency: (item: TimelineItem) => void;
}

export const TimelineRow = ({
    item,
    weeks,
    timelineStructure,
    totalViewDays,
    timelineContainerWidth,
    canEdit,
    isAddingDependency,
    unsavedTimelineItem,
    parentMap,
    selectedItem,
    isRelated,
    hoveredRowId,
    setHoveredRowId,
    setSelectedItem,
    onCreateTimelineItem,
    onDateUpdate,
    handleMoveGnattBar,
    setUnsavedTimelineItem,
    handleMouseDownWhenAddingDependency,
    handleDraggingLineDropWhenAddingDependency,
}: TimelineRowProps) => {
    const [ghostBar, setGhostBar] = useState<{
        itemId: string | number;
        startDate: string;
        endDate: string;
        x: number;
    } | null>(null);

    const hasTimeline = !isNil(item.startDate) && !isNil(item.endDate);
    const isGhosting = !hasTimeline && isEqual(ghostBar?.itemId, getId(item.type, item.id));
    const isHovered = hoveredRowId === getId(item.type, item.id);

    // Calculate bar position
    // Note: We need a consistent viewStartDate. In the original code, it was:
    // toDayJs(undefined, 0).subtract(6, 'month').format("YYYY-MM-DD")
    const viewStartDateStr = toDayJs(undefined, 0).subtract(6, 'month').format("YYYY-MM-DD");
    const viewStartDate = new Date(viewStartDateStr);

    const barPosition = calculateBarPosition(
        item.startDate,
        item.endDate,
        new Date(timelineStructure?.projectStartDate || viewStartDateStr),
        totalViewDays
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLTableRowElement>) => {
        if (hasTimeline || !canEdit) return;

        const getDateFromX = (x: number, totalWidth: number, totalViewDays: number, startDate: Date) => {
            if (totalWidth === 0) return dateToDayJs(startDate, 0);
            const ratio = x / totalWidth;
            const daysToAdd = Math.floor(ratio * totalViewDays);
            return dateToDayJs(startDate, 0).add(daysToAdd, 'day');
        };

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;

        // Ensure we use the correct container width for calculation
        // If the timeline is smaller than container, we might need adjustments, 
        // but typically totalWidth from itemCoordinates handles the scrollable area.
        // In the original, it used `itemCoordinates.totalWidth` (passed here as timelineContainerWidth).

        const centerDate = getDateFromX(x, timelineContainerWidth, totalViewDays, viewStartDate);

        setGhostBar({
            itemId: getId(item.type, item.id),
            startDate: centerDate.subtract(1, 'week').format("YYYY-MM-DD"),
            endDate: centerDate.add(1, 'week').format("YYYY-MM-DD"),
            x: x
        });
    };

    return (
        <TableRow
            className={cn(
                "h-12 border-b border-gray-50 transition-colors relative group",
                // "hover:bg-gray-50/50" // Optional: Add row hover effect if needed, though grid cells cover most of it
            )}
            onMouseEnter={() => setHoveredRowId(getId(item.type, item.id))}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
                setHoveredRowId(null);
                setGhostBar(null);
            }}
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
                        if (!canEdit) return;

                        if (isGhosting && ghostBar) {
                            onCreateTimelineItem({
                                itemId: ghostBar.itemId,
                                startDate: ghostBar.startDate,
                                endDate: ghostBar.endDate
                            });
                            return;
                        }
                        setSelectedItem(item);
                    }}
                >
                    <GanttBar
                        item={item}
                        ghostBar={ghostBar}
                        isGhosting={isGhosting}
                        canEdit={canEdit}
                        originalStyle={barPosition}
                        viewStartDate={viewStartDate}
                        isHovered={isHovered}
                        timelineStructure={timelineStructure}
                        isRelated={isRelated}
                        totalViewDays={totalViewDays}
                        onDateUpdate={onDateUpdate}
                        parentStartDate={toDayJs(undefined, 0).subtract(6, 'month').format("YYYY-MM-DD")}
                        parentEndDate={toDayJs(undefined, 0).add(6, 'month').format("YYYY-MM-DD")}
                        handleMoveGnattBar={handleMoveGnattBar}
                        isAddingDependency={isAddingDependency}
                        hasUnsavedChanges={!!unsavedTimelineItem}
                        setUnsavedTimelineItem={setUnsavedTimelineItem}
                        parentMap={parentMap}
                        handleMouseDownWhenAddingDependency={handleMouseDownWhenAddingDependency}
                        handleDraggingLineDropWhenAddingDependency={handleDraggingLineDropWhenAddingDependency}
                    />
                </div>
            </div>
        </TableRow>
    );
};