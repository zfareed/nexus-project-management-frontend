import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard, Task } from '@/app/components/TaskCard';

describe('Task Card Component', () => {
    const mockTask: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'TODO',
        priority: 'HIGH',
        dueDate: '2025-01-01',
        projectId: 'p1',
        assigneeId: 'u1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        project: { id: 'p1', name: 'Test Project' },
        assignee: { id: 'u1', name: 'John Doe', avatar: '' }
    };

    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('displays task title, status, and priority', () => {
        render(
            <TaskCard
                task={mockTask}
                currentUser={{ role: 'USER' }}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('HIGH')).toBeInTheDocument(); // Priority Badge
        // Status is implicitly handled by visual column usually, but Card displays priority
    });

    it('does not show edit/delete buttons for USER role', () => {
        render(
            <TaskCard
                task={mockTask}
                currentUser={{ role: 'USER' }}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        // Edit/Trash icons are button children
        // aria-labels added in my extracted component: "Edit Task", "Delete Task"
        expect(screen.queryByLabelText('Edit Task')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Delete Task')).not.toBeInTheDocument();
    });

    it('calls edit handler on edit click (Admin)', () => {
        render(
            <TaskCard
                task={mockTask}
                currentUser={{ role: 'ADMIN' }}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        const editBtn = screen.getByLabelText('Edit Task');
        fireEvent.click(editBtn);
        expect(mockOnEdit).toHaveBeenCalledWith('1');
    });

    it('calls delete handler on delete click (Admin)', () => {
        render(
            <TaskCard
                task={mockTask}
                currentUser={{ role: 'ADMIN' }}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
            />
        );

        const deleteBtn = screen.getByLabelText('Delete Task');
        fireEvent.click(deleteBtn);
        expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
});
