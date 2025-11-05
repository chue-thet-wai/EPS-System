import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button, Textarea, Select } from '../../components'; 
import { translations } from '../../utils/lang';
import { useLanguage } from '../../contexts/LanguageContext';

const JobForm = ({ job = null, types = [] }) => {
    const { language } = useLanguage();
    const t = translations[language];

    const [formData, setFormData] = useState({
        title: job?.title || '',
        description: job?.description || '',
        location: job?.location || '',
        salary: job?.salary || '',
        type: job?.type || '', 
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleChange = (e) => {
        if (e?.target) {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } else if (e?.value) {
            setFormData((prevData) => ({
                ...prevData,
                type: e.value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        const action = job ? 'put' : 'post';
        const url = job ? `/jobs/${job.id}` : '/jobs';

        Inertia[action](url, formData, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                Inertia.visit('/jobs');
                setProcessing(false);
            },
        });
    };

    return (
        <div className="mx-4 my-6 sm:mx-10 sm:my-10">
            <FormWrapper onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="title" required>
                        {t.title}
                    </Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder={t.enterJobTitle}
                        error={errors.title}
                    />
                </div>

                <div>
                    <Label htmlFor="type" required>
                        {t.type}
                    </Label>
                    <Select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        options={types}
                        error={errors.type}
                        className="bg-gray-100"
                    />
                </div>

                <div>
                    <Label htmlFor="description" required>
                        {t.description}
                    </Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full"
                        error={errors.description}
                    />
                </div>

                <div>
                    <Label htmlFor="location">{t.location}</Label>
                    <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder={t.enterLocation}
                        error={errors.location}
                    />
                </div>

                <div>
                    <Label htmlFor="salary">{t.salary}</Label>
                    <Input
                        id="salary"
                        name="salary"
                        type="text"
                        value={formData.salary}
                        onChange={handleChange}
                        placeholder={t.enterSalary}
                        error={errors.salary}
                    />
                </div>

                <div className="flex justify-end space-x-3 mt-4">
                    <Button
                        onClick={() => Inertia.visit('/jobs')}
                        variant="secondary"
                        disabled={processing}
                    >
                        {t.cancel}
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? t.saving : t.save}
                    </Button>
                </div>
            </FormWrapper>
        </div>
    );
};

export default JobForm;
