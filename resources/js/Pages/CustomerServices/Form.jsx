import React, { useState,useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button, Select, Textarea } from '../../components';
import useIsMobile from '@/utils/useIsMobile';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const CustomerServiceForm = ({ customerService = null, customers = [], services = [], statuses = [],
    genders, states, townships, citizens,service_url }) => {

    const [selectedCustomerId, setSelectedCustomerId] = useState(customerService?.customer_id || '');

    const [formData, setFormData] = useState({
        customer_id: customerService?.customer_id || '',
        line_user_id: customerService?.customer?.line_user_id || '',
        name_eng: customerService?.customer?.user?.name || '',
        name_mm: customerService?.customer?.name_mm || '',
        sex: customerService?.customer?.sex || 'Male',
        dob: customerService?.customer?.dob || '',
        nrc_no: customerService?.customer?.nrc_no || '',
        nationality: customerService?.customer?.nationality || '',
        passport_no: customerService?.customer?.passport_no || '',
        passport_expiry_date: customerService?.customer?.passport_expiry || '',
        visa_type: customerService?.customer?.visa_type || '',
        visa_expiry_date: customerService?.customer?.visa_expiry || '',
        ci_no: customerService?.customer?.ci_no || '',
        ci_expiry_date: customerService?.customer?.ci_expiry || '',
        pink_card_no: customerService?.customer?.pink_card_no || '',
        pink_card_expiry_date: customerService?.customer?.pink_card_expiry || '',
        phone_primary: customerService?.customer?.phone || '',
        phone_secondary: customerService?.customer?.phone_secondary || '',
        email: customerService?.customer?.user?.email || '',
        current_address: customerService?.customer?.address || '',
        service_id: customerService?.service_id || '',
        status: customerService?.status ?? 2,
        reject_note: customerService?.reject_note || '',

        state: '',
        township: '',
        citizen: '',
        nrc: '',
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [sent, setSent] = useState(false);

    const [availableTownships, setAvailableTownships] = useState([]);
    const isMobile = useIsMobile(); 

    const { language } = useLanguage();
    const t = translations[language];
    
    useEffect(() => {
        if (customerService?.customer?.nrc_no) {
        const nrcString = customerService?.customer.nrc_no;
        const match = nrcString.match(/^(\d+)\/([^\(]+)\(([^)]+)\)(.+)$/);
        if (match) {
            const stateValue = match[1];
            setFormData((prev) => ({
            ...prev,
                state: stateValue,
                township: match[2],
                citizen: match[3],
                nrc: match[4],
            }));
            setAvailableTownships(townships?.[stateValue] || []);
        }
        } else {
        resetNrcFields();
        }
    }, [customerService, townships]);

    const resetNrcFields = () => {
        setFormData((prev) => ({
        ...prev,
        state: '',
        township: '',
        citizen: '',
        nrc: '',
        }));
        setAvailableTownships([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStateChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === 'state') {
            setAvailableTownships(townships?.[value] || []);
        }
    };

    const handleCustomerSelect = (customerId) => {
        setSelectedCustomerId(customerId);
        const selected = customers.find(c => c.id == customerId);
        if (selected) {
            const updatedFormData = {
                customer_id: selected.id,
                name_eng: selected.user.name || '',
                name_mm: selected.name_mm || '',
                sex: selected.sex || '',
                dob: selected.dob || '',
                nrc_no: selected.nrc_no || '',
                nationality: selected.nationality || '',
                passport_no: selected.passport_no || '',
                passport_expiry_date: selected.passport_expiry || '',
                visa_type: selected.visa_type || '',
                visa_expiry_date: selected.visa_expiry || '',
                ci_no: selected.ci_no || '',
                ci_expiry_date: selected.ci_expiry || '',
                pink_card_no: selected.pink_card_no || '',
                pink_card_expiry_date: selected.pink_card_expiry || '',
                phone_primary: selected.phone || '',
                phone_secondary: selected.phone_secondary || '',
                email: selected.user.email || '',
                current_address: selected.address || '',

                state: '',
                township: '',
                citizen: '',
                nrc: '',
            };

            if (selected.nrc_no) {
                const match = selected.nrc_no.match(/^(\d+)\/([^\(]+)\(([^)]+)\)(.+)$/);
                if (match) {
                    updatedFormData.state = match[1];
                    updatedFormData.township = match[2];
                    updatedFormData.citizen = match[3];
                    updatedFormData.nrc = match[4];
                    setAvailableTownships(townships?.[match[1]] || []);
                } else {
                    setAvailableTownships([]);
                }
            } else {
                setAvailableTownships([]);
            }

            setFormData(updatedFormData);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(service_url)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); 
            })
            .catch(err => console.error('Failed to copy URL:', err));
    };

    const handleSendToLine = () => {
        setSent(false);

        if (!formData.line_user_id) {
            console.warn('Line user ID is missing');
            return; 
        }

        Inertia.post('/send-line-message', {
            line_user_id: formData.line_user_id,
            url: service_url,
        }, {
            onSuccess: () => {
                setSent(true);
                setTimeout(() => setSent(false), 2000);
            },
            onError: () => {
                console.error('Failed to send Line message');
            },
        });
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        const fullNrc = formData.state && formData.township && formData.citizen && formData.nrc
        ? `${formData.state}/${formData.township}(${formData.citizen})${formData.nrc}`
        : '';

        const submissionData = {
        ...formData,
            nrc_no: fullNrc,
        };

        const method = customerService ? 'put' : 'post';
        const url = customerService ? `/customer-services/${customerService.id}` : '/customer-services';

        Inertia[method](url, submissionData, {
            onError: (err) => {
                setErrors(err);
                setProcessing(false);
            },
            onSuccess: () => {
                Inertia.visit('/customer-services');
                setProcessing(false);
            },
        });
    };

    const FormRow = (label, name, type = 'text', required = false) => (
        <div className="grid grid-cols-3 gap-4 items-start md:mb-4 text-sm sm:text-sm md:text-base">
            <label htmlFor={name} className="font-medium col-span-1 mt-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="col-span-2">
                <Input
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    error={errors[name]}
                    className="w-full bg-gray-100 md:bg-white"
                />
            </div>
        </div>
    );

    const renderMobile = () => (
        <div className="mx-4 my-6 sm:mx-10 sm:my-10 bg-white text-sm">
            <FormWrapper onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-4">
                    <div>
                        <div className="grid grid-cols-3 gap-4 items-start mb-4 text-sm sm:text-sm md:text-base">
                            <label htmlFor="customer_id" className="font-medium col-span-1 mt-2">
                                {t.chooseCustomer}
                            </label>
                            <div className='col-span-2'>
                                <Select
                                    id="customer_id"
                                    name="customer_id"
                                    value={selectedCustomerId}
                                    onChange={(e) => handleCustomerSelect(e.target.value)}
                                    options={customers.map(c => ({ value: c.id, label: c.cus_id }))}
                                    disabled={!!customerService}
                                    error={errors.customer_id} 
                                    className="bg-gray-100"
                                />                                
                            </div>
                        </div>

                        {FormRow(t.nameEng, 'name_eng','text',true)}
                        {FormRow(t.nameMm, 'name_mm')}

                        <div className="grid grid-cols-3 gap-4 items-start mb-4">
                            <label className="font-medium mt-2 col-span-1">
                                {t.sex} <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="col-span-2">
                                <Select
                                    id="sex"
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    options={genders}
                                    className='bg-gray-100'
                                />
                            </div>
                        </div>

                        {FormRow(t.dob, 'dob', 'date', true)}
                        
                        <div className="grid grid-cols-3 gap-4 items-start mb-4">
                            <label className="font-medium mt-2 col-span-1">
                                {t.nrc} <span className="text-red-500 ml-1">*</span>
                            </label>

                            <div className="col-span-2 w-full space-y-2">
                                <div className="grid grid-cols-5 gap-2">
                                    <div className="flex items-center space-x-2 col-span-2">
                                        <div className="flex-1">
                                            <Select
                                                name="state"
                                                value={formData.state}
                                                onChange={handleStateChange}
                                                options={states}
                                                placeholder=""
                                                className="px-0 bg-gray-100"
                                            />
                                        </div>
                                        <span>/</span>
                                    </div>
                                    <div className="col-span-3">
                                        <Select
                                            name="township"
                                            value={formData.township}
                                            onChange={handleChange}
                                            options={availableTownships}
                                            placeholder=""
                                            isDisabled={!availableTownships.length}
                                            className="px-0 bg-gray-100"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-5 gap-2">
                                    <div className="flex items-center space-x-2 col-span-2">
                                        <div className="flex-1">
                                            <Select
                                                name="citizen"
                                                value={formData.citizen}
                                                onChange={handleChange}
                                                options={citizens}
                                                placeholder=""
                                                className="px-0 bg-gray-100"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            name="nrc"
                                            value={formData.nrc}
                                            onChange={handleChange}
                                            className="border p-2 rounded w-full bg-gray-100"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {FormRow(t.nationality, 'nationality')}
                        {FormRow(t.passportNo, 'passport_no')}
                        {FormRow(t.passportExpiry, 'passport_expiry_date', 'date')}
                        {FormRow(t.visaType, 'visa_type')}
                        {FormRow(t.visaExpiry, 'visa_expiry_date', 'date')}
                    </div>

                    <div>
                        {FormRow(t.ciNo, 'ci_no')}
                        {FormRow(t.ciExpiryDate, 'ci_expiry_date', 'date')}
                        {FormRow(t.pinkCardNo, 'pink_card_no')}
                        {FormRow(t.pinkCardExpiry, 'pink_card_expiry_date', 'date')}
                        {FormRow(t.phonePrimary, 'phone_primary','text',true)}
                        {FormRow(t.phoneSecondary, 'phone_secondary')}
                        {FormRow(t.email, 'email','text',true)}

                        <div className="flex flex-row items-center gap-3 mb-4 text-sm sm:text-sm md:text-base">
                            <label className="font-medium w-1/3 mt-2">
                                {t.currentAddress}
                            </label>
                            <div className="w-2/3">
                                <Textarea
                                    id="current_address"
                                    name="current_address"
                                    value={formData.current_address}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-start md:mb-4 text-sm sm:text-sm md:text-base">
                        <label htmlFor="service_id" className="font-medium col-span-1 mt-2">
                            {t.requestType}
                        </label>
                        <div className='col-span-2'>
                            <Select
                                id="service_id"
                                name="service_id"
                                value={formData.service_id}
                                onChange={handleChange}
                                options={services.map(s => ({ value: s.id, label: s.title }))}
                                error={errors.service_id} 
                                className="bg-gray-100" 
                            />
                        </div>
                    </div>
                    <div></div>

                    <div className="grid grid-cols-3 gap-4 items-start md:mb-4 text-sm sm:text-sm md:text-base">
                        <label htmlFor="status" className="font-medium col-span-1 mt-2">
                            {t.serviceStatus}
                        </label>
                        <div className='col-span-2'>
                            <Select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                options={statuses}
                                error={errors.status} 
                                className="bg-gray-100" 
                            />
                        </div>
                    </div> 
                    <div></div> 
                    
                    {formData.status == 4 && (
                        <div className="flex flex-row items-center gap-3 mb-4 text-sm sm:text-sm md:text-base">
                            <label className="font-medium w-1/3 mt-2">
                                {t.rejectNote}
                            </label>
                            <div className="w-2/3">
                                <Textarea
                                    id="reject_note"
                                    name="reject_note"
                                    value={formData.reject_note}
                                    onChange={handleChange}
                                    error={errors.reject_note}
                                    required
                                    className="w-full bg-gray-100" 
                                />
                            </div>
                        </div>
                    )}             
                </div>

                {customerService && (
                    <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 mt-6 space-y-4 sm:space-y-0">
                        <div className="w-full sm:w-auto">
                            <label className="block font-semibold text-gray-700 mb-2">{t.customerServiceUrl}</label>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 border border-gray-300 rounded-lg px-5 py-3 text-sm font-mono text-gray-800 w-full shadow-sm">
                                <div className="truncate sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl overflow-hidden text-ellipsis pr-4">
                                    {service_url}
                                </div>
                                <div className="flex space-x-4 mt-3 sm:mt-0 sm:ml-4">
                                    <div className="relative flex items-center space-x-4">
                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            className="px-2 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition relative"
                                        >
                                            {t.copy}
                                            {copied && (
                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-green-600 text-white text-xs px-2 py-1 rounded shadow-md z-10">
                                                    {t.copied}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSendToLine}
                                        className="px-2 py-1 rounded-md border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition"
                                    >
                                        {t.send}
                                    </button>
                                    {sent && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-green-600 text-white text-xs px-2 py-1 rounded shadow-md z-10">
                                            {t.sent}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-8">
                    <Button onClick={() => Inertia.visit('/customer-services')} variant="secondary" disabled={processing}>
                        {t.cancel}
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? t.saving : t.save}
                    </Button>
                </div>
            </FormWrapper>
        </div>
    );


    const renderDesktop = () => (
        <div className="mx-4 my-6 sm:mx-10 sm:my-10">
            <FormWrapper onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="grid grid-cols-3 mb-6">
                            <div className="flex justify-start items-center col-span-1">
                                <label htmlFor="customer_id" className="font-medium w-full max-w-[200px]">
                                    {t.chooseCustomer}
                                </label>
                            </div>
                            <div className='col-span-2'>
                                <Select
                                    id="customer_id"
                                    name="customer_id"
                                    value={selectedCustomerId}
                                    onChange={(e) => handleCustomerSelect(e.target.value)}
                                    options={customers.map(c => ({ value: c.id, label: c.cus_id }))}
                                    disabled={!!customerService}
                                    error={errors.customer_id} 
                                />                                
                            </div>
                        </div>

                        {FormRow(t.nameEng, 'name_eng', 'text', true)}
                        {FormRow(t.nameMm, 'name_mm')}
                        <div className="grid grid-cols-3 gap-4 items-start mb-4">
                            <label className="font-medium mt-2 col-span-1">
                                {t.sex} <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="col-span-2">
                                <Select
                                    id="sex"
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    options={genders}
                                />
                            </div>
                        </div>
                        {FormRow(t.dob, 'dob', 'date', true)}
                        
                        <div className="grid grid-cols-3 gap-4 items-start mb-4">
                            <label className="font-medium mt-2 col-span-1">
                                {t.nrc} <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="col-span-2 w-full space-y-2">
                                <div className="grid grid-cols-5 gap-2">
                                    <div className="flex items-center space-x-2 col-span-2">
                                        <div className="flex-1">
                                            <Select
                                                name="state"
                                                value={formData.state}
                                                onChange={handleStateChange}
                                                options={states}
                                                placeholder=""
                                                className="px-0"
                                            />
                                        </div>
                                        <span>/</span>
                                    </div>
                                    <div className="col-span-3">
                                        <Select
                                            name="township"
                                            value={formData.township}
                                            onChange={handleChange}
                                            options={availableTownships}
                                            placeholder=""
                                            isDisabled={!availableTownships.length}
                                            className="px-0"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    <div className="flex items-center space-x-2 col-span-2">
                                        <div className="flex-1">
                                            <Select
                                                name="citizen"
                                                value={formData.citizen}
                                                onChange={handleChange}
                                                options={citizens}
                                                placeholder=""
                                                className="px-0"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            name="nrc"
                                            value={formData.nrc}
                                            onChange={handleChange}
                                            className="border p-2 rounded w-full"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {FormRow(t.nationality, 'nationality')}
                        {FormRow(t.passportNo, 'passport_no')}
                        {FormRow(t.passportExpiry, 'passport_expiry_date', 'date')}
                        {FormRow(t.visaType, 'visa_type')}
                        {FormRow(t.visaExpiry, 'visa_expiry_date', 'date')}
                    </div>

                    <div>
                        {FormRow(t.ciNo, 'ci_no')}
                        {FormRow(t.ciExpiryDate, 'ci_expiry_date', 'date')}
                        {FormRow(t.pinkCardNo, 'pink_card_no')}
                        {FormRow(t.pinkCardExpiry, 'pink_card_expiry_date', 'date')}
                        {FormRow(t.phonePrimary, 'phone_primary', 'text', true)}
                        {FormRow(t.phoneSecondary, 'phone_secondary')}
                        {FormRow(t.email, 'email', 'text', true)}

                        <div className="grid grid-cols-3">
                            <div className="flex justify-start items-center col-span-1">
                                <label htmlFor="current_address" className="font-medium w-full max-w-[200px]">{t.currentAddress}</label>
                            </div>
                            <div className='col-span-2'>
                                <Textarea id="current_address" name="current_address" value={formData.current_address} onChange={handleChange} className="w-full" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3">
                        <div className="flex justify-end items-center bg-primary-theme-color mx-3 px-4 col-span-1">
                            <label htmlFor="service_id" className="font-medium w-full max-w-[200px]">{t.requestType}</label>
                        </div>
                        <div className='col-span-2'>
                            <Select
                                id="service_id"
                                name="service_id"
                                value={formData.service_id}
                                onChange={handleChange}
                                options={services.map(s => ({ value: s.id, label: s.title }))}
                                error={errors.service_id} 
                            />
                        </div>
                    </div>
                    <div></div>

                    <div className="grid grid-cols-3">
                        <div className="flex justify-end items-center bg-primary-theme-color mx-3 px-4 col-span-1">
                            <label htmlFor="status" className="font-medium w-full max-w-[200px]">{t.serviceStatus}</label>
                        </div>
                        <div className='col-span-2'>
                            <Select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                options={statuses}
                                error={errors.status} 
                            />
                        </div>
                    </div>
                    <div></div> 
                    
                    {formData.status == 4 && (
                        <div className="grid grid-cols-2 mt-4">
                            <label htmlFor="reject_note" className="font-medium w-full max-w-[200px]">
                                {t.rejectNote} <span className="text-red-500 ml-1">*</span>
                            </label>
                            <Textarea
                                id="reject_note"
                                name="reject_note"
                                value={formData.reject_note}
                                onChange={handleChange}
                                className="w-full"
                                error={errors.reject_note}
                                required
                            />
                        </div>
                    )}             
                </div>

                {customerService && (
                    <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 mt-6 space-y-4 sm:space-y-0">
                        <div className="w-full sm:w-auto">
                            <label className="block font-semibold text-gray-700 mb-2">{t.customerServiceUrl}</label>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 border border-gray-300 rounded-lg px-5 py-3 text-sm font-mono text-gray-800 w-full shadow-sm">
                                <div className="truncate sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl overflow-hidden text-ellipsis pr-4">
                                    {service_url}
                                </div>
                                <div className="flex space-x-4 mt-3 sm:mt-0 sm:ml-4">
                                    <div className="relative flex items-center space-x-4">
                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            className="px-2 py-1 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition relative"
                                        >
                                            {t.copy}
                                            {copied && (
                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-green-600 text-white text-xs px-2 py-1 rounded shadow-md z-10">
                                                    {t.copied}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSendToLine}
                                        className="px-2 py-1 rounded-md border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition"
                                    >
                                        {t.send}
                                    </button>
                                    {sent && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-green-600 text-white text-xs px-2 py-1 rounded shadow-md z-10">
                                            {t.sent}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-8">
                    <Button onClick={() => Inertia.visit('/customer-services')} variant="secondary" disabled={processing}>
                        {t.cancel}
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? t.saving : t.save}
                    </Button>
                </div>
            </FormWrapper>
        </div>
    );


    return isMobile ? renderMobile() : renderDesktop();
};

export default CustomerServiceForm;
