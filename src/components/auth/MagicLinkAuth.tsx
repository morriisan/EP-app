'use client';

import { useState } from 'react';
import { signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function MagicLinkAuth() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await signIn.magicLink({
                email,
                callbackURL: '/dashboard', // Redirect to dashboard after successful login
            });

            if (error) {
                throw new Error(error.message);
            }

            toast.success('Check your email for the login link!');
            setEmail('');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to send login link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full"
                />
            </div>
            <Button
                type="submit"
                className="w-full"
                disabled={loading}
            >
                {loading ? 'Sending link...' : 'Send Magic Link'}
            </Button>
        </form>
    );
} 