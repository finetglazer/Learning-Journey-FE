"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toDayJs } from "@/lib/utils";
import { calendarRepository } from "@/repository/calendar-repository";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DayMonthPicker } from "./day-month-picker";
import { AlertMessage, AlertModal } from "@/components/core/alert-modal/alert-modal";

export interface MemorableEvent {
    date: string; // e.g., "25/12"
    title: string;
}

export const MemorableEvents = () => {
    const [events, setEvents] = useState<MemorableEvent[]>([]);
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

    const getMemorableEvents = () => {
        calendarRepository.getMemorableEvents().subscribe({
            next: res => {
                if (res?.status) {
                    const events = (res?.data?.events || []).map((event: any) => {
                        const filledDay = (event?.day as number).toString().padStart(2, "0");
                        const filledMonth = (event?.month as number).toString().padStart(2, "0");
                        return {
                            ...event,
                            date: `${filledDay}/${filledMonth}`,
                        } as MemorableEvent;
                    });

                    setEvents(events);
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { }
        });
    };

    const updateMemorableEvents = () => {
        calendarRepository.updateMemorableEvents({
            events: [...events].map((event: MemorableEvent) => {
                const day = Number(event.date.split("/")[0]);
                const month = Number(event.date.split("/")[1]);
                const title = event.title;
                return {
                    day,
                    month,
                    title,
                }
            }),
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.msg || res?.message);
                    getMemorableEvents();
                }
                else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
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
            }
        });
    };

    useEffect(() => {
        getMemorableEvents();
    }, []);

    const handleEventChange = (
        index: number,
        field: 'date' | 'title',
        value: string
    ) => {
        const newEvents = [...events];
        newEvents[index] = { ...newEvents[index], [field]: value };
        setEvents(newEvents);
    };

    const handleAddNewEvent = () => {
        const today = toDayJs().toDate();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');

        setEvents([...events, { date: `${day}/${month}`, title: "" }]);
    };

    const handleDeleteEvent = (index: number) => {
        const newEvents = events.filter((_, i) => i !== index);
        setEvents(newEvents);
    };

    return (
        <div className="p-10 max-w-3xl mx-auto h-full overflow-y-auto ml-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Memorable events</h1>

            <h2 className="text-sm font-semibold text-gray-800 mb-2">Events</h2>
            <div className="space-y-3 mb-4">
                {events.map((event, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <DayMonthPicker
                            value={event.date}
                            onChange={(date) => handleEventChange(index, 'date', date)}
                        />
                        <Input
                            type="text"
                            placeholder="Title"
                            value={event.title}
                            onChange={(e) => handleEventChange(index, 'title', e.target.value)}
                            className="flex-1"
                        />
                        <button
                            onClick={() => handleDeleteEvent(index)}
                            className="p-2 cursor-pointer text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                            aria-label="Delete event"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={handleAddNewEvent}
                className="p-2 cursor-pointer text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                aria-label="Add new event"
            >
                <Plus size={20} />
            </button>

            <p className="text-sm text-gray-500 mt-4 mb-6">
                These events are imported automatically into your private calendar.
            </p>

            <div className="mt-6">
                <Button
                    onClick={updateMemorableEvents}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-800 text-white text-sm font-medium rounded-md shadow cursor-pointer"
                >
                    Save
                </Button>
            </div>
            {alertMessage && (
                <AlertModal
                    alertMessage={alertMessage}
                    onClose={() => setAlertMessage(null)}
                />
            )}
        </div>
    );
};