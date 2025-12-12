"use client";

import { cn } from '@/lib/utils';
import { ProjectTimelineType } from '@/model/project-management';
import { isEqual } from 'lodash';
import { ChevronDown } from 'lucide-react';

// Helper to parse "YYYY-MM-DD" (since your API returns this format)
const parseDate = (dateStr: string) => new Date(dateStr);

const getDayDiff = (start: string, end: string) => {
    const date1 = parseDate(start);
    const date2 = parseDate(end);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

interface ProjectTimelineProps {
    data: ProjectTimelineType | null;
}

export function ProjectTimeline({ data }: ProjectTimelineProps) {

    if (!data) {
        return <div className="p-6 text-center text-gray-500">Loading timeline...</div>;
    }

    const { projectStartDate, currentDate, milestones } = data;

    // 1. Sort milestones chronologically
    const sortedMilestones = [...milestones].sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());

    // 2. Determine the full range (Start -> Last Milestone)
    const lastDate = sortedMilestones.length > 0
        ? sortedMilestones[sortedMilestones.length - 1].date
        : currentDate;

    // Ensure totalDays covers at least up to the current date or last milestone
    const endDate = parseDate(currentDate) > parseDate(lastDate) ? currentDate : lastDate;
    const totalDays = getDayDiff(projectStartDate, endDate) || 1; // Avoid division by zero

    // 3. Calculate Segments
    // --- Segment 1: Start to Current ---
    const daysToCurrent = getDayDiff(projectStartDate, currentDate);
    const currentPercent = (daysToCurrent / totalDays) * 100;

    // --- Segment 2 & beyond: Milestones after current date ---
    const futureMilestones = sortedMilestones.filter(m => parseDate(m.date) > parseDate(currentDate));

    let segments = [];
    // Add initial blue progress bar
    segments.push({
        widthPercent: currentPercent > 100 ? 100 : currentPercent,
        label: daysToCurrent.toString(),
        color: 'bg-[#7086FD]',
        textColor: 'text-white',
    });

    // Add remaining gray segments
    let previousDate = currentDate;
    let cumulativePercent = currentPercent;

    // If current date is past all milestones, the whole bar is blue.
    // If there are future milestones, we calculate the gray intervals.
    futureMilestones.forEach((m) => {
        const days = getDayDiff(previousDate, m.date);
        if (days > 0) {
            const percent = (days / totalDays) * 100;

            // Normalize ensuring we don't exceed 100% visual width
            const renderPercent = (cumulativePercent + percent > 100) ? (100 - cumulativePercent) : percent;

            segments.push({
                widthPercent: renderPercent,
                label: days.toString(),
                color: 'bg-gray-300',
                textColor: 'text-gray-600',
            });

            cumulativePercent += renderPercent;
            previousDate = m.date;
        }
    });


    // 4. Calculate Marker Positions & Collision Detection
    // We need to track the visual position (percent) of all items (Current Day + Milestones)
    // to determine overlap.

    const allMarkers = [
        { type: 'current', date: currentDate, label: currentDate, percent: currentPercent },
        ...sortedMilestones.map(m => ({
            type: 'milestone',
            date: m.date,
            label: m.date, // Display date
            percent: (getDayDiff(projectStartDate, m.date) / totalDays) * 100
        }))
    ].sort((a, b) => a.percent - b.percent);

    // Assign vertical positions (Top/Bottom) based on proximity (< 10 days approx 10% width depending on scale)
    // Simple logic: flip position if too close to the previous one.

    const markersWithPosition = allMarkers.reduce((acc: any[], marker, index) => {
        let isTop = true; // Default to top

        if (index > 0) {
            const prevMarker = acc[index - 1];
            const diffDays = getDayDiff(prevMarker.date, marker.date);

            // Collision Threshold: 10 days
            if (diffDays < 10) {
                // Flip position relative to the previous one
                isTop = !prevMarker.isTop;
            } else {
                // Reset to default preference (Top) if far enough apart
                isTop = true;
            }
        }

        // Force 'Current Date' to always be Top if possible, or handle specific preference?
        // The requirement says: "their labels should be 1 above bar (top: -40px) and 1 below bar (marginTop: 35px)"

        acc.push({ ...marker, isTop });
        return acc;
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-7">
            <h3 className="text-lg font-semibold text-gray-800">Project Timeline</h3>
            <p className="text-sm text-gray-500 mb-6">See your project timeline at a glance</p>

            <div className="relative w-full h-12">

                {/* --- Timeline Bar Container --- */}
                <div className="relative w-full h-7 flex items-center mt-15 bg-gray-100 rounded-full overflow-visible">
                    {segments.map((segment, index) => (
                        <div
                            key={index}
                            className={cn(
                                "h-full flex items-center justify-center text-[0.8rem] font-bold",
                                segment.color,
                                segment.textColor,
                            )}
                            style={{
                                width: `${segment.widthPercent}%`,
                                minWidth: segment.widthPercent > 2 ? '20px' : '15px',
                            }}
                        >
                            <span className="p-1">{segment.label}</span>
                        </div>
                    ))}

                    {/* Milestone Marker Flags */}
                    {markersWithPosition.map((marker, index) => {
                        return (
                            <div
                                key={`marker-flag-${index}`}
                                className="absolute transform -translate-x-1/2 flex flex-col items-center z-20"
                                style={{
                                    left: `${marker.percent}%`,
                                }}
                            >
                                {/* Custom Flag Icon */}
                                {!isEqual(marker.type, 'current') && (
                                    <div className="relative flex items-end h-12 -mt-5">
                                        <div className="w-px h-full bg-gray-600"></div> {/* Stick */}
                                        <div className="absolute top-0 left-0 w-4 h-3 bg-gray-600"></div> {/* Rect */}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* --- Render All Markers (Current & Milestones) --- */}
                    {markersWithPosition.map((marker, index) => {
                        const isCurrent = marker.type === 'current';
                        const isTop = marker.isTop;

                        return (
                            <div
                                key={`marker-${index}`}
                                className="absolute transform -translate-x-1/2 flex flex-col items-center z-20"
                                style={{
                                    left: `${marker.percent}%`,
                                    // 🛠️ Dynamic Vertical Positioning Logic
                                    // If Top: anchor to top:-50px (above bar)
                                    // If Bottom: anchor to top: 0 with marginTop: 35px (below bar)
                                    top: isTop ? "-50px" : "0px",
                                    marginTop: isTop ? "0px" : "35px",
                                }}
                            >
                                {/* Icon Handling: 
                                    - If Top: Icon is at bottom of text wrapper
                                    - If Bottom: Icon is at top of text wrapper
                                */}

                                {isCurrent ? (
                                    // Current Date Marker (Chevron)
                                    <>
                                        {isTop ? (
                                            <>
                                                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap mb-0.1">{marker.label}</span>
                                                <ChevronDown size={16} className="text-gray-700" />
                                            </>
                                        ) : (
                                            <>
                                                {/* For bottom current marker, we might want a ChevronUp or just rotate the Down */}
                                                <ChevronDown size={16} className="text-gray-700 rotate-180 mb-1" />
                                                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{marker.label}</span>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    // Milestone Marker (Custom Flag)
                                    // Re-using the custom stick+triangle CSS flag
                                    <div className="relative flex flex-col items-center">
                                        {isTop ? (
                                            // Top Flag: Text above, Stick goes down to bar
                                            <>
                                                <span className="text-xs text-gray-600 whitespace-nowrap mb-1">{marker.label}</span>
                                            </>
                                        ) : (
                                            // Bottom Flag: Stick goes up to bar, Text below
                                            <>
                                                <span className="text-xs text-gray-600 whitespace-nowrap mt-1">{marker.label}</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}