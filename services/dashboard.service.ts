import api from '@/lib/axios';

export interface DashboardStats {
    overview: {
        totalProjects: number;
        tasksCompleted: number;
        completionRate: number;
        pendingTasks: number;
        overdueTasks: number;
    };
    taskStatusDistribution: {
        status: string;
        count: number;
    }[];
    taskPriorityDistribution: {
        priority: string;
        count: number;
    }[];
}

export const dashboardService = {
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    }
};
