"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export interface TaskMetricsProps {
    tasksCompleted: number | string;
    tasksDueSoon: number | string;
    tasksOverdue: number | string; 
    unassignedTasks: number | string;
}

export interface MetricCardProps {
    title: string;
    count: number | string;
    color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, count, color }) => {
    const textColor = 'text-white';

    return (
        <div
            className={cn(
                "p-4 rounded-xl shadow-md flex justify-between items-center transition-all duration-300 min-h-[80px]",
                color
            )}
        >
            <span className={cn("text-lg font-semibold", textColor)}>{title}</span>
            <span className={cn("text-3xl font-bold", textColor)}>{count}</span>
        </div>
    );
};

export const TaskMetricsDashboard: React.FC<TaskMetricsProps> = ({
    tasksCompleted,
    tasksDueSoon,
    tasksOverdue,
    unassignedTasks,
}) => {
    const metricsData = [
        {
            title: "Tasks Completed",
            count: tasksCompleted,
            color: "bg-green-500", // Bright Green
        },
        {
            title: "Tasks Due Soon",
            count: tasksDueSoon,
            color: "bg-[#FFCB33]", // Yellow/Gold
        },
        {
            title: "Tasks Overdue",
            count: tasksOverdue,
            color: "bg-pink-600", // Deep Pink/Magenta
        },
        {
            title: "Unassigned Tasks",
            count: unassignedTasks,
            color: "bg-[#7D8FB3]", // Gray/Blue
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metricsData.map((metric, index) => (
                <MetricCard
                    key={index}
                    title={metric.title}
                    count={metric.count}
                    color={metric.color}
                />
            ))}
        </div>
    );
};