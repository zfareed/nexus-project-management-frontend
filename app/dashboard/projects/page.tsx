'use client';

import React, { useState } from 'react';

// Mock Data Type
type Project = {
    id: string;
    name: string;
    description: string;
    status: 'Active' | 'Completed' | 'On Hold';
    createdAt: string;
};

// Initial Mock Data
const initialProjects: Project[] = [
    {
        id: '1',
        name: 'Website Redesign',
        description: 'Revamping the corporate website with a fresh modern look and improved UX.',
        status: 'Active',
        createdAt: '2023-10-24',
    },
    {
        id: '2',
        name: 'Mobile App Development',
        description: 'Building a cross-platform mobile application for iOS and Android using Flutter.',
        status: 'On Hold',
        createdAt: '2023-09-15',
    },
    {
        id: '3',
        name: 'Marketing Campaign',
        description: 'Q4 marketing strategy including social media, email newsletters, and paid ads.',
        status: 'Completed',
        createdAt: '2023-08-01',
    },
    {
        id: '4',
        name: 'Internal Dashboard',
        description: 'Creating an analytics dashboard for the internal sales team to track performance.',
        status: 'Active',
        createdAt: '2023-11-10',
    },
    {
        id: '5',
        name: 'Legacy System Migration',
        description: 'Migrating old database systems to a cloud-based infrastructure.',
        status: 'Active',
        createdAt: '2023-11-05',
    },
    {
        id: '6',
        name: 'Client Portal',
        description: 'Secure portal for clients to access their invoices and project status updates.',
        status: 'Completed',
        createdAt: '2023-07-20',
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
    }>({
        name: '',
        description: '',
        status: 'Active',
    });

    const resetForm = () => {
        setFormData({ name: '', description: '', status: 'Active' });
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
        });
        setIsEditOpen(true);
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
                                <button className="btn btn-ghost btn-sm btn-square tooltip" data-tip="View">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
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
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Create New Project</h3>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text font-medium">Project Name <span className="text-error">*</span></span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Website Overhaul"
                                    className="input input-bordered w-full"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text font-medium">Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Brief description of the project..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="form-control w-full mb-6">
                                <label className="label">
                                    <span className="label-text font-medium">Status</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <div className="modal-action">
                                <button type="button" className="btn" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary text-white">
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
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Edit Project</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text font-medium">Project Name <span className="text-error">*</span></span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Website Overhaul"
                                    className="input input-bordered w-full"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-control w-full mb-4">
                                <label className="label">
                                    <span className="label-text font-medium">Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Brief description of the project..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="form-control w-full mb-6">
                                <label className="label">
                                    <span className="label-text font-medium">Status</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <div className="modal-action">
                                <button type="button" className="btn" onClick={() => setIsEditOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary text-white">
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
