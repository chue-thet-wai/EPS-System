import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button, Select } from '../../components';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css'; 

const ServiceForm = ({ service = null, users = [], categories = [], statuses = [] }) => {
    const [formData, setFormData] = useState({
        user_id: service?.user_id || '',
        category_id: service?.category_id || '',
        title: service?.title || '',
        description: service?.description || '',
        remark: service?.remark || '',
        status: service?.status ?? 1,
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

    const handleQuillChange = (name) => (value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setErrors({});
        setProcessing(true);

        const action = service ? 'put' : 'post';
        const url = service ? `/services/${service.id}` : '/services';

        Inertia[action](url, formData, {
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
            onSuccess: () => {
                Inertia.visit('/services');
                setProcessing(false);
            },
        });
    };

    return (
        <div className="m-10">
            <h1 className="text-2xl font-bold mb-5 dark:text-white">
                {service ? 'Edit Service' : 'Add Service'}
            </h1>

            <FormWrapper onSubmit={handleSubmit}>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <Label htmlFor="user_id" required>Agent</Label>
                        <Select
                            id="user_id"
                            name="user_id"
                            value={formData.user_id}
                            onChange={handleChange}
                            options={users.map((user) => ({
                                value: user.id,
                                label: user.name,
                            }))}
                            placeholder="Select agent"
                            error={errors.user_id}
                        />
                    </div>

                    <div className="flex-1">
                        <Label htmlFor="category_id" required>Category</Label>
                        <Select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            options={categories.map((cat) => ({
                                value: cat.id,
                                label: cat.name,
                            }))}
                            placeholder="Select a category"
                            error={errors.category_id}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <Label htmlFor="title" required>Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter service title"
                        error={errors.title}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="description" required>Description</Label>
                    <ReactQuill
                        value={formData.description}
                        onChange={handleQuillChange('description')}
                        theme="snow"
                        className="w-full"
                    />
                    {errors.description && <div className="text-red-500 text-sm mt-2">{errors.description}</div>}
                </div>

                <div className="mb-4">
                    <Label htmlFor="remark">Remark</Label>
                    <ReactQuill
                        value={formData.remark}
                        onChange={handleQuillChange('remark')}
                        theme="snow"
                        className="w-full"
                    />
                    {errors.remark && <div className="text-red-500 text-sm mt-2">{errors.remark}</div>}
                </div>

                <div className="mt-4">
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
                        onClick={() => Inertia.visit('/services')}
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

export default ServiceForm;
