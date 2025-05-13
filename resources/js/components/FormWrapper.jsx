import React from 'react';

const FormWrapper = ({
    children,
    onSubmit,
    className = '',
    padding = 'p-6',
    bgColor = 'bg-white dark:bg-secondary-dark-bg',
    rounded = 'rounded-lg',
    shadow = 'shadow-md',
    spacing = 'space-y-4',
}) => {
    return (
        <form
            onSubmit={onSubmit}
            className={bgColor+" "+ padding +" "+rounded+" "+shadow+" "+spacing+" "+className}
        >
            {children}
        </form>
    );
};

export default FormWrapper;
