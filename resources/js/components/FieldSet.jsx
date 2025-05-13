import React from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'; // Material Design-like icons

const FieldSet = ({ title, expanded, onToggle, children }) => {
    return (
        <fieldset className="border p-6 mt-6 rounded-lg shadow-md bg-white transition-all duration-200 ease-in-out">
            <legend className="flex justify-between items-center text-xl font-medium text-gray-800">
                <button
                    type="button"
                    onClick={onToggle}
                    className="text-lg text-gray-500 hover:text-gray-700 transition duration-200 focus:outline-none rounded-full p-2"
                >
                    {/* Material Design-like icon size adjustment */}
                    {expanded ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
                </button>
                <span>{title}</span>
            </legend>
            {/* Add smooth fade transition for expanded content */}
            {expanded && <div className="mt-4">{children}</div>}
        </fieldset>
    );
};

export default FieldSet;
