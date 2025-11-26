"use client";

import { DeliverableProgress } from '@/model/project-management';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export interface DeliverableProgressChartProps {
    data?: DeliverableProgress[];
};

const ROW_HEIGHT = 50;
const MAX_CONTAINER_HEIGHT = 300;

export function DeliverableProgressChart({ data }: DeliverableProgressChartProps) {
    const chartHeight = Math.max((data || []).length * ROW_HEIGHT, 250);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Deliverable Progress</h3>
                <p className="text-sm text-gray-500">See how your deliverable are progressing at a glance.</p>
            </div>

            {/* Scrollable Chart Container */}
            <div
                className="flex-1 w-full overflow-y-auto pr-2"
                style={{ maxHeight: MAX_CONTAINER_HEIGHT }}
            >
                <div style={{ height: chartHeight, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            layout="vertical"
                            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                            barSize={8}
                        >
                            <CartesianGrid horizontal={false} stroke="#E5E7EB" strokeDasharray="0" />

                            {/* X Axis (Sticky or Fixed if possible, but Recharts scrolls everything) */}
                            <XAxis
                                type="number"
                                domain={[0, 100]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                orientation="top" // Move X-axis to top for better visibility when scrolling
                            />

                            <YAxis
                                type="category"
                                dataKey="name"
                                width={140}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#4B5563', fontSize: 13, fontWeight: 500 }}
                                interval={0}
                            />

                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />

                            <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                                {(data || []).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="#38BDF8" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};