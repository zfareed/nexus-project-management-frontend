'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

// Mock Data for Chart
const data = [
    { name: 'To Do', value: 2, color: '#94a3b8' },      // Slate-400
    { name: 'In Progress', value: 1, color: '#0ea5e9' }, // Sky-500
    { name: 'Review', value: 1, color: '#f59e0b' },     // Amber-500
    { name: 'Done', value: 1, color: '#10b981' },       // Emerald-500
];

const mockActivities = [
    {
        id: 1,
        title: 'Fix Navigation Bug',
        date: '2023-10-16',
        priority: 'HIGH',
        priorityColor: 'badge-error',
    },
    {
        id: 2,
        title: 'App Store Screenshots',
        date: '2023-10-12',
        priority: 'LOW',
        priorityColor: 'badge-ghost',
    },
    {
        id: 3,
        title: 'API Integration',
        date: '2023-10-10',
        priority: 'URGENT',
        priorityColor: 'badge-primary',
    },
    {
        id: 4,
        title: 'Implement Dark Mode',
        date: '2023-10-05',
        priority: 'MEDIUM',
        priorityColor: 'badge-warning',
    },
    {
        id: 5,
        title: 'Design Home Page',
        date: '2023-10-02',
        priority: 'HIGH',
        priorityColor: 'badge-error',
    },
];

export default function DashboardHome() {
    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-base-content">Dashboard Overview</h1>
                <p className="text-base-content/60 mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stat Cards - Grid of 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Projects */}
                <div className="card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body p-6 flex flex-row items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-base-content/60 mb-1">Total Projects</div>
                            <div className="text-3xl font-bold text-base-content">3</div>
                            <div className="text-xs text-primary mt-1 font-medium">Active workflows</div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Tasks Completed */}
                <div className="card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body p-6 flex flex-row items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-base-content/60 mb-1">Tasks Completed</div>
                            <div className="text-3xl font-bold text-base-content">1</div>
                            <div className="text-xs text-success mt-1 font-medium">20% completion rate</div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Pending Tasks */}
                <div className="card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body p-6 flex flex-row items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-base-content/60 mb-1">Pending Tasks</div>
                            <div className="text-3xl font-bold text-base-content">4</div>
                            <div className="text-xs text-info mt-1 font-medium">Requires attention</div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center text-info">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Overdue */}
                <div className="card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body p-6 flex flex-row items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-base-content/60 mb-1">Overdue</div>
                            <div className="text-3xl font-bold text-base-content">4</div>
                            <div className="text-xs text-error mt-1 font-medium">High priority</div>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid: Chart & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Task Distribution Chart */}
                <div className="col-span-1 lg:col-span-2 card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body">
                        <h2 className="card-title text-lg mb-6">Task Status Distribution</h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} barSize={60}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--b2))" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'oklch(var(--bc))', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'oklch(var(--bc))', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{
                                            backgroundColor: 'oklch(var(--b1))',
                                            borderColor: 'oklch(var(--b2))',
                                            borderRadius: '0.5rem',
                                            color: 'oklch(var(--bc))'
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="col-span-1 card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body">
                        <h2 className="card-title text-lg mb-4">Recent Activity</h2>
                        <div className="space-y-6">
                            {mockActivities.map((activity) => (
                                <div key={activity.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                        <div className="w-0.5 h-full bg-base-200 mt-1 -mb-6 last:hidden"></div>
                                    </div>
                                    <div className="flex-1 pb-1">
                                        <div className="font-medium text-base-content">{activity.title}</div>
                                        <div className="text-xs text-base-content/50 mt-0.5">Created on {activity.date}</div>
                                        <div className={`badge ${activity.priorityColor} badge-xs mt-2 font-semibold`}>
                                            {activity.priority}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

