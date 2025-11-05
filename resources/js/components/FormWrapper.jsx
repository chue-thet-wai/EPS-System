import React from 'react';

const FormWrapper = ({
    children,
    onSubmit,
    className = '',
    padding = '',
    bgColor = '',
    rounded = '',
    shadow = '',
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
