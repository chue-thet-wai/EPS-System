import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button, Select } from '../../components';

const CustomerForm = ({ customer = null, statuses = [] }) => {
    const [formData, setFormData] = useState({
        name: customer?.user?.name || '',
        email: customer?.user?.email || '',
        phone: customer?.phone || '',
        dob: customer?.dob || '',
        expired_date: customer?.expired_date || '',
        address: customer?.address || '',
        status: customer?.status ?? 1,
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        const method = customer ? 'put' : 'post';
        const url = customer ? `/customers/${customer.id}` : '/customers';

        Inertia[method](url, formData, {
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
            onSuccess: () => {
                Inertia.visit('/customers');
                setProcessing(false);
            },
        });
    };

    return (
        <div className="m-10">
            <h1 className="text-2xl font-bold mb-5 dark:text-white">
                {customer ? 'Edit Customer ' + customer.customer_id : 'Add Customer'}
            </h1>

            <FormWrapper onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Label htmlFor="name" required>Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="email" required>Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="phone" required>Phone</Label>
                    <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                        id="dob"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        error={errors.dob}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="expired_date">Expired Date</Label>
                    <Input
                        id="expired_date"
                        name="expired_date"
                        type="date"
                        value={formData.expired_date}
                        onChange={handleChange}
                        error={errors.expired_date}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="address">Address</Label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white ${
                            errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        rows={4}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>


                <div className="mb-4">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        options={statuses.length ? statuses : [
                            { value: 1, label: 'Active' },
                            { value: 0, label: 'Inactive' },
                        ]}
                        placeholder="Select status"
                        error={errors.status}
                    />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <Button
                        onClick={() => Inertia.visit('/customers')}
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

export default CustomerForm;
