"use client";

import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface OverallStatusChartProps {
    todo: number | string;
    inProgress: number | string;
    inReview: number | string;
    done: number | string;
}

export function OverallStatusChart({ todo, inProgress, inReview, done }: OverallStatusChartProps) {
    const todoNum = Number(todo);
    const doneNum = Number(done);
    const inProgressNum = Number(inProgress);
    const inReviewNum = Number(inReview);

    // 2. Calculate Total for Center Text
    const totalTasks = todoNum + inProgressNum + inReviewNum + doneNum;

    const data = useMemo(() => [
        { name: 'Done', value: doneNum, color: '#86EFAC' },      // Light Green (Tailwind green-300/400)
        { name: 'In review', value: inReviewNum, color: '#A855F7' }, // Purple (Tailwind purple-500)
        { name: 'In progress', value: inProgressNum, color: '#EC4899' }, // Pink (Tailwind pink-500)
        { name: 'To Do', value: todoNum, color: '#FACC15' },     // Yellow (Tailwind yellow-400)
    ], [todo, inProgress, inReview, done]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Overall Status</h3>
                <p className="text-sm text-gray-500">This lets you see how much work in different status at a glance</p>
            </div>

            {/* Chart Container */}
            <div className="flex-1 min-h-[250px] relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60} // Creates the Donut hole
                            outerRadius={120}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none" // Removes white borders between segments
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: '#374151', fontSize: '12px', fontWeight: 600 }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-gray-800">{totalTasks}</span>
                </div>
            </div>

            {/* Custom Legend (Matches image style better than default Recharts legend) */}
            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center space-x-2">
                        <span
                            className="w-2 h-2 rounded-full block"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-gray-600">
                            {item.name}: <span className="font-medium text-gray-900">{item.value}</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};