// pages/login/index.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Button, Card, } from '@nextui-org/react';
import models from '@/services/models';

const LoginPage = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await models.auth.login(name, password);
            if (!response.ok) {
                throw new Error(response.message);
            } else {
                router.push('/');
            }
        } catch {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[800px] ">
            <Card className="w-full max-w-md p-6">
                <div className="text-left mb-4 ml-1 flex flex-col items-start text-slate-500">
                    <h1 className="text-center font-thin text-xl ">Welcome to VD-Next</h1>
                    <h2 className="text-center font-thin text-lg">Have a nice day </h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Input
                            
                            fullWidth
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            // onClear={() => setName('')}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            type="password"
                            
                            fullWidth
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // onClear={() => setPassword('')}
                            required
                        />
                    </div>
                    {error && <h1 className="mb-2 ml-1 text-red-400">{error}</h1>}
                    <Button type="submit" className="w-full mt-3">Login</Button>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;