"use client";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UserTaskItem } from "@/model/project-management";
import {
    ChevronDown,
    LayoutGrid
} from 'lucide-react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BufferListProjectTask } from "./buffer-list-project-task";
import { CalendarContext, CalendarContextInterface } from "./calendar-context";

export interface BufferListProps {
    showAllTasks: boolean;
};

export function BufferList({ showAllTasks, }: BufferListProps) {
    const {
        projectGroups: projects,
        getUserProjectTasks,
    } = useContext<CalendarContextInterface>(CalendarContext);

    const allTasks = useMemo(() => {
        const t: UserTaskItem[] = [];
        (projects || []).forEach(project => {
            (project.tasks || []).forEach(task => t.push(task));
        });
        return t;
    }, [projects]);

    const [expandedProjects, setExpandedProjects] = useState<Record<number, boolean>>(
        (projects || []).reduce((acc, p) => ({ ...acc, [p.projectId]: true }), {})
    );
    const [hiddenTasks, setHiddenTasks] = useState<Record<number, boolean>>(
        (allTasks || []).reduce((acc, p) => ({ ...acc, [p.pmTaskId]: false }), {})
    );
    const toggleProject = (projectId: number) => {
        setExpandedProjects(prev => ({
            ...prev,
            [projectId]: !prev[projectId]
        }));
    };

    const initialRender = useRef(true);
    useEffect(() => {
        // If it is the first re-render, dont getUserProjectTasks(), call it on the second re-render
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        
        getUserProjectTasks();
    }, []);

    return (
        <div className="w-[350px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col font-sans h-[80vh] max-h-[800px]">
            {/* --- Scrollable List Content --- */}
            <ScrollArea className="flex-1 p-4 bg-white">
                <div className="flex flex-col gap-6">
                    {(projects || []).map((project) => (
                        <Collapsible
                            key={project.projectId}
                            open={expandedProjects[project.projectId]}
                            onOpenChange={() => toggleProject(project.projectId)}
                            className="space-y-2"
                        >
                            {/* Project Name Header (Collapsible Trigger) */}
                            <CollapsibleTrigger asChild>
                                <div className="flex items-center gap-2 cursor-pointer group select-none">
                                    <LayoutGrid className="h-4 w-4 text-gray-500" /> {/* Project Icon */}
                                    <span className="text-sm font-bold text-gray-800">{project.projectName}</span>
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 text-gray-400 transition-transform duration-200 ml-auto",
                                            expandedProjects[project.projectId] ? "" : "-rotate-90"
                                        )}
                                    />
                                </div>
                            </CollapsibleTrigger>

                            {/* Tasks List */}
                            <CollapsibleContent className="space-y-1 pl-2 border-l-2 border-gray-100 ml-2">
                                {project.tasks.map((task) => {
                                    // Logic: If showAllTasks is FALSE, and task is hidden, return null (don't render)
                                    if (!showAllTasks && hiddenTasks[task.pmTaskId]) return null;

                                    return (
                                        <BufferListProjectTask 
                                            task={task}
                                            hiddenTasks={hiddenTasks}
                                            setHiddenTasks={setHiddenTasks}
                                            showAllTasks={showAllTasks}
                                        />
                                    );
                                })}

                                {/* Empty State for Project if filtered */}
                                {project.tasks.every(t => hiddenTasks[t.pmTaskId]) && !showAllTasks && (
                                    <div className="text-xs text-gray-400 italic py-1 px-2">
                                        All tasks hidden
                                    </div>
                                )}
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}