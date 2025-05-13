import React from 'react';

const Label = ({
    htmlFor,
    children,
    className = '',
    textSize = 'text-base',
    textColor = 'text-gray-900',
    margin = 'mb-1',
    required = false, 
}) => {
    return (
        <label
            htmlFor={htmlFor}
            className={"block " + textSize + " font-medium dark:text-white mb-2 " + textColor + " " + margin + " " + className}
              
        >
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
};

export default Label;
