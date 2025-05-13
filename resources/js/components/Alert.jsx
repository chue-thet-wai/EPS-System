import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Alert = ({ type = 'info', children, onClose }) => {
    const alertClasses = classNames(
        'px-4 py-3 rounded relative',
        {
            'bg-blue-100 text-blue-700': type === 'info',
            'bg-green-100 text-green-700': type === 'success',
            'bg-yellow-100 text-yellow-700': type === 'warning',
            'bg-red-100 text-red-700': type === 'error',
        },
        'shadow-md'
    );

    return (
        <div className={alertClasses} role="alert">
            <span className="block sm:inline">{children}</span>
            {onClose && (
                <button
                    type="button"
                    className="absolute top-0 right-0 px-4 py-3"
                    onClick={onClose}
                >
                    <span className="text-xl">&times;</span>
                </button>
            )}
        </div>
    );
};

Alert.propTypes = {
    type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func,
};

export default Alert;
