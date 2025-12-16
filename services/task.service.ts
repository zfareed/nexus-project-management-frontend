import api from '@/lib/axios';

export interface CreateTaskData {
    title: string;
    description?: string;
    status: string;
    priority: string;
    dueDate?: string | null;
    projectId: string;
    assigneeId: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> { }

export const taskService = {
    getTasks: async () => {
        const response = await api.get('/tasks');
        return response.data;
    },

    getTask: async (id: string) => {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    createTask: async (data: CreateTaskData) => {
        const response = await api.post('/tasks', data);
        return response.data;
    },

    updateTask: async (id: string, data: UpdateTaskData) => {
        const response = await api.put(`/tasks/${id}`, data);
        return response.data;
    },

    deleteTask: async (id: string) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};
