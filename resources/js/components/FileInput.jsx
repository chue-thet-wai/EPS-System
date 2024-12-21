import React, { useState } from 'react';

const FileInput = ({ id, name, label, value, onChange, error, required = false, accept = "image/*", previewImage = false }) => {
    const [preview, setPreview] = useState(value || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(previewImage ? URL.createObjectURL(file) : null); // Only set preview if it's an image
        } else {
            setPreview(null);
        }
        onChange(e);
    };

    return (
        <div>
            {/* Label */}
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* File Input */}
            <input
                type="file"
                id={id}
                name={name}
                accept={accept}
                onChange={handleFileChange}
                className={`mt-1 block w-full text-sm text-gray-900 
                    file:mr-4 file:py-2 file:px-4 
                    file:rounded-lg file:border-0 
                    file:text-sm file:font-semibold 
                    file:bg-blue-500 file:text-white
                    hover:file:bg-blue-600 
                    ${error ? 'border-red-500' : 'border-gray-300'}`}
            />

            {/* Preview for Image */}
            {preview && previewImage && (
                <div className="mt-2">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                    />
                </div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default FileInput;
