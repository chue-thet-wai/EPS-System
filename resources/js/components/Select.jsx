import React from 'react';

const Select = ({
  name,
  value = '',
  onChange,
  options = [], 
  placeholder = 'Select an option',
  className = '',
  borderColor = 'border-gray-300',
  focusColor = 'focus:ring-primary-theme-color',
  rounded = 'rounded-md',
  shadow = 'shadow-sm',
}) => {
  const baseStyles = `
    w-full
    px-4 py-2
    border ${borderColor}
    ${rounded}
    ${shadow}
    focus:outline-none
    focus:ring-2
    ${focusColor}
    transition
    duration-150
    ease-in-out
  `;

  return (
    <div>
      <select
        name={name} 
        value={value}
        onChange={onChange} 
        className={baseStyles+" "+className}
      >
        <option value="" disabled>
          {placeholder} 
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
