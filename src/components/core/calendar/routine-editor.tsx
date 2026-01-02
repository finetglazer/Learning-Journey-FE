"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MonthPlanningBigTask, MonthPlanningEvent, UnscheduledTask } from "@/model/task";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export interface RoutineEditorProps {
    // editingItem should always have "string" type since it is a routine
    editingItem: string;
    setOpenRoutineEditor?: Dispatch<SetStateAction<boolean>>;
    setEditingItem?: Dispatch<SetStateAction<MonthPlanningEvent | MonthPlanningBigTask | UnscheduledTask | string | null>>;
    updateRoutineList?: (oldName?: string, newName?: string) => void;
    onClose?: () => void;
};

export const RoutineEditor = ({
    editingItem,
    setOpenRoutineEditor,
    updateRoutineList,
    onClose,
}: RoutineEditorProps) => {

    const [routineName, setRoutineName] = useState<string>(editingItem as string);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setRoutineName(editingItem as string);
    }, [editingItem]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                onClose?.();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div ref={wrapperRef} className={cn("z-[999] absolute top-[50%] h-auto grid grid-cols-[1fr,auto,auto] cursor-default items-center gap-2 rounded-lg border-3 border-[#68DE79] bg-stone-50 p-4 w-full")}>
            <input
                type="text"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                className="font-bold text-slate-700 text-lg text-left truncate bg-white border border-gray-300 rounded px-2 py-1"
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        updateRoutineList?.(editingItem, routineName);
                    } else if (e.key === 'Escape') {
                        onClose?.();
                    }
                }}
                onClick={(e) => e.stopPropagation()}
            />
            <div className="flex">
                <Button onClick={() => {
                    updateRoutineList?.(editingItem, routineName);
                }} className="bg-green-300 hover:bg-green-400 text-green-800 rounded-full px-5 text-sm font-semibold cursor-pointer" aria-label="Save">
                    Save
                </Button>
                {editingItem && (
                    <button onClick={() => updateRoutineList?.(editingItem, "")} className="cursor-pointer text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-100" aria-label="Delete">
                        <Trash2 size={20} />
                    </button>
                )}
                <button className="cursor-pointer ml-3 text-cyan-950" onClick={() => {
                    onClose?.();
                }}>Cancel</button>
            </div>
        </div>
    );
}
