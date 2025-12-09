"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, dateToIsoString, isoStringToDate, isoToHHMM } from "@/lib/utils";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { isSameDay } from "date-fns";
import { Dispatch, SetStateAction } from "react";
import { Model } from "react-3layer-common";

export interface DateTimePickerProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    model: Model;
    updateModel: (fieldName: string, value: any) => void;
    fieldName: string;
    taskType?: string;
    wrapperClassName?: string;
    type?: 'date-only' | 'date-time' | 'time-only';
    enabledDate?: Date;
};

export const DateTimePicker = (props: DateTimePickerProps) => {
    const {
        isOpen,
        setIsOpen,
        model,
        updateModel,
        fieldName,
        taskType,
        wrapperClassName,
        type, // This will now be used for the new logic
        enabledDate,
    } = props;

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {

            // If a date is selected, we should preserve the existing time
            // unless no time is set yet.
            const existingDate = model?.[fieldName] ? isoStringToDate(model[fieldName]) : null;
            const newDate = new Date(selectedDate);

            if (existingDate) {
                // Apply existing time to the new date
                newDate.setHours(existingDate.getHours());
                newDate.setMinutes(existingDate.getMinutes());
                newDate.setSeconds(existingDate.getSeconds());
            }

            updateModel(fieldName, dateToIsoString(newDate));

            // Close popover if only selecting a date
            if (type === 'date-only') {
                setIsOpen(false);
            }
        }
    };

    const handleTimeChange = (
        type: "hour" | "minute" | "ampm",
        value: string
    ) => {
        const date = model?.[fieldName] || dateToIsoString(new Date());
        const newDate = isoStringToDate(date);

        if (type === "hour") {
            const currentHours = newDate.getHours();
            const isPM = currentHours >= 12;
            let newHour = parseInt(value);

            if (newHour === 12) newHour = 0; // 12 AM is 0, 12 PM is 12

            newDate.setHours(isPM ? newHour + 12 : newHour);

        } else if (type === "minute") {
            newDate.setMinutes(parseInt(value));
        } else if (type === "ampm") {
            const currentHours = newDate.getHours();
            if (value === "PM" && currentHours < 12) {
                newDate.setHours(currentHours + 12);
            } else if (value === "AM" && currentHours >= 12) {
                newDate.setHours(currentHours - 12);
            }
        }

        const t = dateToIsoString(newDate);
        updateModel(fieldName, t);
        // For routines, update startTime and routineStartHour, endTime and routineEndHour
        if (taskType === "routine" && fieldName === "startTime") {
            updateModel("routineStartHour", isoToHHMM(t));
        }
        if (taskType === "routine" && fieldName === "endTime") {
            updateModel("routineEndHour", isoToHHMM(t));
        }
    };

    // Helper to get the correct hour for highlighting
    const getSelectedHour = () => {
        if (!model?.[fieldName]) return -1;
        const hours = isoStringToDate(model?.[fieldName]).getHours();
        const hour12 = hours % 12;
        return hour12 === 0 ? 12 : hour12; // 0 or 12 should be 12
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger />
            <PopoverContent
                className={cn("w-auto p-0 mt-2 z-[99999999]", wrapperClassName)}
                // Prevent popover from closing when clicking inside
                // onInteractOutside={(e) => e.preventDefault()}
            >
                <div className="sm:flex">
                    {/* Show Calendar if type is 'date-only' or 'date-time' */}
                    {(type === "date-only" || type === "date-time") && (
                        <Calendar
                            mode="single"
                            selected={model?.[fieldName] ? isoStringToDate(model[fieldName]) : undefined}
                            onSelect={handleDateSelect}
                            disabled={(day) => enabledDate ? !isSameDay(day, enabledDate) : false}
                            month={enabledDate}
                            disableNavigation={!!enabledDate}
                        />
                    )}

                    {/* Show Time Pickers if type is 'time-only' or 'date-time' */}
                    {(type === 'time-only' || type === 'date-time') && (
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {hours.slice().reverse().map((hour) => (
                                        <Button
                                            key={hour}
                                            size="icon"
                                            variant={
                                                getSelectedHour() === hour
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() => handleTimeChange("hour", hour.toString())}
                                        >
                                            {hour}
                                        </Button>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" className="sm:hidden" />
                            </ScrollArea>
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {/* Updated to be 15 minute intervals for better usability */}
                                    {Array.from({ length: 4 }, (_, i) => i * 15).map((minute) => (
                                        <Button
                                            key={minute}
                                            size="icon"
                                            variant={
                                                model?.[fieldName] && isoStringToDate(model?.[fieldName]).getMinutes() === minute
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() =>
                                                handleTimeChange("minute", minute.toString())
                                            }
                                        >
                                            {/* Pad minute with leading zero */}
                                            {minute.toString().padStart(2, '0')}
                                        </Button>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" className="sm:hidden" />
                            </ScrollArea>
                            <ScrollArea className="">
                                <div className="flex sm:flex-col p-2">
                                    {["AM", "PM"].map((ampm) => (
                                        <Button
                                            key={ampm}
                                            size="icon"
                                            variant={
                                                model?.[fieldName] &&
                                                    ((ampm === "AM" && isoStringToDate(model?.[fieldName]).getHours() < 12) ||
                                                        (ampm === "PM" && isoStringToDate(model?.[fieldName]).getHours() >= 12))
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() => handleTimeChange("ampm", ampm)}
                                        >
                                            {ampm}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}