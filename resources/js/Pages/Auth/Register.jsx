import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { FormWrapper, Label, Input, Button } from "../../components";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
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

        Inertia.post("/register", formData, {
            onError: (backendErrors) => {
                setErrors(backendErrors);
                setProcessing(false);
            },
            onSuccess: () => {
                setProcessing(false);
                setErrors({});
            },
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary-theme-color">
            <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Register</h1>
                <FormWrapper onSubmit={handleSubmit} className="shadow-none">
                    <div className="mb-4">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            error={errors.name}
                        />
                    </div>

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
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            error={errors.password_confirmation}
                        />
                    </div>

                    <div className="py-1">
                        <Button
                            type="submit"
                            disabled={processing}
                            className={
                                "w-full px-4 py-2 mt-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 " +
                                (processing ? "opacity-50 cursor-not-allowed" : "")
                            }
                        >
                            {processing ? "Registering..." : "Register"}
                        </Button>

                    </div>
                </FormWrapper>

                <p className="text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
