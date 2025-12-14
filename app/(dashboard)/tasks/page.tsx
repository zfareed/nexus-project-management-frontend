'use client';

import React, { useState, useMemo, useEffect } from 'react';

// --- Types ---

type Priority = 'Low' | 'Medium' | 'High';
type Status = 'Todo' | 'In Progress' | 'Done';

interface User {
    id: string;
    name: string;
    avatar: string;
}

interface Task {
    id: string;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    assignedTo: string; // User ID
    project: string; // Project ID
    createdAt: string;
}

// --- Mock Data ---

const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Alice Admin', avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' },
    { id: 'u2', name: 'Bob User', avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' },
    { id: 'u3', name: 'Charlie Dev', avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' },
    { id: 'u4', name: 'Diana Design', avatar: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp' },
];

const MOCK_PROJECTS = [
    { id: 'p1', name: 'Website Redesign' },
    { id: 'p2', name: 'Mobile App Development' },
    { id: 'p3', name: 'Marketing Campaign' },
];

const INITIAL_TASKS: Task[] = [
    {
        id: 't1',
        title: 'Design Dashboard Mockups',
        description: 'Create high-fidelity mockups for the new dashboard based on client requirements.',
        status: 'Todo',
        priority: 'High',
        assignedTo: 'u1',
        project: 'p1',
        createdAt: '2023-10-25T10:00:00Z',
    },
    {
        id: 't2',
        title: 'Integrate Auth API',
        description: 'Connect the frontend login form to the backend authentication endpoints.',
        status: 'In Progress',
        priority: 'High',
        assignedTo: 'u3',
        project: 'p1',
        createdAt: '2023-10-26T14:30:00Z',
    },
    {
        id: 't3',
        title: 'Update Documentation',
        description: 'Review and update the project README and API documentation.',
        status: 'Done',
        priority: 'Low',
        assignedTo: 'u2',
        project: 'p2',
        createdAt: '2023-10-20T09:15:00Z',
    },
    {
        id: 't4',
        title: 'Fix Navigation Bug',
        description: 'Resolve the issue where the mobile menu does not close after selection.',
        status: 'Todo',
        priority: 'Medium',
        assignedTo: 'u4',
        project: 'p2',
        createdAt: '2023-10-27T11:00:00Z',
    },
];

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
        Low: 'badge-info',
        Medium: 'badge-warning',
        High: 'badge-error',
    };
    return <div className={`badge ${colors[priority]} badge-sm text-white font-medium`}>{priority}</div>;
};

// --- Modals ---

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    initialData?: Partial<Task>;
    title: string;
    submitLabel: string;
}

const TaskModal = ({ isOpen, onClose, onSubmit, initialData, title, submitLabel }: TaskModalProps) => {
    const [formData, setFormData] = useState<Partial<Task>>({
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        assignedTo: MOCK_USERS[0].id,
        project: MOCK_PROJECTS[0].id,
        ...initialData,
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: '',
                description: '',
                status: 'Todo',
                priority: 'Medium',
                assignedTo: MOCK_USERS[0].id,
                project: MOCK_PROJECTS[0].id,
                ...initialData,
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title) return;
        onSubmit(formData as Omit<Task, 'id' | 'createdAt'>);
        onClose();
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
                                value={formData.project}
                                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                            >
                                {MOCK_PROJECTS.map((project) => (
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
                                value={formData.assignedTo}
                                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                            >
                                {MOCK_USERS.map((user) => (
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
                                <option value="Todo">TODO</option>
                                <option value="In Progress">IN PROGRESS</option>
                                <option value="Done">DONE</option>
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
                                <option value="Low">LOW</option>
                                <option value="Medium">MEDIUM</option>
                                <option value="High">HIGH</option>
                            </select>
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
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const columns = useMemo(() => {
        const cols: Record<Status, Task[]> = { 'Todo': [], 'In Progress': [], 'Done': [] };
        tasks.forEach(task => {
            if (cols[task.status]) {
                cols[task.status].push(task);
            }
        });
        return cols;
    }, [tasks]);

    const handleCreate = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
        const newTask: Task = {
            ...newTaskData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
        };
        setTasks([...tasks, newTask]);
        setIsCreateOpen(false); // Ensure close
    };

    const handleUpdate = (updatedTaskData: Omit<Task, 'id' | 'createdAt'>) => {
        if (!editingTask) return;
        const updatedTask = { ...editingTask, ...updatedTaskData };
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        setEditingTask(null);
    };

    const handleDelete = (id: string) => {
        setTaskToDelete(id);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            setTasks(tasks.filter(t => t.id !== taskToDelete));
            setTaskToDelete(null);
        }
    };

    const getUser = (id: string) => MOCK_USERS.find(u => u.id === id);

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
                                <div className={`w-3 h-3 rounded-full ${status === 'Todo' ? 'bg-neutral' :
                                    status === 'In Progress' ? 'bg-primary' : 'bg-success'
                                    }`}></div>
                                <h2 className="text-lg font-bold text-base-content/80 uppercase tracking-widest">{status}</h2>
                                <div className="badge badge-ghost font-mono">{columns[status].length}</div>
                            </div>
                        </div>

                        {/* Column Area */}
                        <div className="bg-base-100/40 backdrop-blur-sm rounded-2xl p-4 min-h-[500px] flex flex-col gap-4 border border-base-content/5">
                            {columns[status].map((task) => {
                                const assignee = getUser(task.assignedTo);
                                return (
                                    <div key={task.id} className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group cursor-pointer">
                                        <div className="card-body p-5 gap-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3
                                                    className="font-bold text-lg leading-snug cursor-pointer hover:text-primary transition-colors"
                                                    onClick={() => setEditingTask(task)}
                                                >
                                                    {task.title}
                                                </h3>
                                                <div className="lg:opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                                                    <button
                                                        className="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-primary"
                                                        onClick={() => setEditingTask(task)}
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

                                            <div className="flex items-center justify-between mt-auto pt-2 border-t border-base-200/50">
                                                <PriorityBadge priority={task.priority} />

                                                {assignee && (
                                                    <div className="tooltip tooltip-left" data-tip={`Assigned to ${assignee.name}`}>
                                                        <div className="avatar placeholder">
                                                            <div className="w-8 h-8 rounded-full ring-2 ring-base-100 bg-neutral-focus text-neutral-content">
                                                                {assignee.avatar ? (
                                                                    <img src={assignee.avatar} alt={assignee.name} />
                                                                ) : (
                                                                    <span>{assignee.name.charAt(0)}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {columns[status].length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-base-content/30 border-2 border-dashed border-base-300/50 rounded-xl">
                                    <span className="text-4xl mb-2 opacity-20">📝</span>
                                    <p className="text-sm font-medium">No tasks in {status}</p>
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
            />

            {editingTask && (
                <TaskModal
                    isOpen={!!editingTask}
                    onClose={() => setEditingTask(null)}
                    onSubmit={handleUpdate}
                    initialData={editingTask}
                    title="Edit Task"
                    submitLabel="Save Changes"
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
