import api from '@/lib/axios';

export interface CreateProjectData {
    name: string;
    description: string;
    userIds: string[];
}

export interface UpdateProjectData {
    name: string;
    description: string;
    userIds: string[];
}

export const projectService = {
    getProjects: async () => {
        const response = await api.get('/projects');
        return response.data;
    },

    getProject: async (id: string) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    createProject: async (data: CreateProjectData) => {
        const response = await api.post('/projects', data);
        return response.data;
    },

    updateProject: async (id: string, data: UpdateProjectData) => {
        const response = await api.put(`/projects/${id}`, data);
        return response.data;
    },

    deleteProject: async (id: string) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    }
};
