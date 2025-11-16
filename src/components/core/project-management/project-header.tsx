import {
    Files,
    GanttChartSquare,
    Globe2,
    KanbanSquare,
    List,
    MoreHorizontal,
    ShieldAlert,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type Member = {
    id: number;
    name: string;
    avatarUrl: string | null;
    initials: string;
};

const mockMembers: Member[] = [
    { id: 1, name: 'Trần Mạnh Hùng', avatarUrl: 'https://placehold.co/40x40/E0E0E0/707070?text=TH', initials: 'TH' },
    { id: 2, name: 'Lê Văn An', avatarUrl: 'https://placehold.co/40x40/C0C0C0/505050?text=LA', initials: 'LA' },
    { id: 3, name: 'Nguyễn Thị Bình', avatarUrl: null, initials: 'NB' }, // No avatar, will use fallback
    { id: 4, name: 'Phạm Đức Chung', avatarUrl: 'https://placehold.co/40x40/A0A0A0/303030?text=PC', initials: 'PC' },
    { id: 5, name: 'Võ Minh Dũng', avatarUrl: 'https://placehold.co/40x40/808080/101010?text=VD', initials: 'VD' },
    { id: 6, name: 'Hoàng Thị Em', avatarUrl: 'https://placehold.co/40x40/606060/000000?text=HE', initials: 'HE' },
    { id: 7, name: 'Đặng Văn Phúc', avatarUrl: null, initials: 'DP' },
    { id: 8, name: 'Trịnh Thị Gấm', avatarUrl: null, initials: 'TG' },
];

export const ProjectHeader = () => {
    // This value would come from your component's state
    const currentTab = "task-board";

    // Avatar list logic
    const MAX_AVATARS = 6;
    const membersToShow = mockMembers.slice(0, MAX_AVATARS);
    const remainingMembers = mockMembers.slice(MAX_AVATARS);
    const remainingCount = remainingMembers.length;

    return (
        <TooltipProvider delayDuration={200}>
            <div className="w-full border-b border-gray-200 p-4">
                {/* --- Title Row --- */}
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">

                        {/* Project Title */}
                        <h1 className="text-2xl font-bold">Project 1</h1>

                        {/* --- Member Avatars --- */}
                        <div className="flex -space-x-2">
                            {/* First 6 Avatars */}
                            {membersToShow.map(member => (
                                <Tooltip key={member.id}>
                                    <TooltipTrigger asChild>
                                        <Avatar className="w-8 h-8 border-2 border-white rounded-full">
                                            <AvatarImage src={member.avatarUrl || ''} alt={member.name} />
                                            <AvatarFallback>{member.initials}</AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{member.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}

                            {/* Remaining Members Counter */}
                            {remainingCount > 0 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Avatar className="w-8 h-8 border-2 border-white rounded-full">
                                            <AvatarFallback>+{remainingCount}</AvatarFallback>
                                        </Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-medium">More members:</p>
                                        <ul className="list-disc list-inside">
                                            {remainingMembers.map(member => (
                                                <li key={member.id}>{member.name}</li>
                                            ))}
                                        </ul>
                                    </TooltipContent>
                                </Tooltip>
                            )}
                        </div>

                        {/* --- More Options Button --- */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Edit details</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                    Delete project
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* --- Navigation Tabs --- */}
                <Tabs defaultValue={currentTab}>
                    <TabsList className="bg-transparent p-0 h-auto">
                        {/* Summary */}
                        <TabsTrigger
                            value="summary"
                            className="pb-3 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                        >
                            <Globe2 className="h-4 w-4 mr-2" />
                            Summary
                        </TabsTrigger>

                        {/* List */}
                        <TabsTrigger
                            value="list"
                            className="pb-3 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                        >
                            <List className="h-4 w-4 mr-2" />
                            List
                        </TabsTrigger>

                        {/* Task board (Active) */}
                        <TabsTrigger
                            value="task-board"
                            className="pb-3 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                        >
                            <KanbanSquare className="h-4 w-4 mr-2" />
                            Task board
                            <span className="text-gray-400 ml-1.5">(View only)</span>
                        </TabsTrigger>

                        {/* Timeline */}
                        <TabsTrigger
                            value="timeline"
                            className="pb-3 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                        >
                            <GanttChartSquare className="h-4 w-4 mr-2" />
                            Timeline
                        </TabsTrigger>

                        {/* Shared file */}
                        <TabsTrigger
                            value="shared-file"
                            className="pb-3 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                        >
                            <Files className="h-4 w-4 mr-2" />
                            Shared file
                        </TabsTrigger>

                        {/* Risk register */}
                        <TabsTrigger
                            value="risk-register"
                            className="pb-3 rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
                        >
                            <ShieldAlert className="h-4 w-4 mr-2" />
                            Risk register
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </TooltipProvider>
    );
};