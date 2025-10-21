"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn, dateToIsoString, isoStringToDate } from "@/lib/utils";
import { Task } from "@/model/task";
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
        wrapperClassName,
        type,
        enabledDate,
    } = props;

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            updateModel(fieldName, dateToIsoString(selectedDate));
        }
    };

    const handleTimeChange = (
        type: "hour" | "minute" | "ampm",
        value: string
    ) => {
        const date = model?.[fieldName] || dateToIsoString(new Date());
        const newDate = isoStringToDate(date);

        if (type === "hour") {
            newDate.setHours(
                (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
            );
        } else if (type === "minute") {
            newDate.setMinutes(parseInt(value));
        } else if (type === "ampm") {
            const currentHours = newDate.getHours();
            newDate.setHours(
                value === "PM" ? currentHours + 12 : currentHours - 12
            );
        }

        updateModel(fieldName, dateToIsoString(newDate));
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger />
            <PopoverContent
                className={cn("w-auto p-0 mt-2 z-99999", wrapperClassName)}
            >
                <div className="sm:flex">
                    {type === "date-time" && (
                        <Calendar
                            mode="single"
                            selected={isoStringToDate(model?.[fieldName])}
                            onSelect={handleDateSelect}
                            disabled={(day) => enabledDate ? !isSameDay(day, enabledDate) : false}
                            month={enabledDate}
                            disableNavigation={!!enabledDate}
                        />
                    )}
                    {(type === 'time-only') && (
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {hours.reverse().map((hour) => (
                                        <Button
                                            key={hour}
                                            size="icon"
                                            variant={
                                                model?.[fieldName] && isoStringToDate(model?.[fieldName]).getHours() % 12 === hour % 12
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
                                    {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
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
                                            {minute}
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
                    {(type === 'date-time') && (
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {hours.reverse().map((hour) => (
                                        <Button
                                            key={hour}
                                            size="icon"
                                            variant={
                                                model?.[fieldName] && isoStringToDate(model?.[fieldName]).getHours() % 12 === hour % 12
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
                                    {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
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
                                            {minute}
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