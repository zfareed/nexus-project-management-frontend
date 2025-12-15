import React from 'react';

// Types
interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
    avatar?: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    assignedUsers: User[];
    createdBy: User;
    taskCount: number;
    tasks: any[];
}

interface ProjectListProps {
    projects: Project[];
    currentUser: User | null;
    onEdit: (project: Project) => void;
    onDelete: (id: string) => void;
    onCreate: () => void;
}

const ProjectCard = ({ project, currentUser, onEdit, onDelete, style }: {
    project: Project;
    currentUser: User | null;
    onEdit: (p: Project) => void;
    onDelete: (id: string) => void;
    style?: React.CSSProperties;
}) => {
    return (
        <div
            style={style}
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

                <h2
                    className={`card-title text-xl text-base-content ${currentUser?.role === 'ADMIN' ? 'group-hover:text-primary cursor-pointer' : ''} transition-colors`}
                    onClick={() => currentUser?.role === 'ADMIN' && onEdit(project)}
                >
                    {project.name}
                </h2>
                <p className="text-sm text-base-content/60 mt-2 line-clamp-2 leading-relaxed min-h-[2.5em]">
                    {project.description || "No description provided."}
                </p>

                <div className="mt-6 flex items-center justify-between">
                    <div className="flex -space-x-2 ring-offset-2">
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

                    {currentUser?.role === 'ADMIN' && (
                        <div className="flex gap-1 opacity-100 transition-opacity duration-300">
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                                className="btn btn-ghost btn-xs btn-square tooltip"
                                data-tip="Edit"
                                aria-label="Edit Project"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                                className="btn btn-ghost btn-xs btn-square text-error/70 hover:bg-error/10 hover:text-error tooltip"
                                data-tip="Delete"
                                aria-label="Delete Project"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ProjectList = ({ projects, currentUser, onEdit, onDelete, onCreate }: ProjectListProps) => {
    if (projects.length === 0) {
        return (
            <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                <div className="bg-base-200/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-base-content">No projects yet</h3>
                <p className="text-base-content/50 mt-2 max-w-sm mx-auto">Get started by creating your first project to organize tasks and collaborate with your team.</p>
                {currentUser?.role === 'ADMIN' && (
                    <button onClick={onCreate} className="btn btn-ghost text-primary mt-4 font-medium hover:bg-primary/10">
                        Create your first project &rarr;
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
            {projects.map((project, index) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    currentUser={currentUser}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    style={{ animationDelay: `${index * 100}ms` }}
                />
            ))}
        </div>
    );
};
