'use client';

import React, { useState, useMemo, useEffect } from 'react';
import api from '@/lib/axios';


// --- Types ---

type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
type Status = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

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

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
);

const FlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
);

const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
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
    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState<Partial<Task>>({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: getTodayString(),
        assigneeId: users[0]?.id || '',
        projectId: projects[0]?.id || '',
        ...initialData,
    });



    useEffect(() => {
        if (isOpen) {
            const processedInitialData = { ...initialData };
            if (processedInitialData.dueDate) {
                processedInitialData.dueDate = new Date(processedInitialData.dueDate).toISOString().split('T')[0];
            }

            setFormData({
                title: '',
                description: '',
                status: 'TODO',
                priority: 'MEDIUM',
                dueDate: getTodayString(),
                assigneeId: users[0]?.id || '',
                projectId: projects[0]?.id || '',
                ...processedInitialData,
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
        <div className="modal modal-open z-50 modal-bottom sm:modal-middle">
            <div className="modal-box w-11/12 max-w-2xl bg-base-100 shadow-2xl overflow-visible p-8 animate-in zoom-in duration-300">
                <h3 className="font-bold text-2xl mb-6 text-base-content">{title}</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-medium text-base-content/70">Title</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Implement Login Page"
                            className="input input-bordered w-full focus:input-primary transition-all duration-300"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                                <option value="REVIEW">REVIEW</option>
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
                        <label className="label">
                            <span className="label-text font-medium text-base-content/70">Due Date</span>
                        </label>
                        <input
                            type="date"
                            className="input input-bordered w-full focus:input-primary"
                            value={formData.dueDate || ''}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
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

                    <div className="modal-action mt-8">
                        <button type="button" className="btn btn-ghost hover:bg-base-200" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary px-8 shadow-md">
                            {submitLabel}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop bg-neutral/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
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
            <div className="modal-box w-11/12 max-w-sm shadow-2xl animate-in zoom-in duration-300">
                <h3 className="font-bold text-lg text-error">Delete {itemName}</h3>
                <p className="py-4 text-base-content/80">Are you sure you want to delete this {itemName}? This action cannot be undone.</p>
                <div className="modal-action">
                    <button className="btn btn-ghost hover:bg-base-200" onClick={onClose}>Cancel</button>
                    <button className="btn btn-error text-white shadow-md" onClick={onConfirm}>Delete</button>
                </div>
            </div>
            <div className="modal-backdrop bg-neutral/60 backdrop-blur-sm" onClick={onClose}></div>
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

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState<Priority | 'ALL'>('ALL');
    const [filterProjectId, setFilterProjectId] = useState<string>('ALL');
    const [filterAssigneeId, setFilterAssigneeId] = useState<string>('ALL');

    const [currentUser, setCurrentUser] = useState<{ role: 'ADMIN' | 'USER' } | null>(null);

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
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
            }
        }
    }, []);

    const columns = useMemo(() => {
        const cols: Record<Status, Task[]> = { 'TODO': [], 'IN_PROGRESS': [], 'REVIEW': [], 'DONE': [] };

        let filteredTasks = tasks;

        // Apply Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filteredTasks = filteredTasks.filter(task =>
                task.title.toLowerCase().includes(lowerQuery) ||
                task.description.toLowerCase().includes(lowerQuery)
            );
        }

        // Apply Priority Filter
        if (filterPriority !== 'ALL') {
            filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
        }

        // Apply Project Filter
        if (filterProjectId !== 'ALL') {
            filteredTasks = filteredTasks.filter(task => task.projectId === filterProjectId);
        }

        // Apply Assignee Filter
        if (filterAssigneeId !== 'ALL') {
            filteredTasks = filteredTasks.filter(task => task.assigneeId === filterAssigneeId);
        }

        filteredTasks.forEach(task => {
            if (cols[task.status]) {
                cols[task.status].push(task);
            }
        });
        return cols;
    }, [tasks, searchQuery, filterPriority, filterProjectId, filterAssigneeId]);

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
        <div className="p-6 lg:p-10 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 animate-in fade-in slide-in-from-top-1 duration-700">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-base-content">Tasks</h1>
                    <p className="text-base-content/60 mt-2 text-lg">Manage your project tasks and track progress effectively.</p>
                </div>
                {currentUser?.role === 'ADMIN' && (
                    <button
                        className="btn btn-primary gap-2 shadow-lg hover:shadow-primary/50 btn-lg text-white bg-gradient-to-r from-primary to-primary-focus border-none transition-all duration-300 transform hover:-translate-y-0.5"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <PlusIcon />
                        Create Task
                    </button>
                )}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col xl:flex-row gap-6 mb-10 bg-base-100/70 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-base-200/60 sticky top-4 z-30 animate-in fade-in slide-in-from-top-2 duration-700">
                <div className="flex-1">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors duration-300">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="input input-lg w-full pl-12 bg-base-100 border-base-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 overflow-x-auto pb-2 sm:pb-0 items-center">
                    <div className="flex items-center gap-2 text-sm font-medium text-base-content/60 mr-2 hidden xl:flex">
                        <FilterIcon />
                        <span>Filters:</span>
                    </div>

                    {/* Priority Filter */}
                    <div className="relative w-full sm:w-auto">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none z-10">
                            <FlagIcon />
                        </div>
                        <select
                            className="select select-bordered w-full sm:w-[180px] pl-10 focus:select-primary cursor-pointer transition-colors h-12"
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value as Priority | 'ALL')}
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    {/* Project Filter */}
                    <div className="relative w-full sm:w-auto">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none z-10">
                            <FolderIcon />
                        </div>
                        <select
                            className="select select-bordered w-full sm:w-[180px] pl-10 focus:select-primary cursor-pointer transition-colors h-12"
                            value={filterProjectId}
                            onChange={(e) => setFilterProjectId(e.target.value)}
                        >
                            <option value="ALL">All Projects</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Assignee Filter */}
                    {currentUser?.role === 'ADMIN' && (
                        <div className="relative w-full sm:w-auto">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none z-10">
                                <UserIcon />
                            </div>
                            <select
                                className="select select-bordered w-full sm:w-[180px] pl-10 focus:select-primary cursor-pointer transition-colors h-12"
                                value={filterAssigneeId}
                                onChange={(e) => setFilterAssigneeId(e.target.value)}
                            >
                                <option value="ALL">All Assignees</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                {(Object.keys(columns) as Status[]).map((status) => (
                    <div key={status} className="flex flex-col gap-4">
                        {/* Column Header */}
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${status === 'TODO' ? 'bg-neutral' :
                                    status === 'IN_PROGRESS' ? 'bg-primary' :
                                        status === 'REVIEW' ? 'bg-warning' : 'bg-success'
                                    }`}></div>
                                <h2 className="text-lg font-bold text-base-content/80 uppercase tracking-widest">
                                    {status === 'TODO' ? 'To Do' :
                                        status === 'IN_PROGRESS' ? 'In Progress' :
                                            status === 'REVIEW' ? 'Review' : 'Done'}
                                </h2>
                                <div className="badge badge-ghost font-mono">{columns[status].length}</div>
                            </div>
                        </div>

                        {/* Column Area */}
                        <div className="bg-base-100/40 backdrop-blur-sm rounded-2xl p-4 min-h-[500px] flex flex-col gap-4 border border-base-content/5 animate-in slide-in-from-bottom-2 duration-700 fill-mode-backwards" style={{ animationDelay: `${Object.keys(columns).indexOf(status) * 150}ms` }}>
                            {columns[status].map((task, index) => (
                                <div
                                    key={task.id}
                                    className="card bg-gradient-to-br from-base-100 to-base-200/50 shadow-sm border border-base-200/60 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group cursor-pointer hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards"
                                    style={{ animationDelay: `${Object.keys(columns).indexOf(status) * 100 + index * 50}ms` }}
                                >
                                    <div className="card-body p-5 gap-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3
                                                className={`font-bold text-lg leading-snug cursor-pointer ${currentUser?.role === 'ADMIN' ? 'hover:text-primary' : ''} transition-colors`}
                                                onClick={() => currentUser?.role === 'ADMIN' && handleEditClick(task.id)}
                                            >
                                                {task.title}
                                            </h3>
                                            {currentUser?.role === 'ADMIN' && (
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
                                            )}
                                        </div>

                                        <p className="text-sm text-base-content/70 line-clamp-3 mb-2">{task.description}</p>

                                        {task.project && (
                                            <div className="badge badge-outline badge-sm opacity-70 mb-2">{task.project.name}</div>
                                        )}

                                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-base-200/50">
                                            <PriorityBadge priority={task.priority} />

                                            {task.assignee && (() => {
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
                                                const hash = task.assignee.name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
                                                const colorClass = colors[hash % colors.length];

                                                return (
                                                    <div className="tooltip tooltip-left" data-tip={`Assigned to ${task.assignee.name}`}>
                                                        <div className="avatar placeholder">
                                                            <div className={`w-8 h-8 rounded-full ring-2 ring-base-100 ${colorClass} flex items-center justify-center text-xs font-bold`}>
                                                                {task.assignee.avatar ? (
                                                                    <img src={task.assignee.avatar} alt={task.assignee.name} />
                                                                ) : (
                                                                    <span>{task.assignee.name.charAt(0).toUpperCase()}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {columns[status].length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-base-content/30 border-2 border-dashed border-base-300/50 rounded-xl">
                                    <span className="text-4xl mb-2 opacity-20">📝</span>
                                    <p className="text-sm font-medium">No tasks in {status === 'TODO' ? 'To Do' :
                                        status === 'IN_PROGRESS' ? 'In Progress' :
                                            status === 'REVIEW' ? 'Review' : 'Done'}</p>
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
