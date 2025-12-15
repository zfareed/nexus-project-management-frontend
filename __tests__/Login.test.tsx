import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders email and password inputs', () => {
        render(<LoginPage />);
        expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('shows validation error on empty submit', async () => {
        render(<LoginPage />);
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        expect(await screen.findByText(/please fill in all fields/i)).toBeInTheDocument();
    });

    it('calls login API on valid submit', async () => {
        (api.post as jest.Mock).mockResolvedValue({
            data: { token: 'fake-token', user: { id: '1', name: 'Test' } }
        });
        // useRouter mocked in setup

        render(<LoginPage />);

        fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('/auth/login', {
                email: 'test@example.com',
                password: 'password123'
            });
        });
    });
});
