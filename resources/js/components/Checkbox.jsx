import React from "react";

const Checkbox = ({ id, name, checked, onChange, label, className = "", disabled = false }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <input
                type="checkbox"
                id={id || name}
                name={name}
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-300"
                disabled={disabled}
            />
            {label && (
                <label htmlFor={id || name} className="text-gray-700">
                    {label}
                </label>
            )}
        </div>
    );
};


export default Checkbox;
