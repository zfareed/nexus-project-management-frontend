import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectList, Project } from '@/app/components/ProjectList';

describe('Project List Component', () => {
    const mockProject: Project = {
        id: '1',
        name: 'Alpha Project',
        description: 'Important project',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        assignedUsers: [],
        createdBy: { id: 'u1', name: 'Admin', role: 'ADMIN', email: 'admin@demo.com' },
        taskCount: 5,
        tasks: []
    };

    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnCreate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows empty state when no projects exist', () => {
        render(
            <ProjectList
                projects={[]}
                currentUser={{ id: 'u1', name: 'User', role: 'USER', email: 'u@d.com' }}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onCreate={mockOnCreate}
            />
        );

        expect(screen.getByText(/no projects yet/i)).toBeInTheDocument();
    });

    it('renders list of projects', () => {
        render(
            <ProjectList
                projects={[mockProject]}
                currentUser={{ id: 'u1', name: 'User', role: 'USER', email: 'u@d.com' }}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onCreate={mockOnCreate}
            />
        );

        expect(screen.getByText('Alpha Project')).toBeInTheDocument();
        expect(screen.getByText('Important project')).toBeInTheDocument();
        // Since badge might split text: "5 Tasks"
        expect(screen.getByText((content, element) => {
            return element?.textContent === '5 Tasks';
        })).toBeInTheDocument();
    });

    it('calls edit handler on edit click (Admin)', () => {
        render(
            <ProjectList
                projects={[mockProject]}
                currentUser={{ id: 'u1', name: 'Admin', role: 'ADMIN', email: 'a@d.com' }}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onCreate={mockOnCreate}
            />
        );

        const editBtn = screen.getByLabelText('Edit Project');
        fireEvent.click(editBtn);
        // Expect calls with project object
        expect(mockOnEdit).toHaveBeenCalledWith(mockProject);
    });

    it('calls delete handler on delete click (Admin)', () => {
        render(
            <ProjectList
                projects={[mockProject]}
                currentUser={{ id: 'u1', name: 'Admin', role: 'ADMIN', email: 'a@d.com' }}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                onCreate={mockOnCreate}
            />
        );

        const deleteBtn = screen.getByLabelText('Delete Project');
        fireEvent.click(deleteBtn);
        expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
});
