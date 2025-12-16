import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardHome from '@/app/(dashboard)/page';
import api from '@/lib/axios';

describe('Dashboard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows loading state while fetching data', () => {
        // Mock API pending
        (api.get as jest.Mock).mockReturnValue(new Promise(() => { }));

        render(<DashboardHome />);
        // Look for loading spinner or generic loading text if spinner has no accessible name
        // The loading spinner has class "loading", maybe no text?
        // Code: <span className="loading loading-spinner ..."></span>
        const spinner = document.querySelector('.loading-spinner');
        // Since using RTL, I prefer queries. But if no role, class matching is hard.
        // Wait, render returns container
        const { container } = render(<DashboardHome />);
        expect(container.getElementsByClassName('loading-spinner').length).toBeGreaterThan(0);
    });

    it('renders projects and tasks stats after fetching', async () => {
        const mockStats = {
            overview: {
                totalProjects: 10,
                tasksCompleted: 42,
                completionRate: 80,
                pendingTasks: 5,
                overdueTasks: 1
            },
            taskStatusDistribution: [],
            taskPriorityDistribution: []
        };

        (api.get as jest.Mock).mockResolvedValue({ data: mockStats });

        render(<DashboardHome />);

        // Wait for loading to finish and content to appear
        await waitFor(() => {
            expect(screen.getByText(/dashboard overview/i)).toBeInTheDocument();
        });

        // Check if stats are displayed
        expect(screen.getByText('10')).toBeInTheDocument(); // Total Projects
        expect(screen.getByText('42')).toBeInTheDocument(); // Tasks Completed
        expect(screen.getByText('5')).toBeInTheDocument();  // Pending Tasks
        expect(screen.getByText('1')).toBeInTheDocument();  // Overdue
    });
});
