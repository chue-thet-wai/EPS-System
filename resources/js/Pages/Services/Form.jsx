import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button, Select } from '../../components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
    const [subcategories, setSubcategories] = useState([]);  // Track subcategories based on category selection
    const isMobile = useIsMobile();

    const { language } = useLanguage();
    const t = translations[language];

    // Update subcategories whenever category_id changes
    useEffect(() => {
        if (formData.category_id) {
            const selectedCategory = categories.find(cat => cat.id === Number(formData.category_id));
            
            if (selectedCategory && selectedCategory.subcategories) {
                setSubcategories(selectedCategory.subcategories);
            } else {
                setSubcategories([]);  // Reset if no subcategories
            }
        } else {
            setSubcategories([]);  // Reset if no category is selected
        }
    }, [formData.category_id, categories]);


    // Handle changes in input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // If category changes, update subcategories
        if (name === 'category_id') {
            const selectedCategory = categories.find(cat => cat.id === value);

            // Set subcategories based on selected category
            setSubcategories(selectedCategory ? selectedCategory.subcategories : []);
            
            // Reset subcategory if category changes
            setFormData((prev) => ({
                ...prev,
                subcategory_id: '', // Reset subcategory when category changes
            }));
        }
    };

    // Handle changes in ReactQuill
    const handleQuillChange = (name) => (value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Submit the form
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

    // Mobile View
    const renderMobileView = () => (
        <div className="text-sm bg-white p-6">
            <FormWrapper onSubmit={handleSubmit}>
                {/* Category Select */}
                <div className="mb-4">
                    <Label htmlFor="category_id" required>{t.category}</Label>
                    <Select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        options={categories.map((cat) => ({
                            value: cat.id,
                            label: cat.name,
                        }))}
                        placeholder={t.selectCategory}
                        error={errors.category_id}
                        className="bg-gray-100"
                    />
                </div>

                {/* Subcategory Select */}
                <div className="mb-4">
                    <Label htmlFor="subcategory_id" required>{t.subcategory}</Label>
                    <Select
                        id="subcategory_id"
                        name="subcategory_id"
                        value={formData.subcategory_id}
                        onChange={handleChange}
                        options={subcategories.map((sub) => ({
                            value: sub.id,
                            label: sub.name,
                        }))}
                        placeholder={t.selectSubcategory}
                        error={errors.subcategory_id}
                        disabled={!formData.category_id || subcategories.length === 0} // Disable subcategory if no category or subcategories
                    />
                </div>

                {/* Title Input */}
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

                {/* Detail Input */}
                <div className="mb-4">
                    <Label htmlFor="detail">{t.detail}</Label>
                    <ReactQuill
                        value={formData.detail}
                        onChange={handleQuillChange('detail')}
                        theme="snow"
                        className="w-full bg-gray-100"
                    />
                    {errors.detail && <div className="text-red-500 text-sm mt-2">{errors.detail}</div>}
                </div>

                {/* Duration Input */}
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

                {/* Cost Input */}
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

                {/* Status Select */}
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

                {/* Submit Button */}
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
            </FormWrapper>
        </div>
    );

    // Desktop View
    const renderDesktopView = () => (
        <div className="mx-4 my-6 sm:mx-10 sm:my-10">
            <FormWrapper onSubmit={handleSubmit}>
                {/* Category Select */}
                <div className="mb-4">
                    <Label htmlFor="category_id" required>{t.category}</Label>
                    <Select
                        id="category_id"
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        options={categories.map((cat) => ({
                            value: cat.id,
                            label: cat.name,
                        }))}
                        placeholder={t.selectCategory}
                        error={errors.category_id}
                    />
                </div>

                {/* Subcategory Select */}
                <div className="mb-4">
                    <Label htmlFor="subcategory_id" required>{t.subcategory}</Label>
                    <Select
                        id="subcategory_id"
                        name="subcategory_id"
                        value={formData.subcategory_id}
                        onChange={handleChange}
                        options={subcategories.map((sub) => ({
                            value: sub.id,
                            label: sub.name,
                        }))}
                        placeholder={t.selectSubcategory}
                        error={errors.subcategory_id}
                        disabled={!formData.category_id || subcategories.length === 0} // Disable subcategory if no category or subcategories
                    />
                </div>

                {/* Title Input */}
                <div className="mb-4">
                    <Label htmlFor="title" required>{t.title}</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder={t.enterTitle}
                        error={errors.title}
                    />
                </div>

                {/* Detail Input */}
                <div className="mb-4">
                    <Label htmlFor="detail">{t.detail}</Label>
                    <ReactQuill
                        value={formData.detail}
                        onChange={handleQuillChange('detail')}
                        theme="snow"
                        className="w-full"
                    />
                    {errors.detail && <div className="text-red-500 text-sm mt-2">{errors.detail}</div>}
                </div>

                {/* Duration Input */}
                <div className="mb-4">
                    <Label htmlFor="duration">{t.serviceDuration}</Label>
                    <Input
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder={t.serviceDurationPlaceholder}
                        error={errors.duration}
                    />
                </div>

                {/* Cost Input */}
                <div className="mb-4">
                    <Label htmlFor="cost">{t.serviceCost}</Label>
                    <Input
                        id="cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        placeholder={t.enterCost}
                        error={errors.cost}
                    />
                </div>

                {/* Status Select */}
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
                    />
                </div>

                {/* Submit Button */}
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
            </FormWrapper>
        </div>
    );

    return isMobile ? renderMobileView() : renderDesktopView();
};

export default ServiceForm;
