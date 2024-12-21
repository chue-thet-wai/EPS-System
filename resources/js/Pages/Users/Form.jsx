import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button, Select } from '../../components';

const UserForm = ({ user = null, roles = [] }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        role: user?.role || '',
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
        setErrors({});
        setProcessing(true);

        const action = user ? 'put' : 'post';
        const url = user ? `/users/${user.id}` : '/users';

        Inertia[action](url, formData, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                Inertia.visit('/users');
                setProcessing(false);
            },
        });
    };

    return (
        <div className="m-10">
            <h1 className="text-2xl font-bold mb-5 dark:text-white">
                {user ? 'Edit User' : 'Add User'}
            </h1>
            <FormWrapper onSubmit={handleSubmit}>
                
                <div>
                    <Label htmlFor="name" required>
                        User Name
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter user name"
                        aria-invalid={!!errors.name}
                        aria-describedby="name-error"
                        error={errors.name}
                    />
                </div>

                {/* Email Field */}
                <div>
                    <Label htmlFor="email" required>
                        Email
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        aria-invalid={!!errors.email}
                        aria-describedby="email-error"
                        error={errors.email}
                    />
                </div>

                {/* Password Field */}
                <div>
                    <Label htmlFor="password" required>
                        Password
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        aria-invalid={!!errors.password}
                        aria-describedby="password-error"
                        error={errors.password}
                    />
                </div>

                {/* Confirm Password Field */}
                <div>
                    <Label htmlFor="password_confirmation" required>
                        Confirm Password
                    </Label>
                    <Input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        aria-invalid={!!errors.password_confirmation}
                        aria-describedby="password_confirmation-error"
                        error={errors.password_confirmation}
                    />
                </div>

                {/* Role Dropdown */}
                <div>
                    <Label htmlFor="role" required>
                        Role
                    </Label>
                    <Select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        options={roles.map((role) => ({ label: role, value: role }))}
                        placeholder="Select a role"
                        aria-invalid={!!errors.role}
                        aria-describedby="role-error"
                        error={errors.role}
                    />
                </div>

                <div className="flex justify-end space-x-3 mt-4">
                    <Button
                        onClick={() => Inertia.visit('/users')}
                        variant="secondary"
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </FormWrapper>
        </div>
    );
};

export default UserForm;
