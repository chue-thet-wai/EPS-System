import React from 'react';
import Toggle from 'react-toggle';
import "react-toggle/style.css";

const ToggleSwitch = ({ checked, onChange, labelOn, labelOff, disabled = false, className = '' }) => {
    return (
        <div className={`flex items-center ${className}`}>
            {labelOff && <span className="mr-2">{labelOff}</span>}
            <Toggle
                checked={checked}
                onChange={onChange}
                icons={false}
                className="react-toggle"
                disabled={disabled}  // Add the disabled prop to disable the toggle
            />
            {labelOn && <span className="ml-2">{labelOn}</span>}
        </div>
    );
};

export default ToggleSwitch;
