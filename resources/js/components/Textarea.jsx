import React from 'react';

const Textarea = ({
  name,
  value = '',
  onChange,
  placeholder = '',
  rows = 4,
  cols = 50,
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
    <textarea
      name={name} 
      value={value}
      onChange={onChange} 
      placeholder={placeholder}
      rows={rows}
      cols={cols}
      className={baseStyles+" "+className}
    />
  );
};

export default Textarea;
