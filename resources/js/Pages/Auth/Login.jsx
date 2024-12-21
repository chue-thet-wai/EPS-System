import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button } from '../../components';

const Login = () => {
    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Errors state
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true); 
        setErrors({}); 

        Inertia.post('/login', formData, {
            onError: (backendErrors) => {
                setErrors(backendErrors); 
                setProcessing(false); 
            },
            onSuccess: () => {
                setProcessing(false); 
            },
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
                <FormWrapper onSubmit={handleSubmit} className="shadow-none">
    
                    <div className="mb-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            error={errors.email} // Show validation error if exists
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            error={errors.password} // Show validation error if exists
                        />
                    </div>

                    <div className="py-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className={"w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 "+
                                (processing ? "opacity-50 cursor-not-allowed" : "")
                            }
                        >
                            {processing ? 'Logging in...' : 'Login'}
                        </Button>
                    </div>
                </FormWrapper>

                <p className="text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
