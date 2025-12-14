import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        overview: {
            totalProjects: 3,
            tasksCompleted: 1,
            completionRate: 20,
            pendingTasks: 4,
            overdueTasks: 4
        },
        taskStatusDistribution: [
            {
                status: "TODO",
                count: 2
            }
        ],
        taskPriorityDistribution: [
            {
                priority: "HIGH",
                count: 2
            }
        ]
    });
}
