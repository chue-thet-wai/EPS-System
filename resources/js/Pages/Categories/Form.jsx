import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button } from '../../components';

const CategoryForm = ({ category = null }) => {
    const [formData, setFormData] = useState({
        name: category?.name || '',
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

        const action = category ? 'put' : 'post';
        const url = category ? `/categories/${category.id}` : '/categories';

        Inertia[action](url, formData, {
            onError: (errors) => {
                setErrors(errors); 
                setProcessing(false); 
            },
            onSuccess: () => {
                Inertia.visit('/categories'); 
                setProcessing(false); 
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
                    <Label htmlFor="name" required>Name</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter category name"
                        aria-invalid={!!errors.name}
                        aria-describedby="name-error"
                        error={errors.name} 
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <Button
                        onClick={() => Inertia.visit('/categories')}
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

export default CategoryForm;
