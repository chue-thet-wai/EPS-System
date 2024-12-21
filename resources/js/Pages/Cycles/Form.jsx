import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button, Textarea } from '../../components';

const CycleForm = ({ cycle = null }) => {
    const [formData, setFormData] = useState({
        description: cycle?.description || '',
        start_date: cycle?.start_date || '',
        end_date: cycle?.end_date || '',
        vacation_start_date: cycle?.vacation_start_date || '',
        vacation_end_date: cycle?.vacation_end_date || '',
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

        // Clear previous errors
        setErrors({});
        setProcessing(true);

        // Determine action (create or update)
        const action = cycle ? 'put' : 'post';
        const url = cycle ? `/cycles/${cycle.id}` : '/cycles';

        // Submit form data using Inertia
        Inertia[action](url, formData, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                Inertia.visit('/cycles');
                setProcessing(false);
            },
        });
    };

    return (
        <div className="m-10">
            <h1 className="text-2xl font-bold mb-5 dark:text-white">
                {cycle ? 'Edit Cycle' : 'Add Cycle'}
            </h1>
            <FormWrapper onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Label htmlFor="description" required>Cycle Description</Label>
                    <Input
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter cycle description"
                        aria-invalid={!!errors.description}
                        aria-describedby="description-error"
                        error={errors.description}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="start_date" required>Start Date</Label>
                    <Input
                        type="date"
                        id="start_date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        aria-invalid={!!errors.start_date}
                        aria-describedby="start_date-error"
                        error={errors.start_date}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="end_date" required>End Date</Label>
                    <Input
                        type="date"
                        id="end_date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        aria-invalid={!!errors.end_date}
                        aria-describedby="end_date-error"
                        error={errors.end_date}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="vacation_start_date">Vacation Start Date</Label>
                    <Input
                        type="date"
                        id="vacation_start_date"
                        name="vacation_start_date"
                        value={formData.vacation_start_date}
                        onChange={handleChange}
                        aria-invalid={!!errors.vacation_start_date}
                        aria-describedby="vacation_start_date-error"
                        error={errors.vacation_start_date}
                    />
                </div>

                <div className="mb-4">
                    <Label htmlFor="vacation_end_date">Vacation End Date</Label>
                    <Input
                        type="date"
                        id="vacation_end_date"
                        name="vacation_end_date"
                        value={formData.vacation_end_date}
                        onChange={handleChange}
                        aria-invalid={!!errors.vacation_end_date}
                        aria-describedby="vacation_end_date-error"
                        error={errors.vacation_end_date}
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <Button
                        onClick={() => Inertia.visit('/cycles')}
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

export default CycleForm;
