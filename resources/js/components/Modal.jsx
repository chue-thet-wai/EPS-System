import React from 'react';
import Button from './Button';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../utils/lang';

const Modal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    buttonText = "Confirm",  
    buttonColor = "bg-primary-theme-color",
    buttonDisabled = false,
    children 
}) => {
    if (!isOpen) return null;
    const { language } = useLanguage();
    const t = translations[language];

    return (
        <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-secondary-dark-bg dark:text-white p-5 rounded-md shadow-md max-w-md w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-300 dark:bg-white text-gray-800 hover:bg-gray-400 hover:text-white"
                >
                    &times;
                </button>

                <h2 className="text-lg font-bold mb-4">{title}</h2>

                {message && (
                    <p className="text-gray-700 dark:text-white mb-6">{message}</p>
                )}

                {children && (
                    <div className="mb-6">
                        {children}
                    </div>
                )}

                <div className="flex justify-end space-x-3">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                    >
                        {t.cancel}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        bgColor={buttonColor}
                        disabled={buttonDisabled}
                        data-testid="confirm-delete"
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
