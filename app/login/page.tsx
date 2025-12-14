'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 800));

            if (email === 'admin@nexus.com' && password === 'admin123') {
                router.push('/'); // Redirect to dashboard
            } else if (email === 'user@nexus.com' && password === 'user123') {
                router.push('/'); // Redirect to dashboard
            } else {
                setError('Invalid email or password');
                setIsLoading(false);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    const fillDemoAdmin = () => {
        setEmail('admin@nexus.com');
        setPassword('admin123');
    };

    const fillDemoUser = () => {
        setEmail('user@nexus.com');
        setPassword('user123');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4 transition-colors duration-200">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold mb-2">Nexus Login</h1>
                        <p className="text-base-content/70">Sign in to manage your projects</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="input input-bordered w-full focus:input-primary transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="input input-bordered w-full focus:input-primary transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover text-primary">Forgot password?</a>
                            </label>
                        </div>

                        {error && (
                            <div role="alert" className="alert alert-error text-sm py-2 rounded-lg animate-in fade-in slide-in-from-top-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary w-full text-lg font-medium"
                                disabled={isLoading}
                            >
                                {isLoading ? <span className="loading loading-spinner loading-md"></span> : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <div className="divider text-sm text-base-content/50 my-6">OR USE DEMO CREDENTIALS</div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="btn btn-outline hover:bg-base-200 transition-colors"
                            onClick={fillDemoAdmin}
                            disabled={isLoading}
                        >
                            Demo Admin
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline hover:bg-base-200 transition-colors"
                            onClick={fillDemoUser}
                            disabled={isLoading}
                        >
                            Demo User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
