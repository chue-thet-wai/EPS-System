import React, { useState, useRef ,useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { FormWrapper, Label, Input, Button, Textarea,Modal, Camera, Select } from '../../components';
import Tesseract from 'tesseract.js';
import moment from 'moment';
import useIsMobile from '@/utils/useIsMobile';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../utils/lang';

const CustomerForm = ({ customer = null, genders, states, townships, citizens, }) => {
    const [formData, setFormData] = useState({
        customer_id: customer?.customer_id || '',
        name_eng: customer?.user?.name || '',
        name_mm: customer?.name_mm || '',
        nationality: customer?.nationality || '',
        dob: customer?.dob || '',
        sex: customer?.sex || 'Male',
        nrc_no: customer?.nrc_no || '',
        prev_passport_no: customer?.prev_passport_no || '',
        passport_no: customer?.passport_no || '',
        passport_expiry: customer?.passport_expiry || '',
        visa_type: customer?.visa_type || '',
        visa_number: customer?.visa_number || '',
        visa_expiry: customer?.visa_expiry || '',
        ci_no: customer?.ci_no || '',
        ci_expiry: customer?.ci_expiry || '',
        pink_card_no: customer?.pink_card_no || '',
        pink_card_expiry: customer?.pink_card_expiry || '',
        phone_primary: customer?.phone || '',
        phone_secondary: customer?.phone_secondary || '',
        email: customer?.user?.email || '',
        current_address: customer?.address || '',

        state: '',
        township: '',
        citizen: '',
        nrc: '',
        documents: [],
        attachments: customer?.attachments || [],
        attachments_to_delete: []
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);


    const [availableTownships, setAvailableTownships] = useState([]);
    const isMobile = useIsMobile(); 

    const { language } = useLanguage();
    const t = translations[language];

    useEffect(() => {
        if (customer?.nrc_no) {
        const nrcString = customer.nrc_no;
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
        setFormData((prev) => ({
            ...prev,
            attachments: customer?.attachments || [],
            attachments_to_delete: [],
        }));
    }, [customer, townships]);

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


    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        const fullNrc = formData.state && formData.township && formData.citizen && formData.nrc
            ? `${formData.state}/${formData.township}(${formData.citizen})${formData.nrc}`
            : '';

        const submissionData = new FormData();

        // Append normal form data
        Object.keys(formData).forEach((key) => {
            submissionData.append(key, formData[key]);
        });

        // Append NRC
        submissionData.append('nrc_no', fullNrc);

        // Append all scanned images
        Object.keys(scannedImages).forEach((docType) => {
            const imageData = scannedImages[docType];
            if (imageData) {
                const imageFile = base64ToFile(imageData, `${docType}.png`);
                submissionData.append(`scan_images[${docType}]`, imageFile);
            }
        });

        // Append new files
        if (formData.documents && formData.documents.length > 0) {
            formData.documents.forEach((file) => {
                if (file instanceof File) {
                    submissionData.append('documents[]', file);
                }
            });
        }

        // Append deleted attachment IDs
        if (formData.attachments_to_delete && formData.attachments_to_delete.length > 0) {
            formData.attachments_to_delete.forEach((id) => {
                submissionData.append('attachments_to_delete[]', id);
            });
        }


        const url = customer ? `/customers/${customer.id}?_method=put` : '/customers';

        Inertia.post(url, submissionData, {
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
 

    const [ocrStatus, setOcrStatus] = useState({
        passport: '',
        visa: '',
        ci: '',
        pink_card: '',
    });
    const [cameraOpenFor, setCameraOpenFor] = useState(null);
    const [scannedImages, setScannedImages] = React.useState({
        passport: null,
        visa: null,
        ci: null,
        pink_card: null,
    });

    const openCamera = (type) => {
        setCameraOpenFor(type);
    };

    const closeCamera = () => {
        setCameraOpenFor(null);
    };

    const handleCapture = async (imageData) => {
        handleOCR(imageData, cameraOpenFor);
    };

    function base64ToFile(base64String, filename = 'file.png') {
        const arr = base64String.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }


    const handleOCR = async (imageData, documentType) => {
        console.log('Processing OCR for', documentType);

        if (!imageData) {
            setOcrStatus(prev => ({ ...prev, [documentType]: 'Please select a file first.' }));
            return;
        }

        setOcrStatus(prev => ({ ...prev, [documentType]: 'Processing...' }));

        // Set preview image
        const previewUrl = typeof imageData === 'string'
            ? imageData
            : URL.createObjectURL(imageData);

        setScannedImages(prev => ({
            ...prev,
            [documentType]: previewUrl,
        }));

        try {
            // Convert base64 string to File if needed
            const file = typeof imageData === 'string'
                ? base64ToFile(imageData)
                : imageData;

            const text = await uploadToOCRSpace(file, 'K81551677988957',documentType);

            if (!text) throw new Error('OCR text not found');

            //console.log('OCR result:', text);

            const extracted = extractFieldsFrontend(documentType, text);

            switch (documentType) {
                case 'passport':
                    setFormData(prev => ({
                        ...prev,
                        passport_no: extracted.passport_no || '',
                        passport_expiry: extracted.passport_expiry || '',
                    }));
                    break;
                case 'visa':
                    setFormData(prev => ({
                        ...prev,
                        visa_number: extracted.visa_number || '',
                        visa_expiry: extracted.visa_expiry || '',
                    }));
                    break;
                case 'ci':
                    setFormData(prev => ({
                        ...prev,
                        ci_no: extracted.ci_no || '',
                        ci_expiry: extracted.ci_expiry || '',
                    }));
                    break;
                case 'pink_card':
                    setFormData(prev => ({
                        ...prev,
                        pink_card_no: extracted.pink_card_no || '',
                        pink_card_expiry: extracted.pink_card_expiry || '',
                    }));
                    break;
                default:
                    console.warn('Unhandled document type:', documentType);
            }

            setOcrStatus(prev => ({ ...prev, [documentType]: 'Scan completed successfully.' }));
            closeCamera();
        } catch (error) {
            console.error('OCR error:', error);
            closeCamera();
            setScannedImages(prev => {
                const updated = { ...prev };
                delete updated[documentType];
                return updated;
            });
            setOcrStatus(prev => ({ ...prev, [documentType]: 'Scan failed. Please try again.' }));
        }
    };

    async function uploadToOCRSpace(file, apiKey, documentType = 'passport') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('apikey', apiKey);

        const language = documentType === 'pink_card' ? 'tha' : 'eng';

        formData.append('language', language);
        formData.append('isOverlayRequired', 'false');
        formData.append('OCREngine', '2');
        formData.append('scale', 'true');
        formData.append('detectOrientation', 'true');

        try {
            const response = await fetch('https://api.ocr.space/parse/image', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            return result?.ParsedResults?.[0]?.ParsedText || null;
        } catch (err) {
            console.error('OCR.Space error:', err);
            return null;
        }
    }


    const extractFieldsFrontend = (type, text) => {
        let result = {};

        if (type === 'passport') {
            const passportMatch = text.match(/Passport\s*No\s*\n?([A-Z0-9]+)/i);
            result.passport_no = passportMatch?.[1] || '';

            const expiryMatch = text.match(/Date\s*of\s*expiry\s*\n?([0-9]{1,2}\s+[A-Z]{3,9}\s+[0-9]{4})/i);
            if (expiryMatch?.[1]) {
                const dateObj = new Date(expiryMatch[1]);
                result.passport_expiry = isNaN(dateObj) ? '' : dateObj.toISOString().slice(0, 10);
            }
        }

        if (type === 'visa') {
            const visaTypeMatch = text.match(/[A-Z0-9]{6,10}/);
            result.visa_number = visaTypeMatch?.[0] || '';

            const expiryMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);
            result.visa_expiry = expiryMatch?.[0] || '';
        }

        if (type === 'ci') {
            const ciMatch = text.match(/CIO\s*NO[:\s]*([A-Z0-9]+)/);
            result.ci_no = ciMatch?.[1] || '';

            const expiryMatch = text.match(/Date\s*of\s*expiry\s*\n?([0-9]{1,2}\s+[A-Z]{3,9}\s+[0-9]{4})/i);
            if (expiryMatch?.[1]) {
                const dateObj = new Date(expiryMatch[1]);
                result.ci_expiry = isNaN(dateObj) ? '' : dateObj.toISOString().slice(0, 10);
            }
        }

        if (type === 'pink_card') {
            const pinkCardMatch = text.match(/\d{2}\s\d{4}\s\d{6}\s\d/);
            result.pink_card_no = pinkCardMatch?.[0] || '';

            const expiryMatch = text.match(/(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4})(?=\s*Date of Expiry)/i);
            if (expiryMatch?.[1]) {
                const dateObj = new Date(expiryMatch[1]);
                result.pink_card_expiry = isNaN(dateObj) ? '' : dateObj.toISOString().slice(0, 10);
            }
        }

        return result;
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
        <div className="bg-white p-6">
            <FormWrapper onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-4">
                    {customer && (
                        <div className="grid grid-cols-3 gap-4 items-start md:mb-4 text-sm sm:text-sm md:text-base">
                            <label htmlFor="customer_id" className="font-medium col-span-1 mt-2">
                                {t.customerId}
                            </label>
                            <div className="col-span-2">
                                <Input
                                    id="customer_id"
                                    name="customer_id"
                                    type="text"
                                    value={formData.customer_id}
                                    onChange={handleChange}
                                    readOnly
                                    className="bg-gray-100"
                                />
                            </div>
                        </div>
                    )}

                    {FormRow(t.nameEng, 'name_eng', 'text', true)}
                    {FormRow(t.nameMm, 'name_mm')}

                    <div className="flex flex-row items-center gap-3 mb-4 text-sm sm:text-sm md:text-base">
                        <label className="font-medium w-1/3 mt-2">
                            {t.sex} <span className="text-red-500">*</span>
                        </label>
                        <div className="w-2/3">
                            <Select
                                id="sex"
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                options={genders}
                                className="bg-gray-100"
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

                    {/* Passport */}
                    <div className="mb-4 text-sm sm:text-sm md:text-base">
                        <div className="mb-4 font-bold text-sm text-gray-900">{t.passportDetails}</div>
                        <div className="flex">
                            <Button
                                type="button"
                                onClick={() => openCamera('passport')}
                                disabled={ocrStatus.passport === 'Processing...'}
                                className={`mb-4 whitespace-nowrap px-3 py-2 text-sm font-semibold rounded transition ${
                                    ocrStatus.passport === 'Processing...'
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {ocrStatus.passport === 'Processing...' ? t.scanning : t.scanPassport}
                            </Button>
                        </div>
                        {scannedImages.passport && (
                            <div className="mt-4">
                                <img
                                    src={scannedImages.passport}
                                    alt={t.passportScanned}
                                    className="max-w-xs border rounded shadow w-[200px] h-[200px]"
                                />
                            </div>
                        )}
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 mt-2">{ocrStatus.passport}</p>
                        </div>
                        {FormRow(t.prevPassportNo, 'prev_passport_no')}
                        {FormRow(t.passportNo, 'passport_no')}
                        {FormRow(t.passportExpiry, 'passport_expiry', 'date')}
                    </div>

                    {/* Visa */}
                    <div className="mb-4 text-sm sm:text-sm md:text-base">
                        <div className="mb-4 font-bold text-sm text-gray-900">{t.visaDetails}</div>
                        <div className="flex">
                            <Button
                                type="button"
                                onClick={() => openCamera('visa')}
                                disabled={ocrStatus.visa === 'Processing...'}
                                className={`mb-4 whitespace-nowrap px-3 py-2 text-sm font-semibold rounded transition ${
                                    ocrStatus.visa === 'Processing...'
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {ocrStatus.visa === 'Processing...' ? t.scanning : t.scanVisa}
                            </Button>
                        </div>
                        {scannedImages.visa && (
                            <div className="mt-4">
                                <img
                                    src={scannedImages.visa}
                                    alt={t.visaScanned}
                                    className="max-w-xs border rounded shadow w-[200px] h-[200px]"
                                />
                            </div>
                        )}
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 mt-2">{ocrStatus.visa}</p>
                        </div>
                        <div>
                            <div className="grid grid-cols-3 gap-4 items-start md:mb-4 text-sm sm:text-sm md:text-base">
                                <label htmlFor={name} className="font-medium col-span-1 mt-2">
                                    {t.visaType}
                                </label>

                                <div className="col-span-2">
                                    <Input
                                        id="visa_type"
                                        name="visa_type"
                                        type="text"
                                        value={formData["visa_type"]}
                                        onChange={handleChange}
                                        error={errors["visa_type"]}
                                        className="w-full bg-gray-100 md:bg-white"
                                        disabled="disabled"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {FormRow(t.visaNumber, 'visa_number')}                        
                        {FormRow(t.visaExpiry, 'visa_expiry', 'date')}
                    </div>

                    {/* CI */}
                    <div className="mb-4 text-sm sm:text-sm md:text-base">
                        <div className="mb-4 font-bold text-sm text-gray-900">{t.ciDetails}</div>
                        <div className="flex">
                            <Button
                                type="button"
                                onClick={() => openCamera('ci')}
                                disabled={ocrStatus.ci === 'Processing...'}
                                className={`mb-4 whitespace-nowrap px-3 py-2 text-sm font-semibold rounded transition ${
                                    ocrStatus.ci === 'Processing...'
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {ocrStatus.ci === 'Processing...' ? t.scanning : t.scanCi}
                            </Button>
                        </div>
                        {scannedImages.ci && (
                            <div className="mt-4">
                                <img
                                    src={scannedImages.ci}
                                    alt={t.ciScanned}
                                    className="max-w-xs border rounded shadow w-[200px] h-[200px]"
                                />
                            </div>
                        )}
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 mt-2">{ocrStatus.ci}</p>
                        </div>
                        {FormRow(t.ciNo, 'ci_no')}
                        {FormRow(t.ciExpiryDate, 'ci_expiry', 'date')}
                    </div>

                    {/* Pink Card */}
                    <div className="mb-4 text-sm sm:text-sm md:text-base">
                        <div className="mb-4 font-bold text-sm text-gray-900">{t.pinkCardDetails}</div>
                        <div className="flex">
                            <Button
                                type="button"
                                onClick={() => openCamera('pink_card')}
                                disabled={ocrStatus.pink_card === 'Processing...'}
                                className={`mb-4 whitespace-nowrap px-3 py-2 text-sm font-semibold rounded transition ${
                                    ocrStatus.pink_card === 'Processing...'
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {ocrStatus.pink_card === 'Processing...' ? t.scanning : t.scanPinkCard}
                            </Button>
                        </div>
                        {scannedImages.pink_card && (
                            <div className="mt-4">
                                <img
                                    src={scannedImages.pink_card}
                                    alt={t.pinkCardScanned}
                                    className="max-w-xs border rounded shadow w-[200px] h-[200px]"
                                />
                            </div>
                        )}
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 mt-2">{ocrStatus.pink_card}</p>
                        </div>
                        {FormRow(t.pinkCardNo, 'pink_card_no')}
                        {FormRow(t.pinkCardExpiry, 'pink_card_expiry', 'date')}
                    </div>

                    {FormRow(t.phonePrimary, 'phone_primary', 'text', true)}
                    {FormRow(t.phoneSecondary, 'phone_secondary')}
                    {FormRow(t.email, 'email', 'text', true)}

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

                    <div className="grid grid-cols-3 gap-4 items-start mb-4">
                        <label className="font-medium mt-2 col-span-1">
                            {t.uploadDocuments || 'Attachment Upload'}
                        </label>

                        <div className="col-span-2 space-y-3">
                            <Input
                                type="file"
                                name="documents"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(e.target.files);
                                    setFormData((prev) => ({
                                    ...prev,
                                    documents: files,
                                    }));
                                }}
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white"
                            />

                            {formData.attachments?.length > 0 && (
                            <ul className="space-y-2 text-sm text-gray-700">
                                {formData.attachments.map((file) => (
                                <li
                                    key={file.id}
                                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
                                >
                                    <a
                                        href={`http://sgp1.digitaloceanspaces.com/assets-kidcares/${file.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline truncate"
                                        title={file.file_name}
                                        >
                                        {file.file_name}
                                    </a>

                                    <button
                                    type="button"
                                    className="ml-3 text-red-600 hover:text-red-800 font-medium"
                                    onClick={() => {
                                        setFormData((prev) => ({
                                        ...prev,
                                        attachments_to_delete: [
                                            ...(prev.attachments_to_delete || []),
                                            file.id,
                                        ],
                                        attachments: prev.attachments.filter(
                                            (att) => att.id !== file.id
                                        ),
                                        }));
                                    }}
                                    >
                                    {t.remove || 'Remove'}
                                    </button>
                                </li>
                                ))}
                            </ul>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-4 text-sm sm:text-sm md:text-base">
                        <Button onClick={() => Inertia.visit('/customers')} variant="secondary" disabled={processing}>
                            {t.back}
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? t.saving : t.save}
                        </Button>
                    </div>
                </div>

                {cameraOpenFor && (
                    <Camera
                        isOpen={true}
                        onClose={closeCamera}
                        onCapture={handleCapture}
                        documentType={cameraOpenFor}
                    />
                )}
            </FormWrapper>
        </div>
    );


    const renderDesktop = () => (
        <div className="mx-4 my-6 sm:mx-10 sm:my-10">
            <FormWrapper onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        {customer && (
                            <div className="grid grid-cols-3 gap-4 items-start mb-4">
                                <label htmlFor="customer_id" className="font-medium mt-2 col-span-1">
                                    {t.customerId}
                                </label>
                                <div className="col-span-2">
                                    <Input
                                        id="customer_id"
                                        name="customer_id"
                                        type="text"
                                        value={formData.customer_id}
                                        onChange={handleChange}
                                        className="w-full"
                                        readOnly
                                    />
                                </div>
                            </div>
                        )}

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

                        {/* Passport */}
                        <fieldset className="border border-gray-300 rounded p-4 my-4">
                            <legend className="font-semibold text-gray-700 px-2">
                                {t.passportDetails}
                            </legend>
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    onClick={() => openCamera('passport')}
                                    disabled={ocrStatus.passport === 'Processing...'}
                                    className={`mb-4 whitespace-nowrap px-3 py-2 text-sm font-semibold rounded transition ${
                                        ocrStatus.passport === 'Processing...'
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {ocrStatus.passport === 'Processing...' ? t.scanning : t.scanPassport}
                                </Button>
                            </div>
                            {scannedImages.passport && (
                                <div className="mt-4">
                                    <img
                                        src={scannedImages.passport}
                                        alt={t.passportScanned}
                                        className="max-w-xs border rounded shadow w-[200px] h-[200px]"
                                    />
                                </div>
                            )}
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mt-2">{ocrStatus.passport}</p>
                            </div>
                            <div className="mt-4">
                                {FormRow(t.prevPassportNo, 'prev_passport_no')}
                            </div>
                            <div className="mt-4">
                                {FormRow(t.passportNo, 'passport_no')}
                            </div>
                            <div>
                                {FormRow(t.passportExpiry, 'passport_expiry', 'date')}
                            </div>
                        </fieldset>

                        {/* Visa */}
                        <fieldset className="border border-gray-300 rounded p-4 my-4">
                            <legend className="font-semibold text-gray-700 px-2">
                                {t.visaDetails}
                            </legend>
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    onClick={() => openCamera('visa')}
                                    disabled={ocrStatus.visa === 'Processing...'}
                                    className={`mb-4 whitespace-nowrap px-3 py-2 text-sm font-semibold rounded transition ${
                                        ocrStatus.visa === 'Processing...'
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {ocrStatus.visa === 'Processing...' ? t.scanning : t.scanVisa}
                                </Button>
                            </div>
                            {scannedImages.visa && (
                                <div className="mt-4">
                                    <img
                                        src={scannedImages.visa}
                                        alt={t.visaScanned}
                                        className="max-w-xs border rounded shadow w-[200px] h-[200px]"
                                    />
                                </div>
                            )}
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mt-2">{ocrStatus.visa}</p>
                            </div>
                            <div>
                                <div className="grid grid-cols-3 gap-4 items-start md:mb-4 text-sm sm:text-sm md:text-base">
                                    <label htmlFor={name} className="font-medium col-span-1 mt-2">
                                        {t.visaType}
                                    </label>

                                    <div className="col-span-2">
                                        <Input
                                            id="visa_type"
                                            name="visa_type"
                                            type="text"
                                            value={formData["visa_type"]}
                                            onChange={handleChange}
                                            error={errors["visa_type"]}
                                            className="w-full bg-gray-100 md:bg-white"
                                            disabled="disabled"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                {FormRow(t.visaNumber, 'visa_number')}
                            </div>
                            <div>
                                {FormRow(t.visaExpiry, 'visa_expiry', 'date')}
                            </div>
                        </fieldset>

                        {/* CI */}
                        <fieldset className="border border-gray-300 rounded p-4 my-4">
                            <legend className="font-semibold text-gray-700 px-2">
                                {t.ciDetails}
                            </legend>
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    onClick={() => openCamera('ci')}
                                    disabled={ocrStatus.ci === 'Processing...'}
                                    className={`mb-4 whitespace-nowrap px-3 py-2 text-sm font-semibold rounded transition ${
                                        ocrStatus.ci === 'Processing...'
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {ocrStatus.ci === 'Processing...' ? t.scanning : t.scanCi}
                                </Button>
                            </div>
                            {scannedImages.ci && (
                                <div className="mt-4">
                                    <img
                                        src={scannedImages.ci}
                                        alt={t.ciScanned}
                                        className="max-w-xs border rounded shadow w-[200px] h-[200px]"
                                    />
                                </div>
                            )}
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mt-2">{ocrStatus.ci}</p>
                            </div>
                            <div>
                                {FormRow(t.ciNo, 'ci_no')}
                            </div>
                            <div>
                                {FormRow(t.ciExpiryDate, 'ci_expiry', 'date')}
                            </div>
                        </fieldset>
                    </div>

                    <div>
                        {/* Pink Card */}
                        <fieldset className="border border-gray-300 rounded p-4 my-4">
                            <legend className="font-semibold text-gray-700 px-2">
                                {t.pinkCardDetails}
                            </legend>
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    onClick={() => openCamera('pink_card')}
                                    disabled={ocrStatus.pink_card === 'Processing...'}
                                    className={`mb-4 whitespace-nowrap px-3 py-2 text-sm font-semibold rounded transition ${
                                        ocrStatus.pink_card === 'Processing...'
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    {ocrStatus.pink_card === 'Processing...' ? t.scanning : t.scanPinkCard}
                                </Button>
                            </div>
                            {scannedImages.pink_card && (
                                <div className="mt-4">
                                    <img
                                        src={scannedImages.pink_card}
                                        alt={t.pinkCardScanned}
                                        className="max-w-xs border rounded shadow w-[200px] h-[200px]"
                                    />
                                </div>
                            )}
                            <div className="mt-4">
                                <p className="text-sm text-gray-600 mt-2">{ocrStatus.pink_card}</p>
                            </div>
                            <div>
                                {FormRow(t.pinkCardNo, 'pink_card_no')}
                            </div>
                            <div>
                                {FormRow(t.pinkCardExpiry, 'pink_card_expiry', 'date')}
                            </div>
                        </fieldset>

                        {FormRow(t.phonePrimary, 'phone_primary', 'text', true)}
                        {FormRow(t.phoneSecondary, 'phone_secondary')}
                        {FormRow(t.email, 'email', 'text', true)}

                        <div className="grid grid-cols-3 gap-4 items-center mb-4">
                            <label className="font-medium col-span-1">
                                {t.currentAddress}
                            </label>
                            <div className="col-span-2">
                                <Textarea
                                    id="current_address"
                                    name="current_address"
                                    value={formData.current_address}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                      
                        <div className="grid grid-cols-3 gap-4 items-start mb-4">
                            <label className="font-medium mt-2 col-span-1">
                                {t.uploadDocuments || 'Attachment Upload'}
                            </label>

                            <div className="col-span-2 space-y-3">
                                <Input
                                    type="file"
                                    name="documents"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        setFormData((prev) => ({
                                        ...prev,
                                        documents: files,
                                        }));
                                    }}
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white"
                                />

                                {formData.attachments?.length > 0 && (
                                <ul className="space-y-2 text-sm text-gray-700">
                                    {formData.attachments.map((file) => (
                                    <li
                                        key={file.id}
                                        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
                                    >
                                        <a
                                            href={`http://sgp1.digitaloceanspaces.com/assets-kidcares/${file.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline truncate"
                                            title={file.file_name}
                                            >
                                            {file.file_name}
                                        </a>

                                        <button
                                        type="button"
                                        className="ml-3 text-red-600 hover:text-red-800 font-medium"
                                        onClick={() => {
                                            setFormData((prev) => ({
                                            ...prev,
                                            attachments_to_delete: [
                                                ...(prev.attachments_to_delete || []),
                                                file.id,
                                            ],
                                            attachments: prev.attachments.filter(
                                                (att) => att.id !== file.id
                                            ),
                                            }));
                                        }}
                                        >
                                        {t.remove || 'Remove'}
                                        </button>
                                    </li>
                                    ))}
                                </ul>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-4">
                    <Button onClick={() => Inertia.visit('/customers')} variant="secondary" disabled={processing}>
                        {t.back}
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {processing ? t.saving : t.save}
                    </Button>
                </div>
                {cameraOpenFor && (
                    <Camera
                        isOpen={true}
                        onClose={closeCamera}
                        onCapture={handleCapture}
                        documentType={cameraOpenFor}
                    />
                )}
            </FormWrapper>
        </div>
    );

    return isMobile ? renderMobile() : renderDesktop();
};

export default CustomerForm;
