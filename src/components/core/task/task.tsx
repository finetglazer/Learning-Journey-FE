import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    CheckCircle2,
    Calendar,
    ChevronDown,
    Pencil,
} from "lucide-react"

// Define the component
export function TaskEditor() {
    const subTasks = ["Task 1", "Task 2", "Task 3", "Task 4", "Task 5", "Task 6"];

    return (
        <Card className="w-[380px] bg-[#F9FAFB] rounded-xl shadow-md font-sans p-4">
            <CardContent className="p-2">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-4">
                    <Input
                        placeholder="Task title"
                        className="text-base border-none focus:ring-0 shadow-none placeholder:text-gray-400 bg-transparent"
                    />
                    <div className="flex items-center space-x-2">
                        <Button className="bg-green-300 hover:bg-green-400 text-green-800 rounded-full px-5 text-sm font-semibold">Save</Button>
                        <Button variant="ghost" className="text-gray-500 rounded-full px-5 text-sm">Cancel</Button>
                    </div>
                </div>

                {/* Tags Section */}
                <div className="flex space-x-2 mb-4">
                    <Badge className="bg-blue-400 text-white rounded-md px-3 py-1 text-xs font-medium">Event</Badge>
                    <Badge className="bg-pink-500 text-white rounded-md px-3 py-1 text-xs font-medium">Task</Badge>
                    <Badge className="bg-green-400 text-white rounded-md px-3 py-1 text-xs font-medium">Routine</Badge>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                {/* Status Section */}
                <div className="flex items-center space-x-3 text-gray-600 mb-4 px-2">
                    <CheckCircle2 className="text-green-500" size={20} />
                    <span className="text-sm">Status</span>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                {/* Time Inputs Section */}
                <div className="grid grid-cols-2">
                    <div className="flex items-center space-x-3 text-gray-500 px-2">
                        <Calendar size={20} />
                        <Input placeholder="Start hour" className="border-none focus:ring-0 shadow-none text-sm bg-transparent p-0" />
                    </div>
                    <div className="flex items-center space-x-3 text-gray-500 px-2 border-l border-gray-200">
                        <Calendar size={20} />
                        <Input placeholder="End hour" className="border-none focus:ring-0 shadow-none text-sm bg-transparent p-0" />
                    </div>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                {/* Sub-task List Section */}
                <Collapsible defaultOpen className="px-2">
                    <div className="flex items-center space-x-3">
                        <Checkbox id="subtask-toggle" defaultChecked />
                        <CollapsibleTrigger asChild>
                            <div className="flex items-center cursor-pointer">
                                <Label htmlFor="subtask-toggle" className="text-gray-700 cursor-pointer text-sm">Sub task list</Label>
                                <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
                            </div>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                        <div className="mt-3 ml-2 pl-4 max-h-36 overflow-y-auto relative custom-scrollbar">
                            <div className="space-y-3 text-gray-600 text-sm">
                                {subTasks.map((task, index) => (
                                    <p key={index}>{task}</p>
                                ))}
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                <div className="border-t border-gray-200 my-4"></div>

                {/* Notes Section */}
                <div className="flex items-center space-x-3 text-gray-500 px-2">
                    <Pencil size={20} />
                    <Input placeholder="Notes" className="border-none focus:ring-0 shadow-none text-sm bg-transparent p-0" />
                </div>
            </CardContent>
        </Card>
    )
}