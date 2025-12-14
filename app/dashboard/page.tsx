import React from 'react';

export default function DashboardHome() {
    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-base-content">Dashboard</h1>
                    <p className="text-base-content/60 mt-1">Overview of your current projects and tasks.</p>
                </div>
                <button className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Projects Stat */}
                <div className="stats shadow bg-base-100 border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            </div>
                        </div>
                        <div className="stat-title">Total Projects</div>
                        <div className="stat-value text-primary">12</div>
                        <div className="stat-desc">2 active this month</div>
                    </div>
                </div>

                {/* Tasks Stat */}
                <div className="stats shadow bg-base-100 border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <div className="p-2 bg-secondary/10 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                            </div>
                        </div>
                        <div className="stat-title">Pending Tasks</div>
                        <div className="stat-value text-secondary">42</div>
                        <div className="stat-desc">5 due today</div>
                    </div>
                </div>

                {/* Users Stat */}
                <div className="stats shadow bg-base-100 border border-base-200">
                    <div className="stat">
                        <div className="stat-figure text-accent">
                            <div className="p-2 bg-accent/10 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                        </div>
                        <div className="stat-title">Active Users</div>
                        <div className="stat-value text-accent">1,200</div>
                        <div className="stat-desc">↘︎ 90 (14%)</div>
                    </div>
                </div>
            </div>

            {/* Optional Recent Activity Placeholder to fill space */}
            <div className="card bg-base-100 shadow-sm border border-base-200 mt-6">
                <div className="card-body">
                    <h2 className="card-title">Recent Activity</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>Project</th>
                                    <th>User</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* row 1 */}
                                <tr>
                                    <td>Nexus Frontend</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-8 h-8">
                                                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">Hart Hagerty</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><div className="badge badge-success gap-2">Completed</div></td>
                                    <td>Dec 14, 2025</td>
                                </tr>
                                {/* row 2 */}
                                <tr>
                                    <td>API Gateway</td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-8 h-8">
                                                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Avatar" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">Brice Swyre</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><div className="badge badge-warning gap-2">In Progress</div></td>
                                    <td>Dec 13, 2025</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}
