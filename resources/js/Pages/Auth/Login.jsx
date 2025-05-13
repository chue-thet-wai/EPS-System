import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button } from '../../components';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

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
        <div className="flex flex-col min-h-screen bg-primary-theme-color">
            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                    {/*
                    <div className="flex justify-center mb-6">
                        <img src="/logo.png" alt="Logo" className="h-12" />
                    </div>
                    */}
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome EPS System</h1>
                    <FormWrapper onSubmit={handleSubmit} shadow="shadow-none">
                        <div className="mb-4">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                error={errors.email}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                                error={errors.password}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                
                        <div className="py-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className={
                                    "w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-150 ease-in-out " +
                                    (processing ? "opacity-50 cursor-not-allowed" : "")
                                }
                            >
                                {processing ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                    </FormWrapper>
                </div>
            </div>
            {/* Footer */}
            <footer className="text-center text-white py-4">
                Created by Techy Solutions
            </footer>
        </div>
    );
};

export default Login;
