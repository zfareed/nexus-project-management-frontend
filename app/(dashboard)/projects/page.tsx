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
        return (
            <div className="avatar">
                <div className="w-10 rounded-full bg-neutral-focus text-neutral-content flex items-center justify-center">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                    ) : (
                        <span className="text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-base-content">Projects</h1>
                    <p className="text-base-content/60 mt-1">Manage and track your ongoing projects.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="btn btn-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Project
                </button>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                    <p className="text-xl">No projects found. Create one to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 group">
                            <div className="card-body">
                                <div className="flex justify-between items-start">
                                    <div className="badge badge-ghost gap-2">{project.taskCount} Tasks</div>
                                    <div className="text-xs text-base-content/50 font-medium">
                                        {new Date(project.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>

                                <h2 className="card-title mt-2 text-lg text-base-content group-hover:text-primary transition-colors">
                                    {project.name}
                                </h2>
                                <p className="text-sm text-base-content/70 mt-1 line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="mt-4 flex -space-x-2 overflow-hidden">
                                    {project.assignedUsers.slice(0, 3).map((user) => (
                                        <div key={user.id} className="avatar tooltip" data-tip={user.name}>
                                            <div className="w-8 h-8 rounded-full border-2 border-base-100 bg-neutral text-neutral-content flex items-center justify-center text-xs">
                                                {user.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{user.name.charAt(0).toUpperCase()}</span>}
                                            </div>
                                        </div>
                                    ))}
                                    {project.assignedUsers.length > 3 && (
                                        <div className="avatar placeholder">
                                            <div className="w-8 h-8 rounded-full bg-neutral-focus text-neutral-content text-xs flex items-center justify-center">
                                                <span>+{project.assignedUsers.length - 3}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="card-actions justify-end mt-6 pt-4 border-t border-base-200">
                                    <button
                                        onClick={() => handleOpenEdit(project)}
                                        className="btn btn-ghost btn-sm btn-square tooltip"
                                        data-tip="Edit"

                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        className="btn btn-ghost btn-sm btn-square tooltip hover:bg-error/10 hover:text-error"
                                        data-tip="Delete"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Project Modal */}
            {isCreateOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-2xl bg-base-100 overflow-visible">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Create New Project</h3>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setIsCreateOpen(false)}>✕</button>
                            </form>
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

                            <div className="modal-action mt-6">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-neutral text-white px-8">
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setIsCreateOpen(false)}>close</button>
                    </form>
                </dialog>
            )}

            {/* Edit Project Modal (Simplified) */}
            {isEditOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-2xl bg-base-100 overflow-visible">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Edit Project</h3>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setIsEditOpen(false)}>✕</button>
                            </form>
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
                            <div className="modal-action mt-6">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsEditOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-neutral text-white px-8">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setIsEditOpen(false)}>close</button>
                    </form>
                </dialog>
            )}
            {/* Delete Confirmation Modal */}
            {deleteId && (
                <dialog className="modal modal-open">
                    <div className="modal-box bg-base-100">
                        <h3 className="font-bold text-lg text-error">Confirm Delete</h3>
                        <p className="py-4">Are you sure you want to delete this project? This action cannot be undone.</p>
                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="btn btn-error text-white" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setDeleteId(null)}>close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
}
