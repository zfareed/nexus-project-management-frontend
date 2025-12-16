import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/login/page';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/app/context/AuthContext';

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders email and password inputs', () => {
        render(
            <AuthProvider>
                <LoginPage />
            </AuthProvider>
        );
        expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('shows validation error on empty submit', async () => {
        const user = userEvent.setup();
        render(
            <AuthProvider>
                <LoginPage />
            </AuthProvider>
        );
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        expect(await screen.findByText(/please fill in all fields/i)).toBeInTheDocument();
    });

    it('calls login API on valid submit', async () => {
        const user = userEvent.setup();
        (api.post as jest.Mock).mockResolvedValue({
            data: { token: 'fake-token', user: { id: '1', name: 'Test' } }
        });
        // useRouter mocked in setup

        render(
            <AuthProvider>
                <LoginPage />
            </AuthProvider>
        );

        await user.type(screen.getByPlaceholderText(/name@example.com/i), 'test@example.com');
        await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123');

        await user.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/login', {
                email: 'test@example.com',
                password: 'password123'
            });
        });
    });
});
