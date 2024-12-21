import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button } from '../../components';

const RoleForm = ({ role = null, permissions = [] }) => {
    const [formData, setFormData] = useState({
        name: role ? role.name : '',
        permissions: role && role.permissions ? role.permissions.map(p => p.id) : [], 
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        if (type === 'checkbox') {
            const permissionId = parseInt(value, 10); // Ensure value is a number
            setFormData((prevData) => {
                const newPermissions = checked
                    ? [...prevData.permissions, permissionId]
                    : prevData.permissions.filter((item) => item !== permissionId);
    
                return {
                    ...prevData,
                    permissions: newPermissions, // Update permissions
                };
            });
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value, // Update other fields (like role name)
            }));
        }
    };
    

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear previous errors and start processing state
        setErrors({});
        setProcessing(true);

        // Submit request based on create or edit mode
        const action = role ? 'put' : 'post';
        const url = role ? `/roles/${role.id}` : '/roles';

        Inertia[action](url, formData, {
            onError: (errors) => {
                setErrors(errors); // Set backend validation errors
                setProcessing(false); // Stop processing on error
            },
            onSuccess: () => {
                Inertia.visit('/roles'); // Redirect on success
                setProcessing(false); // Stop processing on success
            },
        });
    };

    // Group permissions by menu and action
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const [action, menu] = permission.name.split('_');
        if (!acc[menu]) {
            acc[menu] = [];
        }
        acc[menu].push({ action, id: permission.id });
        return acc;
    }, {});

    // All possible actions (can be customized based on your system)
    const actions = ['list', 'create', 'edit', 'delete', 'download'];

    return (
        <div className="m-10">
            <h1 className="text-2xl font-bold mb-5 dark:text-white">
                {role ? 'Edit Role' : 'Add Role'}
            </h1>
            <FormWrapper onSubmit={handleSubmit}>
                <div className="mb-6">
                    <Label htmlFor="name" required>Role Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter role name"
                        aria-invalid={!!errors.name}
                        aria-describedby="name-error"
                        error={errors.name}
                    />
                </div>

                <div className="mb-6">
                    <Label htmlFor="permissions">Permissions</Label>
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">Menu</th>
                                {actions.map((action) => (
                                    <th key={action} className="px-4 py-2 text-left">{action}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(groupedPermissions).map((menu) => (
                                <tr key={menu}>
                                    <td className="px-4 py-2 font-medium text-gray-700">{menu}</td>
                                    {actions.map((action) => {
                                        const permission = groupedPermissions[menu].find(
                                            (perm) => perm.action === action
                                        );
                                        if (!permission) return null;

                                        // Check if the permission.id is in formData.permissions (array)
                                        const isChecked = formData.permissions.includes(permission.id);

                                        return (
                                            <td key={action} className="px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    name="permissions"
                                                    value={permission.id} // Use the numeric ID directly
                                                    checked={formData.permissions.includes(permission.id)} // Boolean state for checked
                                                    onChange={handleChange}
                                                    disabled={processing}
                                                    className="h-5 w-5 text-blue-500 border-gray-300 rounded"
                                                />

                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {errors.permissions && (
                        <div className="mt-2 text-red-500 text-sm">{errors.permissions}</div>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <Button
                        onClick={() => Inertia.visit('/roles')}
                        variant="secondary"
                        disabled={processing} // Disable during processing
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

export default RoleForm;
