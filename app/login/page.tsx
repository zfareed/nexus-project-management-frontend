'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-300 via-base-100 to-primary/10 p-4 overflow-hidden relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-50 animate-pulse delay-700"></div>

            <div className="card w-full max-w-md bg-base-100/80 backdrop-blur-xl shadow-2xl border border-base-content/5 animate-in fade-in zoom-in duration-500">
                <div className="card-body p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">Welcome Back</h1>
                        <p className="text-base-content/60 font-medium">Sign in to access your dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Email</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2 w-full focus-within:input-primary transition-all duration-300 bg-base-200/50 hover:bg-base-200/80">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="grow"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">Password</span>
                            </label>
                            <label className="input input-bordered flex items-center gap-2 w-full focus-within:input-primary transition-all duration-300 bg-base-200/50 hover:bg-base-200/80">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="grow"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>
                            <label className="label">
                                <a href="#" className="label-text-alt link link-primary link-hover font-medium ml-auto">Forgot password?</a>
                            </label>
                        </div>

                        {error && (
                            <div role="alert" className="alert alert-error text-sm py-2 rounded-lg animate-in fade-in slide-in-from-top-1 shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-control mt-4">
                            <button
                                type="submit"
                                className="btn btn-primary w-full text-lg font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 transform hover:-translate-y-1"
                                disabled={isLoading}
                            >
                                {isLoading ? <span className="loading loading-spinner loading-md"></span> : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <div className="divider text-sm font-medium text-base-content/50 my-6">OR USE DEMO</div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="btn btn-outline hover:bg-base-content/5 transition-all duration-300 hover:scale-105"
                            onClick={fillDemoAdmin}
                            disabled={isLoading}
                        >
                            Demo Admin
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline hover:bg-base-content/5 transition-all duration-300 hover:scale-105"
                            onClick={fillDemoUser}
                            disabled={isLoading}
                        >
                            Demo User
                        </button>
                    </div>

                    <div className="text-center mt-6 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
                        <p className="text-sm text-base-content/70">
                            Don't have an account?{' '}
                            <Link href="/register" className="link link-primary font-bold hover:no-underline hover:text-primary-focus transition-colors">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
