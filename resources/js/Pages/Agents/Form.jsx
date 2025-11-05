import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button, Textarea } from '../../components';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const AgentForm = ({ agent = null }) => {
    const { language } = useLanguage();
    const t = translations[language];

    const [formData, setFormData] = useState({
        name: agent?.user?.name || '',
        email: agent?.user?.email || '',
        password: '',
        password_confirmation: '',
        biz_name: agent?.biz_name || '',
        phone: agent?.phone || '',
        location: agent?.location || '',
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

        const action = agent ? 'put' : 'post';
        const url = agent ? `/agents/${agent.id}` : '/agents';

        Inertia[action](url, formData, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                Inertia.visit('/agents');
                setProcessing(false);
            },
        });
    };

    return (
        <div className="mx-4 my-6 sm:mx-10 sm:my-10">
            <FormWrapper onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="name" required>
                        {t.name}
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t.enterAgentName}
                        error={errors.name}
                    />
                </div>

                <div>
                    <Label htmlFor="email" required>
                        {t.email}
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t.enterEmail}
                        error={errors.email}
                    />
                </div>

                <div>
                    <Label htmlFor="password" required>
                        {t.password}
                    </Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={t.enterPassword}
                        error={errors.password}
                    />
                </div>

                <div>
                    <Label htmlFor="password_confirmation" required>
                        {t.confirmPassword}
                    </Label>
                    <Input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder={t.reEnterPassword}
                        error={errors.password_confirmation}
                    />
                </div>

                <div>
                    <Label htmlFor="biz_name">
                        {t.bizName}
                    </Label>
                    <Input
                        id="biz_name"
                        name="biz_name"
                        value={formData.biz_name}
                        onChange={handleChange}
                        placeholder={t.enterBusinessName}
                        error={errors.biz_name}
                    />
                </div>

                <div>
                    <Label htmlFor="phone">
                        {t.phoneNumber}
                    </Label>
                    <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t.enterPhone}
                        error={errors.phone}
                    />
                </div>

                <div>
                    <Label htmlFor="location">
                        {t.location}
                    </Label>
                    <Textarea
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full"
                    />
                </div>

                <div className="flex justify-end space-x-3 mt-4">
                    <Button
                        onClick={() => Inertia.visit('/agents')}
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

export default AgentForm;
