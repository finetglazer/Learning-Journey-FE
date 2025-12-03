import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { dateToDayJs } from '@/lib/utils';
import { TimelineMilestone } from '@/model/project-management';
import { format } from 'date-fns';
import { Flag, Plus, RefreshCw, X } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface AddMilestoneCardProps {
    onAdd: (name: string, date: string) => void;
    onUpdate: (milestone: TimelineMilestone) => void;
    selectedMilestone: TimelineMilestone | null;
    setSelectedMilestone: Dispatch<SetStateAction<TimelineMilestone | null>>;
}

export function AddMilestoneCard({ onAdd, selectedMilestone, onUpdate, setSelectedMilestone }: AddMilestoneCardProps) {
    const [name, setName] = useState("");
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = () => {
        if (selectedMilestone) {
            onUpdate({
                ...selectedMilestone,
                name,
                date: dateToDayJs(date as Date, 0).format("YYYY-MM-DD"),
            });
            setIsOpen(false);
            return;
        }
        if (name && date) {
            onAdd(name, format(date, 'yyyy-MM-dd'));
            setName("");
            setIsOpen(false);
        }
    };

    const onOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setSelectedMilestone(null);
        }
    }

    useEffect(() => {
        if (selectedMilestone) {
            setName(selectedMilestone.name);
            setDate(new Date(selectedMilestone.date));
        }
    }, [selectedMilestone]);

    return (
        <Popover open={isOpen} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-7 w-48 cursor-pointer bg-cyan-100 hover:bg-cyan-200 text-cyan-700 border border-cyan-200 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
                >
                    {!selectedMilestone ? <Flag className="w-6 h-6" /> : <RefreshCw className="w-6 h-6" />}
                    <span className="text-sm font-semibold">{!selectedMilestone ? "Add milestone" : "Update milestone"}</span>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-4 bg-white shadow-xl rounded-xl border border-gray-100" align="start">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-700 text-sm">{!selectedMilestone ? "New milestone" : "Update milestone"}</h4>
                        <Button variant="ghost" size="icon" className="h-6 w-6 cursor-pointer" onClick={() => {
                            setIsOpen(false);
                            setSelectedMilestone(null);
                        }}>
                            <X className="cursor-pointer w-4 h-4 text-gray-400" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Input
                            placeholder="Milestone Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-gray-200 focus:ring-cyan-500"
                        />

                        <div className="rounded-md border border-gray-200 p-2">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                autoFocus
                                className="rounded-md border shadow-none"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        className="w-full cursor-pointer bg-cyan-500 hover:bg-cyan-600 text-white font-medium"
                        disabled={!name || !date}
                    >
                        {!selectedMilestone ? <Plus className="w-4 h-4 mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                        {!selectedMilestone ? "Create Milestone" : "Update Milestone"}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}