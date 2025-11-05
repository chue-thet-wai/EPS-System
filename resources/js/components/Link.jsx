import React from 'react';
import { Link as InertiaLink } from '@inertiajs/inertia-react';

const Link = ({
  href,
  children,
  className = '',
  variant = 'primary',
  padding = 'px-2 py-2',
  rounded = 'rounded-lg',
  textColor = 'text-black',
  bgColor = 'bg-primary-theme-color',
  hoverColor = 'hover:bg-secondary-theme-color',
  focusColor = 'focus:ring-primary-theme-color',
  target = '_self', 
}) => {
  
  const baseStyles = `
    ${padding} 
    ${rounded} 
    ${bgColor} 
    ${textColor} 
    ${hoverColor} 
    ${focusColor} 
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2 
    transition 
    ease-in-out 
    duration-150
  `;

  return (
    <InertiaLink
      href={href}
      className={baseStyles +" "+ className}
      target={target}
    >
      {children}
    </InertiaLink>
  );
};

export default Link;
