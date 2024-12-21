import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button, Textarea } from '../../components';

const CourseForm = ({ course = null }) => {
    const [formData, setFormData] = useState({
        description: course?.description || '',
        abstract: course?.abstract || '',
        bibliography: course?.bibliography || '',
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
        const action = course ? 'put' : 'post';
        const url = course ? `/courses/${course.id}` : '/courses';

        // Submit form data using Inertia
        Inertia[action](url, formData, {
            onError: (errors) => {
                setErrors(errors); // Set the backend validation errors
                setProcessing(false); // Stop processing on error
            },
            onSuccess: () => {
                Inertia.visit('/courses'); // Redirect on success
                setProcessing(false); // Stop processing on success
            },
        });
    };

    return (
        <div className="m-10">
            <h1 className="text-2xl font-bold mb-5 dark:text-white">
                {course ? 'Edit Course' : 'Add Course'}
            </h1>
            <FormWrapper onSubmit={handleSubmit}>
                
                <div className="mb-4">
                    <Label htmlFor="description">Course Description</Label>
                    <Input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter course description"
                        aria-invalid={!!errors.description}
                        aria-describedby="description-error"
                        error={errors.description} 
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="abstract">Abstract</Label>
                    <Textarea
                        id="abstract"
                        name="abstract"
                        value={formData.abstract}
                        onChange={handleChange}
                        placeholder="Enter course abstract"
                        aria-invalid={!!errors.abstract}
                        aria-describedby="abstract-error"
                        error={errors.abstract} 
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="bibliography">Bibliography</Label>
                    <Textarea
                        id="bibliography"
                        name="bibliography"
                        value={formData.bibliography}
                        onChange={handleChange}
                        placeholder="Enter bibliography"
                        aria-invalid={!!errors.bibliography}
                        aria-describedby="bibliography-error"
                        error={errors.bibliography} 
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <Button
                        onClick={() => Inertia.visit('/courses')}
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

export default CourseForm;
