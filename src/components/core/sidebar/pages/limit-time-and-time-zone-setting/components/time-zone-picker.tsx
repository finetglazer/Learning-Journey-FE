"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { timezoneGroups } from "@/const/consts";
import { cn, findTimezone } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface TimeZone {
    label: string;
    value: string;
    utc: string;
}

export interface TimezonePickerProps {
    initTimeZone: TimeZone;
    onChange: Dispatch<SetStateAction<TimeZone>>;
};

export const TimezonePicker = ({ initTimeZone, onChange }: TimezonePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState(findTimezone(initTimeZone.utc));

    useEffect(() => {
        setSelectedZone(findTimezone(initTimeZone.utc));
    }, [initTimeZone]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    className={cn(
                        "flex items-center justify-between w-full px-3 py-2 text-sm",
                        "bg-white border border-gray-300 rounded-md shadow-sm",
                        "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    )}
                >
                    <span className="text-gray-800">{selectedZone.label}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                </Button>
            </PopoverTrigger>
                <PopoverContent
                    className="w-[450px] bg-white shadow-lg rounded-md border border-gray-200 z-50 p-2"
                    sideOffset={5}
                    align="start"
                >
                    <div className="max-h-60 overflow-y-auto">
                        {timezoneGroups.map((group: {group: string, zones: TimeZone[]}) => (
                            <div key={group.group} className="mt-2">
                                <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase">
                                    {group.group}
                                </div>
                                {group.zones.map((zone) => (
                                    <div
                                        key={zone.label}
                                        onClick={() => {
                                            onChange(zone);
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2 text-sm cursor-pointer rounded",
                                            "hover:bg-blue-500 hover:text-white",
                                            selectedZone.utc === zone.utc && "bg-blue-500 text-white"
                                        )}
                                    >
                                        <span>{zone.label}</span>
                                        {selectedZone.utc === zone.utc && <Check size={16} />}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </PopoverContent>
        </Popover>
    );
};