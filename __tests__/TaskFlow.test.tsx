
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TasksPage from '@/app/(dashboard)/tasks/page';
import api from '@/lib/axios';

// Mock the TaskCard component to simplify the test if needed, 
// but prefer real rendering if possible.
// For integration tests, we usually render the whole tree.
// However, if TaskCard imports other complex things, we might mock it.
// Checking TaskCard import... it seems fine.

describe('Task Creation Flow', () => {
    const mockUser = {
        id: 'user-1',
        name: 'Test User',
        role: 'ADMIN'
    };

    const mockProject = {
        id: 'proj-1',
        name: 'Test Project'
    };

    const mockTasks = [
        {
            id: 'task-1',
            title: 'Existing Task',
            description: 'Something to do',
            status: 'TODO',
            priority: 'MEDIUM',
            projectId: 'proj-1',
            assigneeId: 'user-1',
            createdAt: '2023-01-01',
            updatedAt: '2023-01-01',
            project: mockProject,
            assignee: mockUser
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup local storage for Admin user
        localStorage.setItem('user', JSON.stringify({ role: 'ADMIN' }));
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('allows an admin to create a new task', async () => {
        const user = userEvent.setup();

        // Mock Initial Data Fetch
        (api.get as jest.Mock).mockImplementation((url) => {
            if (url === '/tasks') return Promise.resolve({ data: { tasks: mockTasks } });
            if (url === '/projects') return Promise.resolve({ data: [mockProject] });
            if (url === '/users') return Promise.resolve({ data: { users: [mockUser] } });
            return Promise.reject(new Error(`not found: ${url}`));
        });

        // Mock Create API
        const newTask = {
            id: 'task-new',
            title: 'New Integration Task',
            description: 'Testing the flow',
            status: 'TODO',
            priority: 'HIGH',
            projectId: 'proj-1',
            assigneeId: 'user-1',
            dueDate: '2025-12-31',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            project: mockProject,
            assignee: mockUser
        };

        (api.post as jest.Mock).mockResolvedValue({ data: { task: newTask } });

        render(<TasksPage />);

        // 1. Verify page loads and tasks are visible
        await waitFor(() => {
            expect(screen.getByText('Existing Task')).toBeInTheDocument();
        });

        // 2. Click Create Task Button
        const createBtn = screen.getByRole('button', { name: /create task/i });
        await user.click(createBtn);

        // 3. Verify Modal Open
        // The modal title "Create New Task" should be visible
        expect(await screen.findByText('Create New Task')).toBeVisible();

        // 4. Fill Form
        // Title - using placeholder
        const titleInput = screen.getByPlaceholderText(/e.g. Implement Login Page/i);
        await user.type(titleInput, 'New Integration Task');

        // Selects: Project, Assignee, Status, Priority
        // There are filters on the main page which are also comboboxes.
        // We target the ones in the modal, which are likely the last 4 in the DOM.
        const allComboboxes = screen.getAllByRole('combobox');
        const projectModalSelect = allComboboxes[allComboboxes.length - 4];
        const assigneeModalSelect = allComboboxes[allComboboxes.length - 3];
        const priorityModalSelect = allComboboxes[allComboboxes.length - 1]; // Last one

        await user.selectOptions(projectModalSelect, 'proj-1');
        await user.selectOptions(assigneeModalSelect, 'user-1');
        await user.selectOptions(priorityModalSelect, 'HIGH');

        // Description - Textarea
        const descInput = document.querySelector('textarea');
        if (descInput) await user.type(descInput, 'Testing the flow');

        // 5. Submit
        // There are two "Create Task" buttons now: one to open modal, one to submit.
        // We want the last one, or strictly the one in the modal.
        // Since we know the modal is open, we can find the submit button.
        const buttons = screen.getAllByRole('button', { name: /create task/i });
        const submitBtn = buttons[buttons.length - 1];
        await user.click(submitBtn);

        // 6. Verify API Call
        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/tasks', expect.objectContaining({
                title: 'New Integration Task',
                description: 'Testing the flow',
                priority: 'HIGH',
                projectId: 'proj-1',
                assigneeId: 'user-1'
            }));
        });

        // 7. Verify UI Update (New task appears)
        // Since we mocked api.post to return the new task, and the component updates state:
        expect(await screen.findByText('New Integration Task')).toBeInTheDocument();
    });
});
