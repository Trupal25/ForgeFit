"use client";

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles shared by all variants
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50';
  
  // Size variations
  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };
  
  // Disabled state
  const disabledStyles = disabled || isLoading ? 
    'opacity-60 cursor-not-allowed' : '';
  
  // Full width
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Combine all styles
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${widthStyles} ${className}`;
  
  // Spacing between icon and text
  const iconSpacing = children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : '';
  
  return (
    <button 
      className={buttonStyles}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && icon && iconPosition === 'left' && (
        <span className={iconSpacing}>{icon}</span>
      )}
      
      {children}
      
      {!isLoading && icon && iconPosition === 'right' && (
        <span className={iconSpacing}>{icon}</span>
      )}
    </button>
  );
};

export default Button;
