import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Label, Button } from '../../components';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const Detail = ({ applicant = null }) => {
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="mx-4 my-6 sm:mx-10 sm:my-10">
            <div className="space-y-4">
                <div>
                    <Label>{t.name}</Label>
                    <p className="text-gray-700">{applicant.customer.user?.name || '-'}</p>
                </div>

                <div>
                    <Label>{t.email}</Label>
                    <p className="text-gray-700">{applicant.customer.user?.email || '-'}</p>
                </div>

                <div className="flex mt-6">
                    
                    {applicant?.cv_path ? (
                        <Button variant="secondary">
                            <a
                                href={`http://sgp1.digitaloceanspaces.com/assets-kidcares/${applicant.cv_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600"
                            >
                                Download CV
                            </a>
                        </Button>
                    ) : (
                        <p className="text-gray-500">Not Uploaded</p>
                    )}
                    
                    <Button
                        onClick={() => Inertia.visit('/applicants')}
                        variant="secondary"
                        className='mx-6'
                    >
                        {t.back}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Detail;
