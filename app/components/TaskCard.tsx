import React from 'react';

// Types
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

export interface Task {
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

// Icons
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

interface TaskCardProps {
    task: Task;
    currentUser: { role: 'ADMIN' | 'USER' } | null;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    style?: React.CSSProperties;
    className?: string; // For animation classes
}

export const TaskCard = ({ task, currentUser, onEdit, onDelete, style, className }: TaskCardProps) => {
    return (
        <div
            className={`card bg-gradient-to-br from-base-100 to-base-200/50 shadow-sm border border-base-200/60 hover:shadow-xl hover:border-primary/20 transition-all duration-300 group cursor-pointer hover:-translate-y-1 ${className || ''}`}
            style={style}
        >
            <div className="card-body p-5 gap-3">
                <div className="flex justify-between items-start gap-2">
                    <h3
                        className={`font-bold text-lg leading-snug cursor-pointer ${currentUser?.role === 'ADMIN' ? 'hover:text-primary' : ''} transition-colors`}
                        onClick={() => currentUser?.role === 'ADMIN' && onEdit(task.id)}
                    >
                        {task.title}
                    </h3>
                    {currentUser?.role === 'ADMIN' && (
                        <div className="lg:opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                            <button
                                className="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-primary"
                                onClick={(e) => { e.stopPropagation(); onEdit(task.id); }}
                                aria-label="Edit Task"
                            >
                                <EditIcon />
                            </button>
                            <button
                                className="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-error"
                                onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
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
    );
};
