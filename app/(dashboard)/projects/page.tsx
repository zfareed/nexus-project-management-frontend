'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';

// Types based on API Response
type User = {
    id: string;
    name: string;
    email: string; // Added email
    role: 'ADMIN' | 'USER';
    avatar?: string; // Optional, for UI if available or placeholder
};

type Project = {
    id: string;
    name: string;
    description: string;
    // status: 'Active' | 'Completed' | 'On Hold'; // Removed as not in API
    createdAt: string;
    updatedAt: string;
    assignedUsers: User[];
    createdBy: User;
    taskCount: number;
    tasks: any[];
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]); // State for users
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false); // Clean up if not used or stick to basic
    const [currentProject, setCurrentProject] = useState<Project | null>(null);

    // Form State
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        userIds: string[];
    }>({
        name: '',
        description: '',
        userIds: [],
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [projectsRes, usersRes] = await Promise.all([
                api.get('/projects'),
                api.get('/users')
            ]);
            setProjects(projectsRes.data);
            // The users API returns { users: [...], total: ... }
            setUsers(usersRes.data.users);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            userIds: [],
        });
        setCurrentProject(null);
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsCreateOpen(true);
    };

    // Note: Edit and Delete are not fully implemented with API yet as per user request (only GET/POST specified)
    // We will keep the UI handlers but they might not persist to backend properly without endpoints.
    const handleOpenEdit = async (project: Project) => {
        setCurrentProject(project);

        try {
            const response = await api.get(`/projects/${project.id}`);
            const fullProject = response.data;
            setCurrentProject(fullProject);
            setFormData({
                name: fullProject.name,
                description: fullProject.description,
                userIds: fullProject.assignedUsers.map((u: User) => u.id),
            });
            setIsEditOpen(true);
        } catch (error) {
            console.error("Failed to fetch project details", error);
        }
    };

    const toggleTeamMember = (userId: string) => {
        setFormData(prev => {
            const isSelected = prev.userIds.includes(userId);
            if (isSelected) {
                return { ...prev, userIds: prev.userIds.filter(id => id !== userId) };
            } else {
                return { ...prev, userIds: [...prev.userIds, userId] };
            }
        });
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;

        try {
            const response = await api.post('/projects', {
                name: formData.name,
                description: formData.description,
                userIds: formData.userIds
            });

            // Optimistically add to list or fetch again
            setProjects([response.data, ...projects]);
            setIsCreateOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to create project", error);
            // Optionally set error state to show in UI
        }
    };

    // Placeholder for Edit - Just updates local state for now or logs error
    // Placeholder for Edit - Just updates local state for now or logs error
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentProject) return;

        try {
            const response = await api.put(`/projects/${currentProject.id}`, {
                name: formData.name,
                description: formData.description,
                userIds: formData.userIds
            });

            // Update local state
            setProjects(projects.map(p => p.id === currentProject.id ? response.data : p));
            setIsEditOpen(false);
            resetForm();
        } catch (error) {
            console.error("Failed to update project", error);
        }
    };

    const [deleteId, setDeleteId] = useState<string | null>(null);

    // ... (rest of the state)

    // ... (fetchData, resetForm, handleOpenCreate, handleOpenEdit, toggleTeamMember, handleCreateSubmit, handleEditSubmit)

    // Trigger confirmation modal
    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    // Confirm and execute delete based on deleteId state
    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            await api.delete(`/projects/${deleteId}`);
            setProjects(projects.filter(p => p.id !== deleteId));
            setDeleteId(null);
        } catch (error) {
            console.error("Failed to delete project", error);
        }
    };

    const UserAvatar = ({ user }: { user: User }) => {
        const colors = [
            'bg-primary text-primary-content',
            'bg-secondary text-secondary-content',
            'bg-accent text-accent-content',
            'bg-info text-info-content',
            'bg-success text-success-content',
            'bg-warning text-warning-content',
            'bg-error text-error-content',
        ];
        const hash = user.name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        const colorClass = colors[hash % colors.length];

        return (
            <div className="avatar">
                <div className={`w-10 rounded-full ${colorClass} flex items-center justify-center`}>
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                    ) : (
                        <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                    )}
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen">
            {/* Top Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-in fade-in slide-in-from-top-1 duration-700">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-base-content">Projects</h1>
                    <p className="text-base-content/60 mt-2 text-lg">Manage and track your ongoing projects with ease.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="btn btn-primary bg-gradient-to-r from-primary to-primary-focus border-none hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Project
                </button>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                    <div className="bg-base-200/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-base-content">No projects yet</h3>
                    <p className="text-base-content/50 mt-2 max-w-sm mx-auto">Get started by creating your first project to organize tasks and collaborate with your team.</p>
                    <button onClick={handleOpenCreate} className="btn btn-ghost text-primary mt-4 font-medium hover:bg-primary/10">
                        Create your first project &rarr;
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            style={{ animationDelay: `${index * 100}ms` }}
                            className="card bg-gradient-to-br from-base-100 to-base-200/50 shadow-sm border border-base-200/60 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards"
                        >
                            <div className="card-body p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`badge ${project.taskCount > 0 ? 'badge-primary badge-outline' : 'badge-ghost'} gap-2 font-medium`}>
                                        {project.taskCount} {project.taskCount === 1 ? 'Task' : 'Tasks'}
                                    </div>
                                    <div className="text-xs text-base-content/40 font-medium">
                                        {new Date(project.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                    </div>
                                </div>

                                <h2 className="card-title text-xl text-base-content group-hover:text-primary transition-colors cursor-pointer" onClick={() => handleOpenEdit(project)}>
                                    {project.name}
                                </h2>
                                <p className="text-sm text-base-content/60 mt-2 line-clamp-2 leading-relaxed min-h-[2.5em]">
                                    {project.description || "No description provided."}
                                </p>

                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex -space-x-2 overflow-hidden ring-offset-2">
                                        {project.assignedUsers.slice(0, 3).map((user) => {
                                            const colors = [
                                                'bg-indigo-500 text-white',
                                                'bg-purple-500 text-white',
                                                'bg-pink-500 text-white',
                                                'bg-rose-500 text-white',
                                                'bg-orange-500 text-white',
                                                'bg-amber-500 text-white',
                                                'bg-emerald-500 text-white',
                                                'bg-teal-500 text-white',
                                                'bg-cyan-500 text-white',
                                                'bg-sky-500 text-white',
                                                'bg-blue-500 text-white',
                                            ];
                                            const hash = user.name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
                                            const colorClass = colors[hash % colors.length];

                                            return (
                                                <div key={user.id} className="avatar tooltip tooltip-bottom" data-tip={user.name}>
                                                    <div className={`w-8 h-8 rounded-full border-2 border-base-100 ${colorClass} flex items-center justify-center text-xs font-bold ring-2 ring-transparent group-hover:ring-base-100 transition-all`}>
                                                        {user.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{user.name.charAt(0).toUpperCase()}</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {project.assignedUsers.length > 3 && (
                                            <div className="avatar placeholder">
                                                <div className="w-8 h-8 rounded-full border-2 border-base-100 bg-base-200 text-base-content/60 text-xs font-bold flex items-center justify-center">
                                                    <span>+{project.assignedUsers.length - 3}</span>
                                                </div>
                                            </div>
                                        )}
                                        {project.assignedUsers.length === 0 && (
                                            <div className="text-xs text-base-content/30 italic self-center ml-2">No members</div>
                                        )}
                                    </div>

                                    <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleOpenEdit(project); }}
                                            className="btn btn-ghost btn-xs btn-square tooltip"
                                            data-tip="Edit"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                                            className="btn btn-ghost btn-xs btn-square text-error/70 hover:bg-error/10 hover:text-error tooltip"
                                            data-tip="Delete"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Project Modal */}
            {isCreateOpen && (
                <dialog className="modal modal-open modal-bottom sm:modal-middle">
                    <div className="modal-box w-11/12 max-w-2xl bg-base-100 overflow-visible p-8 animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-2xl text-base-content">Create New Project</h3>
                            <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setIsCreateOpen(false)}>✕</button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-base-content/70">Project Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Q4 Marketing"
                                    className="input input-bordered w-full"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-base-content/70">Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24 w-full"
                                    placeholder="Describe the project goals and scope..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            {/* Team Selection */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-base-content/70">Assign Team Members</span>
                                </label>
                                <div className="border border-base-200 rounded-lg max-h-48 overflow-y-auto">
                                    {users.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-3 border-b border-base-200 last:border-b-0 hover:bg-base-200/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar user={user} />
                                                <div>
                                                    <div className="font-medium text-sm">{user.name}</div>
                                                    <div className="text-xs text-base-content/50 uppercase">{user.role}</div>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                checked={formData.userIds.includes(user.id)}
                                                onChange={() => toggleTeamMember(user.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-action mt-8">
                                <button type="button" className="btn btn-ghost hover:bg-base-200" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary px-8 shadow-md">
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop backdrop-blur-sm bg-base-300/30">
                        <button onClick={() => setIsCreateOpen(false)}>close</button>
                    </form>
                </dialog>
            )}

            {/* Edit Project Modal (Simplified) */}
            {isEditOpen && (
                <dialog className="modal modal-open modal-bottom sm:modal-middle">
                    <div className="modal-box w-11/12 max-w-2xl bg-base-100 overflow-visible p-8 animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-2xl text-base-content">Edit Project</h3>
                            <button className="btn btn-sm btn-circle btn-ghost" onClick={() => setIsEditOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-base-content/70">Project Name</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-base-content/70">Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24 w-full"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>
                            {/* Team Member Selection (Reuse logic) */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-base-content/70">Assign Team Members</span>
                                </label>
                                <div className="border border-base-200 rounded-lg max-h-48 overflow-y-auto">
                                    {users.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-3 border-b border-base-200 last:border-b-0 hover:bg-base-200/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar user={user} />
                                                <div>
                                                    <div className="font-medium text-sm">{user.name}</div>
                                                    <div className="text-xs text-base-content/50 uppercase">{user.role}</div>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                checked={formData.userIds.includes(user.id)}
                                                onChange={() => toggleTeamMember(user.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-action mt-8">
                                <button type="button" className="btn btn-ghost hover:bg-base-200" onClick={() => setIsEditOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary px-8 shadow-md">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop backdrop-blur-sm bg-base-300/30">
                        <button onClick={() => setIsEditOpen(false)}>close</button>
                    </form>
                </dialog>
            )}
            {/* Delete Confirmation Modal */}
            {deleteId && (
                <dialog className="modal modal-open modal-bottom sm:modal-middle">
                    <div className="modal-box bg-base-100 animate-in zoom-in duration-300">
                        <h3 className="font-bold text-lg text-error">Confirm Delete</h3>
                        <p className="py-4">Are you sure you want to delete this project? This action cannot be undone.</p>
                        <div className="modal-action">
                            <button className="btn btn-ghost hover:bg-base-200" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="btn btn-error text-white shadow-md" onClick={confirmDelete}>Delete Project</button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop backdrop-blur-sm bg-base-300/30">
                        <button onClick={() => setDeleteId(null)}>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
}
