import React from 'react';
import { Link } from '@inertiajs/inertia-react';

const ButtonIcon = ({
  href,
  onClick,
  icon,
  iconColor = 'text-gray-500',
  hoverColor = 'hover:text-gray-600',
  tooltip = '', 
  size = 'md', 
  shadow = false, 
  ...props
}) => {
  
  const sizeClasses = {
    sm: 'w-6 h-6 p-1', 
    md: 'w-8 h-8 p-2',
    lg: 'w-10 h-10 p-3', 
  };

  const baseStyles = `
    flex items-center justify-center rounded-full
    transition-colors duration-200
    ${sizeClasses[size]} 
    ${iconColor} 
    ${hoverColor} 
    ${shadow ? 'shadow-md hover:shadow-lg' : ''} 
  `;

  const renderWithTooltip = (element) =>
    tooltip ? (
      <div className="relative group">
        {element}
        <span className="
          absolute bottom-10 left-1/2 -translate-x-1/2 text-xs text-white 
          bg-black px-1 py-1 rounded opacity-0 group-hover:opacity-100 
          transition-opacity duration-200
        ">
          {tooltip}
        </span>
      </div>
    ) : (
      element
    );

  if (href) {
    return renderWithTooltip(
      <Link href={href} className={baseStyles} {...props}>
        {icon}
      </Link>
    );
  }

  return renderWithTooltip(
    <button onClick={onClick} className={baseStyles} {...props}>
      {icon}
    </button>
  );
};

export default ButtonIcon;
