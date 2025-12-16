import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/register/page';
import api from '@/lib/axios';
import { AuthProvider } from '@/app/context/AuthContext';

describe('Register Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all required fields', () => {
        render(
            <AuthProvider>
                <RegisterPage />
            </AuthProvider>
        );
        expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
        // Check for password inputs by name/type as placeholder is duplicate
        const passwordInputs = screen.getAllByPlaceholderText(/••••••••/i);
        expect(passwordInputs.length).toBeGreaterThanOrEqual(2);
    });

    it('shows error for invalid input (password mismatch)', async () => {
        const { container } = render(
            <AuthProvider>
                <RegisterPage />
            </AuthProvider>
        );

        fireEvent.change(screen.getByPlaceholderText(/john doe/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), { target: { value: 'test@example.com' } });

        // Use selector for precise targeting
        const passwordInput = container.querySelector('input[name="password"]');
        const confirmInput = container.querySelector('input[name="confirmPassword"]');

        if (passwordInput) fireEvent.change(passwordInput, { target: { value: '123456' } });
        if (confirmInput) fireEvent.change(confirmInput, { target: { value: '654321' } });

        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    });

    it('calls register API on valid submit', async () => {
        (api.post as jest.Mock).mockResolvedValue({
            data: { token: 'fake-token', user: { id: '1', name: 'Test User' } }
        });

        const { container } = render(
            <AuthProvider>
                <RegisterPage />
            </AuthProvider>
        );

        fireEvent.change(screen.getByPlaceholderText(/john doe/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), { target: { value: 'test@example.com' } });

        const passwordInput = container.querySelector('input[name="password"]');
        const confirmInput = container.querySelector('input[name="confirmPassword"]');

        if (passwordInput) fireEvent.change(passwordInput, { target: { value: 'password123' } });
        if (confirmInput) fireEvent.change(confirmInput, { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/register', {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
        });
    });
});
