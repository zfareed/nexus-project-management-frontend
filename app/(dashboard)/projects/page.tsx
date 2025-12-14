'use client';

import React, { useState } from 'react';


// Mock Data Type
// Mock Data Type
type User = {
    id: string;
    name: string;
    role: 'ADMIN' | 'USER';
    avatar: string;
};

type Project = {
    id: string;
    name: string;
    description: string;
    status: 'Active' | 'Completed' | 'On Hold';
    createdAt: string;

    teamMembers: string[]; // User IDs
};

const mockUsers: User[] = [
    { id: '1', name: 'Alice Admin', role: 'ADMIN', avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' },
    { id: '2', name: 'Bob Builder', role: 'USER', avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' }, // Placeholder avatars
    { id: '3', name: 'Charlie Checker', role: 'USER', avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' },
];

// Initial Mock Data
const initialProjects: Project[] = [
    {
        id: '1',
        name: 'Website Redesign',
        description: 'Revamping the corporate website with a fresh modern look and improved UX.',
        status: 'Active',
        createdAt: '2023-10-24',

        teamMembers: ['1', '2'],
    },
    {
        id: '2',
        name: 'Mobile App Development',
        description: 'Building a cross-platform mobile application for iOS and Android using Flutter.',
        status: 'On Hold',
        createdAt: '2023-09-15',

        teamMembers: ['2', '3'],
    },
    {
        id: '3',
        name: 'Marketing Campaign',
        description: 'Q4 marketing strategy including social media, email newsletters, and paid ads.',
        status: 'Completed',
        createdAt: '2023-08-01',

        teamMembers: ['1', '3'],
    },
];



const StatusBadge = ({ status }: { status: Project['status'] }) => {
    let colorClass = 'badge-ghost';
    switch (status) {
        case 'Active':
            colorClass = 'badge-primary';
            break;
        case 'Completed':
            colorClass = 'badge-success text-white';
            break;
        case 'On Hold':
            colorClass = 'badge-warning';
            break;
    }
    return <div className={`badge ${colorClass} gap-2`}>{status}</div>;
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);

    // Form State
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        status: Project['status'];

        teamMembers: string[];
    }>({
        name: '',
        description: '',
        status: 'Active',

        teamMembers: [],
    });

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            status: 'Active',

            teamMembers: [],
        });
        setCurrentProject(null);
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (project: Project) => {
        setCurrentProject(project);
        setFormData({
            name: project.name,
            description: project.description,
            status: project.status,

            teamMembers: project.teamMembers,
        });
        setIsEditOpen(true);
    };

    const toggleTeamMember = (userId: string) => {
        setFormData(prev => {
            const isSelected = prev.teamMembers.includes(userId);
            if (isSelected) {
                return { ...prev, teamMembers: prev.teamMembers.filter(id => id !== userId) };
            } else {
                return { ...prev, teamMembers: [...prev.teamMembers, userId] };
            }
        });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;

        const newProject: Project = {
            id: Date.now().toString(),
            name: formData.name,
            description: formData.description,
            status: formData.status,
            createdAt: new Date().toISOString(),

            teamMembers: formData.teamMembers,
        };

        setProjects([newProject, ...projects]);
        setIsCreateOpen(false);
        resetForm();
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentProject || !formData.name) return;

        const updatedProjects = projects.map((p) =>
            p.id === currentProject.id
                ? { ...p, ...formData }
                : p
        );

        setProjects(updatedProjects);
        setIsEditOpen(false);
        resetForm();
    };

    const handleDelete = (id: string) => {
        const updatedProjects = projects.filter((p) => p.id !== id);
        setProjects(updatedProjects);
    };

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 group">
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <StatusBadge status={project.status} />
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        <span className="label-text font-medium text-base-content/70">Status</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
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



                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-base-content/70">Team Members</span>
                                </label>
                                <div className="border border-base-200 rounded-lg max-h-48 overflow-y-auto">
                                    {mockUsers.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-3 border-b border-base-200 last:border-b-0 hover:bg-base-200/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="w-10 rounded-full">
                                                        <img src={user.avatar} alt={user.name} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">{user.name}</div>
                                                    <div className="text-xs text-base-content/50 uppercase">{user.role}</div>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                checked={formData.teamMembers.includes(user.id)}
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

            {/* Edit Project Modal */}
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                        <span className="label-text font-medium text-base-content/70">Status</span>
                                    </label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
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




                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text font-medium text-base-content/70">Team Members</span>
                                </label>
                                <div className="border border-base-200 rounded-lg max-h-48 overflow-y-auto">
                                    {mockUsers.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-3 border-b border-base-200 last:border-b-0 hover:bg-base-200/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="w-10 rounded-full">
                                                        <img src={user.avatar} alt={user.name} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">{user.name}</div>
                                                    <div className="text-xs text-base-content/50 uppercase">{user.role}</div>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                checked={formData.teamMembers.includes(user.id)}
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
        </div>
    );
}
