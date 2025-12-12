import {
    Files,
    GanttChartSquare,
    Globe2,
    KanbanSquare,
    List,
    MoreHorizontal,
    ShieldAlert,
} from "lucide-react";
import { useContext } from "react";

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
import { getFallbackName } from "@/lib/utils";
import { Project, ProjectMembershipRole, TeamMember } from "@/model/project-management";
import { TeamProjectContext, TeamProjectContextProps, TeamProjectTab } from "../sidebar/pages/project/team-project-context";

export interface ProjectHeaderProps {
    role?: ProjectMembershipRole;
    members: TeamMember[];
    modalStates: boolean[];
    updateModalStates: (index: number, isOpen: boolean) => void;
    currentSelectedProject: Project | null;
};

export const ProjectHeader = ({
    role,
    members,
    modalStates,
    updateModalStates,
    currentSelectedProject,
}: ProjectHeaderProps) => {
    const {
        tab,
        setTab,
        currentMember,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    // 🆕 RBAC Check
    const canDelete = currentMember?.role === ProjectMembershipRole.OWNER;

    // Avatar list logic
    const MAX_AVATARS = 6;
    const membersToShow = members.slice(0, MAX_AVATARS);
    const remainingMembers = members.slice(MAX_AVATARS);
    const remainingCount = remainingMembers.length;

    return (
        <TooltipProvider delayDuration={200}>
            <div className="w-full border-b border-gray-200 p-4 pl-2">
                {/* --- Title Row --- */}
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-3">
                        {/* Project Title */}
                        <h1 className="text-2xl font-bold">{currentSelectedProject?.name || "..."}</h1>

                        {/* --- Member Avatars --- */}
                        <div className="flex -space-x-2">
                            {/* First 6 Avatars */}
                            {membersToShow.map(member => (
                                <Tooltip key={member.userId}>
                                    <TooltipTrigger asChild>
                                        <Avatar className="w-8 h-8 border-2 border-white rounded-full">
                                            <AvatarImage src={member.avatarUrl || ''} alt={member.name} />
                                            <AvatarFallback>{getFallbackName(member.name)}</AvatarFallback>
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
                                                <li key={member.userId}>{member.name}</li>
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
                                {role === ProjectMembershipRole.OWNER && (
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => updateModalStates(1, true)}
                                    >
                                        Invite members
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => updateModalStates(2, true)}
                                >
                                    View team members
                                </DropdownMenuItem>
                                {canDelete && (
                                    <DropdownMenuItem
                                        className="text-red-600 cursor-pointer"
                                        onClick={() => updateModalStates(3, true)}
                                    >
                                        Delete project
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* --- Navigation Tabs --- */}
                <Tabs value={tab} onValueChange={setTab}>
                    <TabsList className="bg-transparen p-0 h-auto gap-2.5">
                        {/* Summary */}
                        <TabsTrigger
                            value={TeamProjectTab.SUMMARY}
                            className="py-2.5 px-3 cursor-pointer rounded-md text-gray-500 data-[state=active]:text-blue-600 data-[state=active]:font-medium data-[state=active]:bg-blue-50"
                        >
                            <Globe2 className="h-4 w-4 mr-2" />
                            Summary
                        </TabsTrigger>

                        {/* List */}
                        <TabsTrigger
                            value={TeamProjectTab.LIST}
                            className="py-2.5 px-3 cursor-pointer rounded-md text-gray-500 data-[state=active]:text-blue-600 data-[state=active]:font-medium data-[state=active]:bg-blue-50"
                        >
                            <List className="h-4 w-4 mr-2" />
                            List
                            {(role !== ProjectMembershipRole.OWNER && tab === TeamProjectTab.LIST) && (
                                <span className="text-gray-400 ml-1.5" style={{ color: 'blue' }}>(Can edit status only)</span>
                            )}
                        </TabsTrigger>

                        {/* Task board (Active) */}
                        <TabsTrigger
                            value={TeamProjectTab.TASK_BOARD}
                            className="py-2.5 px-3 cursor-pointer rounded-md text-gray-500 data-[state=active]:text-blue-600 data-[state=active]:font-medium data-[state=active]:bg-blue-50"
                        >
                            <KanbanSquare className="h-4 w-4 mr-2" />
                            Task board
                            {(role !== ProjectMembershipRole.OWNER && tab === TeamProjectTab.TASK_BOARD) && (
                                <span className="text-gray-400 ml-1.5" style={{ color: 'blue' }}>(View only)</span>
                            )}
                        </TabsTrigger>

                        {/* Timeline */}
                        <TabsTrigger
                            value={TeamProjectTab.TIMELINE}
                            className="py-2.5 px-3 cursor-pointer rounded-md text-gray-500 data-[state=active]:text-blue-600 data-[state=active]:font-medium data-[state=active]:bg-blue-50"
                        >
                            <GanttChartSquare className="h-4 w-4 mr-2" />
                            Timeline
                        </TabsTrigger>

                        {/* Shared source */}
                        <TabsTrigger
                            value={TeamProjectTab.SHARED_SOURCE}
                            className="py-2.5 px-3 cursor-pointer rounded-md text-gray-500 data-[state=active]:text-blue-600 data-[state=active]:font-medium data-[state=active]:bg-blue-50"
                        >
                            <Files className="h-4 w-4 mr-2" />
                            Shared source
                        </TabsTrigger>

                        {/* Risk register */}
                        <TabsTrigger
                            value={TeamProjectTab.RISK_REGISTER}
                            className="py-2.5 px-3 cursor-pointer rounded-md text-gray-500 data-[state=active]:text-blue-600 data-[state=active]:font-medium data-[state=active]:bg-blue-50"
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