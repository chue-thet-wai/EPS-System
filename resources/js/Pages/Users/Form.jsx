import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button } from '../../components';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const UserForm = ({ user = null }) => {
    const { language } = useLanguage();
    const t = translations[language];

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
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

        const action = user ? 'put' : 'post';
        const url = user ? `/users/${user.id}` : '/users';

        Inertia[action](url, formData, {
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                Inertia.visit('/users');
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
                        placeholder={t.enterUserName}
                        aria-invalid={!!errors.name}
                        aria-describedby="name-error"
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
                        aria-invalid={!!errors.email}
                        aria-describedby="email-error"
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
                        aria-invalid={!!errors.password}
                        aria-describedby="password-error"
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
                        aria-invalid={!!errors.password_confirmation}
                        aria-describedby="password_confirmation-error"
                        error={errors.password_confirmation}
                    />
                </div>

                <div className="flex justify-end space-x-3 mt-4">
                    <Button
                        onClick={() => Inertia.visit('/users')}
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

export default UserForm;
