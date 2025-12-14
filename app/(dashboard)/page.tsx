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
    Cell,
    PieChart,
    Pie,
    Legend
} from 'recharts';
import api from '@/lib/axios';



export default function DashboardHome() {
    const [stats, setStats] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-error">Failed to load dashboard data.</p>
            </div>
        )
    }

    // Map API data to Chart data
    const statusColors: Record<string, string> = {
        'TODO': '#94a3b8',
        'IN_PROGRESS': '#0ea5e9',
        'REVIEW': '#f59e0b',
        'DONE': '#10b981',
    };

    const priorityColors: Record<string, string> = {
        'HIGH': '#ef4444',
        'MEDIUM': '#f59e0b',
        'LOW': '#3b82f6',
    };

    const chartData = stats.taskStatusDistribution?.map((item: any) => ({
        name: item.status.replace('_', ' '), // e.g. IN_PROGRESS -> IN PROGRESS
        value: item.count,
        color: statusColors[item.status] || '#cbd5e1'
    })) || [];

    const priorityChartData = stats.taskPriorityDistribution?.map((item: any) => ({
        name: item.priority,
        value: item.count,
        color: priorityColors[item.priority] || '#cbd5e1'
    })) || [];

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
                            <div className="text-3xl font-bold text-base-content">{stats.overview.totalProjects}</div>
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
                            <div className="text-3xl font-bold text-base-content">{stats.overview.tasksCompleted}</div>
                            <div className="text-xs text-success mt-1 font-medium">{stats.overview.completionRate}% completion rate</div>
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
                            <div className="text-3xl font-bold text-base-content">{stats.overview.pendingTasks}</div>
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
                            <div className="text-3xl font-bold text-base-content">{stats.overview.overdueTasks}</div>
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
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Task Distribution Chart */}
                <div className="col-span-1 lg:col-span-3 card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body">
                        <h2 className="card-title text-lg mb-6">Task Status Distribution</h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} barSize={60}>
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
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-base-100 border border-base-200 p-2 rounded-lg shadow-sm">
                                                        <p className="text-base-content font-medium">{payload[0].payload.name}: {payload[0].value}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {chartData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Task Priority Distribution Chart */}
                <div className="col-span-1 lg:col-span-2 card bg-base-100 shadow-sm border border-base-200">
                    <div className="card-body">
                        <h2 className="card-title text-lg mb-6">Task Priority</h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={priorityChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {priorityChartData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-base-100 border border-base-200 p-2 rounded-lg shadow-sm">
                                                        <p className="text-base-content font-medium">{payload[0].name}: {payload[0].value}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

