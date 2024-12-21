import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button } from '../../components';

const CategoryForm = ({ category = null }) => {
    const [formData, setFormData] = useState({
        description: category?.description || '',
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false); // State to track form submission

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});
        setProcessing(true); // Start processing state

        // Send request based on create or edit mode
        const action = category ? 'put' : 'post';
        const url = category ? `/categories/${category.id}` : '/categories';

        // Submit form data using Inertia
        Inertia[action](url, formData, {
            onError: (errors) => {
                setErrors(errors); // Set the backend validation errors
                setProcessing(false); // Stop processing on error
            },
            onSuccess: () => {
                Inertia.visit('/categories'); // Redirect on success
                setProcessing(false); // Stop processing on success
            },
        });
    };

    return (
        <div className="m-10">
            <h1 className="text-2xl font-bold mb-5 dark:text-white">
                {category ? 'Edit Category' : 'Add Category'}
            </h1>
            <FormWrapper onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="description" required>Category Description</Label>
                    <Input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter category description"
                        aria-invalid={!!errors.description}
                        aria-describedby="description-error"
                        error={errors.description} 
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <Button
                        onClick={() => Inertia.visit('/categories')}
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

export default CategoryForm;
