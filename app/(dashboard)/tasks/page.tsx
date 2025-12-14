'use client';

import React, { useState, useMemo, useEffect } from 'react';
import api from '@/lib/axios';
import 'cally';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'calendar-date': any;
            'calendar-month': any;
        }
    }
}

// --- Types ---

type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

interface User {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
}

interface Project {
    id: string;
    name: string;
}

interface Task {
    id: string;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    dueDate: string | null;
    projectId: string;
    assigneeId: string;
    createdAt: string;
    updatedAt: string;
    project: Project;
    assignee: User;
}

// --- Components ---

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
);

const PriorityBadge = ({ priority }: { priority: Priority }) => {
    const colors = {
        LOW: 'badge-info',
        MEDIUM: 'badge-warning',
        HIGH: 'badge-error',
    };
    return <div className={`badge ${colors[priority]} badge-sm text-white font-medium`}>{priority}</div>;
};

// --- Modals ---

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: Partial<Task>) => void;
    initialData?: Partial<Task>;
    title: string;
    submitLabel: string;
    projects: Project[];
    users: User[];
}

const TaskModal = ({ isOpen, onClose, onSubmit, initialData, title, submitLabel, projects, users }: TaskModalProps) => {
    const [formData, setFormData] = useState<Partial<Task>>({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: null,
        assigneeId: users[0]?.id || '',
        projectId: projects[0]?.id || '',
        ...initialData,
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: '',
                description: '',
                status: 'TODO',
                priority: 'MEDIUM',
                dueDate: null,
                assigneeId: users[0]?.id || '',
                projectId: projects[0]?.id || '',
                ...initialData,
            });
        }
    }, [isOpen, initialData, users, projects]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return;
        onSubmit(formData);
    };

    return (
        <div className="modal modal-open z-50">
            <div className="modal-box w-11/12 max-w-lg shadow-2xl overflow-visible">
                <h3 className="font-bold text-lg mb-6">{title}</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium text-base-content/70">Title</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full focus:input-primary"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium text-base-content/70">Project</span>
                            </label>
                            <select
                                className="select select-bordered w-full focus:select-primary"
                                value={formData.projectId}
                                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                            >
                                <option value="" disabled>Select Project</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium text-base-content/70">Assignee</span>
                            </label>
                            <select
                                className="select select-bordered w-full focus:select-primary"
                                value={formData.assigneeId}
                                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                            >
                                <option value="" disabled>Select Assignee</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium text-base-content/70">Status</span>
                            </label>
                            <select
                                className="select select-bordered w-full focus:select-primary"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                            >
                                <option value="TODO">TODO</option>
                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                <option value="DONE">DONE</option>
                            </select>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text font-medium text-base-content/70">Priority</span>
                            </label>
                            <select
                                className="select select-bordered w-full focus:select-primary"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                            >
                                <option value="LOW">LOW</option>
                                <option value="MEDIUM">MEDIUM</option>
                                <option value="HIGH">HIGH</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-control w-full">
                        <style>{`
                            calendar-month {
                                --color-accent: oklch(var(--p));
                                --color-text-on-accent: oklch(var(--pc));
                            }
                            calendar-month::part(button) {
                                padding: 0.5rem;
                                border-radius: 0.5rem;
                                transition: background-color 0.2s;
                            }
                            calendar-month::part(button):hover {
                                background-color: var(--fallback-b2,oklch(var(--b2)/1));
                            }
                        `}</style>
                        <label className="label">
                            <span className="label-text font-medium text-base-content/70">Due Date</span>
                        </label>
                        <div className="dropdown dropdown-bottom w-full">
                            <div tabIndex={0} role="button" className="input input-bordered w-full flex items-center justify-between cursor-pointer group">
                                <span className={!formData.dueDate ? "text-base-content/50" : ""}>
                                    {formData.dueDate ? formData.dueDate.split('T')[0] : 'Select Due Date'}
                                </span>
                                <span className="opacity-50 group-hover:opacity-100 transition-opacity">🗓️</span>
                            </div>
                            <div tabIndex={0} className="dropdown-content z-[100] p-4 shadow-xl bg-base-100 rounded-box border border-base-200 mt-2 w-auto">
                                {/* @ts-ignore */}
                                <calendar-date
                                    value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
                                    onChange={(e: any) => {
                                        setFormData({ ...formData, dueDate: e.target.value });

                                        // Close the dropdown more reliably
                                        const formInput = e.target.closest('.dropdown')?.querySelector('[role="button"]') as HTMLElement;
                                        if (formInput) formInput.blur();

                                        if (document.activeElement instanceof HTMLElement) {
                                            document.activeElement.blur();
                                        }
                                    }}
                                >
                                    {/* @ts-ignore */}
                                    <calendar-month></calendar-month>
                                </calendar-date>
                            </div>
                        </div>
                    </div>



                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium text-base-content/70">Description</span>
                        </label>
                        <textarea
                            className="textarea textarea-bordered h-24 focus:textarea-primary w-full"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="modal-action mt-6">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary px-6">
                            {submitLabel}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop bg-neutral/40 backdrop-blur-sm" onClick={onClose}></div>
        </div>
    );
};

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }: DeleteConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open z-50">
            <div className="modal-box w-11/12 max-w-sm shadow-2xl">
                <h3 className="font-bold text-lg text-error">Delete {itemName}</h3>
                <p className="py-4">Are you sure you want to delete this {itemName}? This action cannot be undone.</p>
                <div className="modal-action">
                    <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
                    <button className="btn btn-error" onClick={onConfirm}>Delete</button>
                </div>
            </div>
            <div className="modal-backdrop bg-neutral/40 backdrop-blur-sm" onClick={onClose}></div>
        </div>
    );
};

