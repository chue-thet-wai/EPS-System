import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button } from '../../components';
import useIsMobile from '@/utils/useIsMobile';
import { FiUser, FiLock } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const Login = () => {
    const isMobile = useIsMobile();
    const { language } = useLanguage();
    const t = translations[language];

    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
        setProcessing(true);
        setErrors({});

        Inertia.post('/login', formData, {
            onError: (backendErrors) => {
                setErrors(backendErrors);
                setProcessing(false);
            },
            onSuccess: () => {
                setProcessing(false);
            },
        });
    };

    const renderMobileView = () => (
        <div className="flex flex-col justify-center items-center bg-white px-4 pt-10 text-sm min-h-screen">
            <div className="w-full max-w-sm mx-auto bg-white p-6">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-32 h-32 bg-gray-300 flex items-center justify-center text-lg font-bold">
                        Logo
                    </div>
                </div>

                <h2 className="text-center text-gray-700 text-base tracking-widest mb-6">{t.loginTitle}</h2>

                <FormWrapper onSubmit={handleSubmit}>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    <div className="flex items-center bg-gray-800 text-white px-4 py-3 rounded mb-4">
                        <FiUser className="mr-2 w-5 h-5" />
                        <input
                            type="email"
                            name="email"
                            placeholder={t.emailPlaceholder}
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-transparent flex-1 outline-none text-white placeholder-gray-300 text-sm sm:text-base"
                        />
                    </div>

                    <div className="flex items-center bg-gray-800 text-white px-4 py-3 rounded mb-4">
                        <FiLock className="mr-2 w-5 h-5" />
                        <input
                            type="password"
                            name="password"
                            placeholder={t.passwordPlaceholder}
                            value={formData.password}
                            onChange={handleChange}
                            className="bg-transparent flex-1 outline-none text-white placeholder-gray-300 text-sm sm:text-base"
                        />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 mb-6">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2 accent-gray-700" />
                            {t.rememberMe}
                        </label>
                        {/* <a href="/forgot-password" className="hover:underline">
                            {t.forgotPassword}
                        </a> */}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2 mb-4 text-white bg-gray-800 rounded uppercase tracking-widest hover:bg-gray-900"
                    >
                        {processing ? t.loggingIn : t.login}
                    </button>
                </FormWrapper>
            </div>
        </div>
    );

    const renderDesktopView = () => (
        <div className="flex flex-col min-h-screen bg-primary-theme-color">
            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{t.welcomeEpsSystem}</h1>
                    <FormWrapper onSubmit={handleSubmit} shadow="shadow-none">
                        <div className="mb-4">
                            <Label htmlFor="email">{t.email}</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={t.enterYourEmail}
                                error={errors.email}
                            />
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="password">{t.password}</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={t.enterYourPassword}
                                error={errors.password}
                            />
                        </div>

                        <div className="py-4">
                            <Button
                                type="submit"
                                disabled={processing}
                                className={
                                    "w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-150 ease-in-out " +
                                    (processing ? "opacity-50 cursor-not-allowed" : "")
                                }
                            >
                                {processing ? t.loggingIn : t.login}
                            </Button>
                        </div>
                    </FormWrapper>
                </div>
            </div>
            <footer className="text-center text-white py-4">
                {t.createdBy}
            </footer>
        </div>
    );

    return isMobile ? renderMobileView() : renderDesktopView();
};

export default Login;
