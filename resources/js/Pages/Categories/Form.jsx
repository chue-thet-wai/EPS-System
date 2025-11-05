import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button } from '../../components';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const CategoryForm = ({ category = null }) => {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        subcategories: category?.subcategories?.map(s => ({
            id: s.id,
            name: s.name
        })) || [],
    });

    const [newSubcat, setNewSubcat] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const { language } = useLanguage();
    const t = translations[language];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddSubcategory = () => {
        if (!newSubcat.trim()) return;
        const newSubcategory = {
            id: null, 
            name: newSubcat.trim(),
        };
        setFormData(prev => ({
            ...prev,
            subcategories: [...prev.subcategories, newSubcategory],
        }));
        setNewSubcat('');
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditValue(formData.subcategories[index].name);
    };

    const handleUpdate = () => {
        if (!editValue.trim()) return;
        const updated = [...formData.subcategories];
        updated[editIndex] = { ...updated[editIndex], name: editValue.trim() };
        setFormData(prev => ({
            ...prev,
            subcategories: updated,
        }));
        setEditIndex(null);
        setEditValue('');
    };

    const handleDelete = (index) => {
        setFormData(prev => ({
            ...prev,
            subcategories: prev.subcategories.filter((_, i) => i !== index),
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
        <div className="container mx-auto p-5 mt-5">
            <FormWrapper onSubmit={handleSubmit}>

                <div className="mb-6">
                    <Label htmlFor="name" required className="block mb-2 text-lg font-semibold text-gray-700">{t.name}</Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t.enterCategoryName}
                        aria-invalid={!!errors.name}
                        aria-describedby="name-error"
                        error={errors.name}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="flex gap-3 mb-6 items-center flex-nowrap w-full max-w-lg">
                    <Input
                        value={newSubcat}
                        onChange={(e) => setNewSubcat(e.target.value)}
                        placeholder={t.enterSubcategoryName || 'Enter subcategory name'}
                        className="flex-grow mb-0 rounded-md border border-gray-300 px-4 py-2"
                    />
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleAddSubcategory}
                        className="whitespace-nowrap flex-shrink-0 -mt-3"
                    >
                        {t.addSubcategory || 'Add'}
                    </Button>
                </div>

                {formData.subcategories.length > 0 && (
                    <div className="space-y-3 mt-4">
                        {formData.subcategories.map((subcat, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 rounded-md px-4 py-2">
                                <div className="flex-grow mr-4">
                                    {editIndex === index ? (
                                        <Input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />
                                    ) : (
                                        <span className="text-gray-800">{subcat.name}</span>
                                    )}
                                </div>

                                <div className="flex space-x-2">
                                    {editIndex === index ? (
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={handleUpdate}
                                            className="px-3 py-1"
                                        >
                                            {t.save}
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={() => handleEdit(index)}
                                            className="px-3 py-1"
                                        >
                                            {t.edit}
                                        </Button>
                                    )}

                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={() => handleDelete(index)}
                                        className="px-3 py-1"
                                    >
                                        {t.delete}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-10">
                    <Button
                        onClick={() => Inertia.visit('/categories')}
                        variant="secondary"
                        disabled={processing}
                        className="px-6 py-2 mt-4"
                    >
                        {t.cancel}
                    </Button>
                    <Button type="submit" disabled={processing} className="px-6 py-2 mt-4">
                        {processing ? t.saving : t.save}
                    </Button>
                </div>
            </FormWrapper>
        </div>
    );
};

export default CategoryForm;