// --- Main Page Component ---

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const [tasksRes, usersRes, projectsRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/users'),
                api.get('/projects')
            ]);

            // Handle tasks response structure
            setTasks(tasksRes.data.tasks || []);

            // Handle users response structure
            setUsers(usersRes.data.users || []);

            // Handle projects response
            setProjects(projectsRes.data || []);

        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const columns = useMemo(() => {
        const cols: Record<Status, Task[]> = { 'TODO': [], 'IN_PROGRESS': [], 'DONE': [] };
        tasks.forEach(task => {
            if (cols[task.status]) {
                cols[task.status].push(task);
            }
        });
        return cols;
    }, [tasks]);

    const handleCreate = async (newTaskData: Partial<Task>) => {
        try {
            const payload = {
                title: newTaskData.title,
                description: newTaskData.description,
                status: newTaskData.status,
                priority: newTaskData.priority,
                dueDate: newTaskData.dueDate || null,
                projectId: newTaskData.projectId,
                assigneeId: newTaskData.assigneeId
            };

            const response = await api.post('/tasks', payload);
            const createdTask = response.data.task;

            setTasks((prev) => [...prev, createdTask]);
            setIsCreateOpen(false);
        } catch (error) {
            console.error("Failed to create task", error);
        }
    };

    const handleUpdateSubmit = async (updatedTaskData: Partial<Task>) => {
        if (!editingTask) return;

        try {
            const payload = {
                title: updatedTaskData.title,
                description: updatedTaskData.description,
                status: updatedTaskData.status,
                priority: updatedTaskData.priority,
                dueDate: updatedTaskData.dueDate || null,
                projectId: updatedTaskData.projectId,
                assigneeId: updatedTaskData.assigneeId
            };

            const response = await api.put(`/tasks/${editingTask.id}`, payload);
            const updatedTask = response.data.task;

            setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
            setEditingTask(null);
        } catch (error) {
            console.error("Failed to update task", error);
        }
    };

    const handleEditClick = async (taskId: string) => {
        try {
            const response = await api.get(`/tasks/${taskId}`);
            setEditingTask(response.data.task);
        } catch (error) {
            console.error("Failed to fetch task details", error);
        }
    };

    const handleDelete = (id: string) => {
        setTaskToDelete(id);
    };

    const confirmDelete = async () => {
        if (!taskToDelete) return;

        try {
            await api.delete(`/tasks/${taskToDelete}`);
            setTasks(tasks.filter(t => t.id !== taskToDelete));
            setTaskToDelete(null);
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-10 bg-base-200 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-base-content">Tasks</h1>
                    <p className="text-base-content/60 mt-2 text-lg">Manage your project tasks and track progress effectively.</p>
                </div>
                <button
                    className="btn btn-primary gap-2 shadow-lg btn-lg"
                    onClick={() => setIsCreateOpen(true)}
                >
                    <PlusIcon />
                    Create Task
                </button>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {(Object.keys(columns) as Status[]).map((status) => (
                    <div key={status} className="flex flex-col gap-4">
                        {/* Column Header */}
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${status === 'TODO' ? 'bg-neutral' :
                                    status === 'IN_PROGRESS' ? 'bg-primary' : 'bg-success'
                                    }`}></div>
                                <h2 className="text-lg font-bold text-base-content/80 uppercase tracking-widest">
                                    {status === 'TODO' ? 'To Do' : status === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
                                </h2>
                                <div className="badge badge-ghost font-mono">{columns[status].length}</div>
                            </div>
                        </div>

                        {/* Column Area */}
                        <div className="bg-base-100/40 backdrop-blur-sm rounded-2xl p-4 min-h-[500px] flex flex-col gap-4 border border-base-content/5">
                            {columns[status].map((task) => (
                                <div key={task.id} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group cursor-pointer">
                                    <div className="card-body p-5 gap-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3
                                                className="font-bold text-lg leading-snug cursor-pointer hover:text-primary transition-colors"
                                                onClick={() => handleEditClick(task.id)}
                                            >
                                                {task.title}
                                            </h3>
                                            <div className="lg:opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                                                <button
                                                    className="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-primary"
                                                    onClick={() => handleEditClick(task.id)}
                                                    aria-label="Edit Task"
                                                >
                                                    <EditIcon />
                                                </button>
                                                <button
                                                    className="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-error"
                                                    onClick={() => handleDelete(task.id)}
                                                    aria-label="Delete Task"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-sm text-base-content/70 line-clamp-3 mb-2">{task.description}</p>

                                        {task.project && (
                                            <div className="badge badge-outline badge-sm opacity-70 mb-2">{task.project.name}</div>
                                        )}

                                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-base-200/50">
                                            <PriorityBadge priority={task.priority} />

                                            {task.assignee && (
                                                <div className="tooltip tooltip-left" data-tip={`Assigned to ${task.assignee.name}`}>
                                                    <div className="avatar placeholder">
                                                        <div className="w-8 h-8 rounded-full ring-2 ring-base-100 bg-neutral-focus text-neutral-content">
                                                            {task.assignee.avatar ? (
                                                                <img src={task.assignee.avatar} alt={task.assignee.name} />
                                                            ) : (
                                                                <span>{task.assignee.name.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {columns[status].length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-base-content/30 border-2 border-dashed border-base-300/50 rounded-xl">
                                    <span className="text-4xl mb-2 opacity-20">📝</span>
                                    <p className="text-sm font-medium">No tasks in {status === 'TODO' ? 'To Do' : status === 'IN_PROGRESS' ? 'In Progress' : 'Done'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            <TaskModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSubmit={handleCreate}
                title="Create New Task"
                submitLabel="Create Task"
                projects={projects}
                users={users}
            />

            {editingTask && (
                <TaskModal
                    isOpen={!!editingTask}
                    onClose={() => setEditingTask(null)}
                    onSubmit={handleUpdateSubmit}
                    initialData={editingTask}
                    title="Edit Task"
                    submitLabel="Save Changes"
                    projects={projects}
                    users={users}
                />
            )}

            <DeleteConfirmationModal
                isOpen={!!taskToDelete}
                onClose={() => setTaskToDelete(null)}
                onConfirm={confirmDelete}
                itemName="task"
            />
        </div>
    );
}
