import React from 'react';

const Input = ({
    id,
    name, 
    type = 'text',
    value,
    onChange,
    placeholder = '',
    className = '',
    padding = 'px-4 py-2',
    bgColor = 'dark:bg-secondary-dark-bg',
    border = 'border border-gray-300',
    rounded = 'rounded-lg',
    shadow = 'shadow-sm',
    focusRing = 'focus:ring-2 focus:ring-blue-400 focus:border-transparent',
    error = '', // New prop for error message
}) => {

    const inputClass = 
        bgColor + 
        " dark:text-white block w-full " + 
        padding + " " + 
        border + " " + 
        rounded + " " + 
        shadow + " " + 
        focusRing + 
        " transition-all " + 
        className + 
        (error ? " border-red-500" : "");
  

    return (
        <div className="mb-4"> 
            <input
                type={type}
                id={id}
                name={name} 
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClass}
            />
            {error && <p className="text-sm text-red-500">{error}</p>} 
        </div>
    );
};

export default Input;
