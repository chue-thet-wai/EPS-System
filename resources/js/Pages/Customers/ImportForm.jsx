import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button } from '../../components';
import useIsMobile from '@/utils/useIsMobile';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const CustomerImportForm = () => {
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const isMobile = useIsMobile();

    const { language } = useLanguage();
    const t = translations[language];

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleDownloadFormat = () => {
        window.location.href = '/customers/import-format';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        const formData = new FormData();
        formData.append('file', file);

        Inertia.post('/customers/import', formData, {
            forceFormData: true,
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onSuccess: () => {
                Inertia.visit('/customers');
                setProcessing(false);
            },
        });
    };

    const renderMobile = () => (
        <div className="bg-white p-6">
            <h1 className="text-xl md:text-2xl font-bold mb-5 dark:text-white">
                {t.importCustomers}
            </h1>

            <FormWrapper onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Label htmlFor="file" required className="text-sm md:text-base">
                        {t.uploadFile}
                    </Label>
                    <Input
                        id="file"
                        name="file"
                        type="file"
                        onChange={handleFileChange}
                        aria-invalid={!!errors.file}
                        aria-describedby="file-error"
                        error={errors.file}
                        className="text-sm md:text-base bg-gray-100"
                    />
                    {errors.file && (
                        <p className="text-xs md:text-sm text-red-500 mt-1">{errors.file}</p>
                    )}
                </div>

                <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleDownloadFormat}
                        className="text-sm md:text-base px-2 py-2 md:px-4 md:py-2.5"
                    >
                        {t.format}
                    </Button>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => Inertia.visit('/customers')}
                            variant="secondary"
                            disabled={processing}
                            className="text-sm md:text-base px-2 py-2 md:px-4 md:py-2.5"
                        >
                            {t.cancel}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="text-sm md:text-base px-2 py-2 md:px-4 md:py-2.5"
                        >
                            {processing ? t.importing : t.import}
                        </Button>
                    </div>
                </div>
            </FormWrapper>
        </div>
    );

    const renderDesktop = () => (
        <div className="m-4 md:m-10">
            <h1 className="text-xl md:text-2xl font-bold mb-5 dark:text-white">
                {t.importCustomers}
            </h1>

            <FormWrapper onSubmit={handleSubmit}>
                <div className="mb-4">
                    <Label htmlFor="file" required className="text-sm md:text-base">
                        {t.uploadFile}
                    </Label>
                    <Input
                        id="file"
                        name="file"
                        type="file"
                        onChange={handleFileChange}
                        aria-invalid={!!errors.file}
                        aria-describedby="file-error"
                        error={errors.file}
                        className="text-sm md:text-base"
                    />
                    {errors.file && (
                        <p className="text-xs md:text-sm text-red-500 mt-1">{errors.file}</p>
                    )}
                </div>

                <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleDownloadFormat}
                        className="text-sm md:text-base px-2 py-2 md:px-4 md:py-2.5"
                    >
                        {t.format}
                    </Button>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => Inertia.visit('/customers')}
                            variant="secondary"
                            disabled={processing}
                            className="text-sm md:text-base px-2 py-2 md:px-4 md:py-2.5"
                        >
                            {t.cancel}
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="text-sm md:text-base px-2 py-2 md:px-4 md:py-2.5"
                        >
                            {processing ? t.importing : t.import}
                        </Button>
                    </div>
                </div>
            </FormWrapper>
        </div>
    );

    return isMobile ? renderMobile() : renderDesktop();
};

export default CustomerImportForm;
