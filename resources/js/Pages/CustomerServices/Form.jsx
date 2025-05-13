import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button, Select, Textarea } from '../../components';

const CustomerServiceForm = ({ customerService = null, customers = [], services = [], statuses = [] }) => {
    const [formData, setFormData] = useState({
        customer_id: customerService?.id || '',
        service_id: customerService?.service_id || '',
        status: customerService?.status ?? 1,
        start_date: customerService?.start_date || '',
        end_date: customerService?.end_date || '',
        remark: customerService?.remark || '',
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

        const method = customerService ? 'put' : 'post';
        const url = customerService ? `/customer-services/${customerService.id}` : '/customer-services';

        Inertia[method](url, formData, {
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
            onSuccess: () => {
                Inertia.visit('/customer-services');
                setProcessing(false);
            },
        });
    };

    return (
        <div className="m-10">
            <h1 className="text-2xl font-bold mb-5 dark:text-white">
                {customerService ? 'Edit Customer Service' : 'Add Customer Service'}
            </h1>

            <FormWrapper onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Label htmlFor="customer_id" required>Customer</Label>
                    <Select
                        id="customer_id"
                        name="customer_id"
                        value={formData.customer_id}
                        onChange={handleChange}
                        options={customers.map(c => ({ value: c.id, label: c.user.name }))}
                        placeholder="Select Customer"
                        error={errors.customer_id}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="service_id" required>Service</Label>
                    <Select
                        id="service_id"
                        name="service_id"
                        value={formData.service_id}
                        onChange={handleChange}
                        options={services.map(s => ({ value: s.id, label: s.title }))}
                        placeholder="Select Service"
                        error={errors.service_id}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        options={statuses}
                        error={errors.status}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                        id="start_date"
                        name="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={handleChange}
                        error={errors.start_date}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                        id="end_date"
                        name="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={handleChange}
                        error={errors.end_date}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="remark">Remark</Label>
                    <Textarea
                        id="remark"
                        name="remark"
                        value={formData.remark}
                        onChange={handleChange}
                        error={errors.remark}
                    />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <Button
                        onClick={() => Inertia.visit('/customer-services')}
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

export default CustomerServiceForm;
