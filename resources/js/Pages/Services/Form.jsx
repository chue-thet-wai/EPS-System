import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button, Select, Textarea } from '../../components';
import useIsMobile from '@/utils/useIsMobile';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const ServiceForm = ({ service = null, categories = [], statuses = [] }) => {
    const [formData, setFormData] = useState({
        category_id: service?.category_id || '',
        subcategory_id: service?.subcategory_id || '',
        title: service?.title || '',
        detail: service?.detail || '',
        duration: service?.duration || '',
        cost: service?.cost || '',
        status: service?.status ?? 1,
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [subcategories, setSubcategories] = useState([]);
    const isMobile = useIsMobile();

    const { language } = useLanguage();
    const t = translations[language];

    // Load subcategories when category changes
    useEffect(() => {
        if (formData.category_id) {
            const selectedCategory = categories.find(cat => cat.id === Number(formData.category_id));
            setSubcategories(selectedCategory?.subcategories || []);
        } else {
            setSubcategories([]);
        }
    }, [formData.category_id, categories]);

    // Handle change for all inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Reset subcategory when category changes
        if (name === 'category_id') {
            setFormData(prev => ({ ...prev, subcategory_id: '' }));
        }
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        const method = service ? 'put' : 'post';
        const url = service ? `/services/${service.id}` : '/services';

        Inertia[method](url, formData, {
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

    // Reusable form fields
    const renderFormFields = () => (
        <>
            {/* Category */}
            <div className="mb-4">
                <Label htmlFor="category_id" required>{t.category}</Label>
                <Select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    options={categories.map(cat => ({
                        value: cat.id,
                        label: cat.name,
                    }))}
                    placeholder={t.selectCategory}
                    error={errors.category_id}
                />
            </div>

            {/* Subcategory */}
            <div className="mb-4">
                <Label htmlFor="subcategory_id" required>{t.subcategory}</Label>
                <Select
                    id="subcategory_id"
                    name="subcategory_id"
                    value={formData.subcategory_id}
                    onChange={handleChange}
                    options={subcategories.map(sub => ({
                        value: sub.id,
                        label: sub.name,
                    }))}
                    placeholder={t.selectSubcategory}
                    error={errors.subcategory_id}
                    disabled={!formData.category_id || subcategories.length === 0}
                />
            </div>

            {/* Title */}
            <div className="mb-4">
                <Label htmlFor="title" required>{t.title}</Label>
                <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder={t.enterTitle}
                    error={errors.title}
                    className="bg-gray-100"
                />
            </div>

            {/* Detail */}
            <div className="mb-4">
                <Label htmlFor="detail">{t.detail}</Label>
                <Textarea
                    id="detail"
                    name="detail"
                    value={formData.detail}
                    onChange={handleChange}
                    placeholder={t.enterDetail || 'Enter detail...'}
                    className="w-full bg-gray-100"
                    rows={5}
                />
                {errors.detail && <div className="text-red-500 text-sm mt-2">{errors.detail}</div>}
            </div>

            {/* Duration */}
            <div className="mb-4">
                <Label htmlFor="duration">{t.serviceDuration}</Label>
                <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder={t.serviceDurationPlaceholder}
                    error={errors.duration}
                    className="bg-gray-100"
                />
            </div>

            {/* Cost */}
            <div className="mb-4">
                <Label htmlFor="cost">{t.serviceCost}</Label>
                <Input
                    id="cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    placeholder={t.enterCost}
                    error={errors.cost}
                    className="bg-gray-100"
                />
            </div>

            {/* Status */}
            <div className="mb-4">
                <Label htmlFor="status">{t.serviceStatus}</Label>
                <Select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={statuses.length ? statuses : [
                        { value: 1, label: t.active },
                        { value: 0, label: t.inactive },
                    ]}
                    placeholder={t.selectStatus}
                    error={errors.status}
                    className="bg-gray-100"
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
                <Button
                    onClick={() => Inertia.visit('/services')}
                    variant="secondary"
                    disabled={processing}
                >
                    {t.cancel}
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? t.saving : t.save}
                </Button>
            </div>
        </>
    );

    return (
        <div className={isMobile ? 'text-sm bg-white p-6' : 'mx-4 my-6 sm:mx-10 sm:my-10'}>
            <FormWrapper onSubmit={handleSubmit}>
                {renderFormFields()}
            </FormWrapper>
        </div>
    );
};

export default ServiceForm;
