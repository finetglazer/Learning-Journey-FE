"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";

interface HorizontalScrollbarProps {
    scrollRef: React.RefObject<HTMLDivElement | null>;
    className?: string;
}

export function HorizontalScrollbar({ scrollRef, className }: HorizontalScrollbarProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [thumbWidth, setThumbWidth] = useState(20);
    const [thumbLeft, setThumbLeft] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startScrollLeft, setStartScrollLeft] = useState(0);

    // 1. Sync Scrollbar with Content Scroll
    const handleContentScroll = () => {
        if (!scrollRef?.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        // Calculate thumb position ratio
        const scrollRatio = scrollLeft / (scrollWidth - clientWidth);
        // Calculate thumb width ratio (viewport / total content)
        const widthRatio = clientWidth / scrollWidth;

        // Convert to percentage for CSS
        const newThumbWidth = Math.min(100, Math.max(10, widthRatio * 100)); // Min 10% width

        // The track space available for movement is (100% - thumbWidth)
        const availableSpace = 100 - newThumbWidth;
        const newThumbLeft = scrollRatio * availableSpace;

        setThumbWidth(newThumbWidth);
        setThumbLeft(newThumbLeft);
    };

    // 2. Attach Listener to Content
    useEffect(() => {
        const content = scrollRef?.current;
        if (content) {
            content.addEventListener('scroll', handleContentScroll);
            // Initial calculation
            handleContentScroll();
            // Recalculate on resize
            window.addEventListener('resize', handleContentScroll);
        }
        return () => {
            if (content) content.removeEventListener('scroll', handleContentScroll);
            window.removeEventListener('resize', handleContentScroll);
        };
    }, [scrollRef]);

    // 3. Handle Dragging the Thumb
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        setStartX(e.clientX);
        if (scrollRef?.current) {
            setStartScrollLeft(scrollRef.current.scrollLeft);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !scrollRef?.current || !trackRef.current) return;

            const deltaX = e.clientX - startX;
            const trackWidth = trackRef.current.clientWidth;
            const content = scrollRef.current;

            // Calculate the movement ratio relative to the track
            // But we need to account for the thumb width. 
            // Movement of 1px in track = X px in content.

            // Total draggable distance in pixels
            const maxThumbTravel = trackWidth * (1 - thumbWidth / 100);
            // Total scrollable distance in pixels
            const maxScroll = content.scrollWidth - content.clientWidth;

            if (maxThumbTravel <= 0) return;

            const scrollRatio = deltaX / maxThumbTravel;
            const scrollDelta = scrollRatio * maxScroll;

            content.scrollLeft = startStartScrollLeft + scrollDelta;
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = 'none'; // Prevent text selection
        } else {
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
        };
    }, [isDragging, startX, thumbWidth]);

    // Used for calculation in useEffect, need to store it in ref or state without triggering re-render loop
    // Actually, storing startScrollLeft in state is fine since it only updates on MouseDown.
    // Fixed typo in dependency logic above: using state directly.
    const startStartScrollLeft = startScrollLeft;

    // Hide scrollbar if content fits perfectly (width 100%)
    if (thumbWidth >= 100) return null;

    return (
        <div
            className={cn(
                "h-4 w-[30%] flex items-center justify-center py-1 select-none",
                className
            )}
        >
            {/* Track */}
            <div
                ref={trackRef}
                className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden cursor-pointer"
                onClick={(e) => {
                    // Optional: Click track to jump
                    if (!trackRef.current || !scrollRef?.current) return;
                    const rect = trackRef.current.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const ratio = clickX / rect.width;
                    const content = scrollRef.current;
                    content.scrollLeft = ratio * (content.scrollWidth - content.clientWidth);
                }}
            >
                {/* Thumb */}
                <div
                    className={cn(
                        "absolute h-full rounded-full bg-gray-400 hover:bg-gray-500 transition-colors duration-150 cursor-grab active:cursor-grabbing",
                        isDragging && "bg-gray-500"
                    )}
                    style={{
                        width: `${thumbWidth}%`,
                        left: `${thumbLeft}%`
                    }}
                    onMouseDown={handleMouseDown}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
}