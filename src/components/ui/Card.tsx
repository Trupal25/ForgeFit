"use client";

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  clickable?: boolean;
}

interface CardComponent extends React.FC<CardProps> {
  Header: React.FC<{ children: React.ReactNode; className?: string }>;
  Body: React.FC<{ children: React.ReactNode; className?: string }>;
  Footer: React.FC<{ children: React.ReactNode; className?: string }>;
}

const Card: CardComponent = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  clickable = false,
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-sm overflow-hidden';
  const hoverStyles = hoverable ? 'transition-all duration-200 hover:shadow-md' : '';
  const clickStyles = clickable ? 'cursor-pointer' : '';
  
  const cardStyles = `${baseStyles} ${hoverStyles} ${clickStyles} ${className}`;

  return (
    <div className={cardStyles} onClick={onClick}>
      {children}
    </div>
  );
};

// Additional card subcomponents
Card.Header = function CardHeader({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return <div className={`p-6 border-b border-gray-100 ${className}`}>{children}</div>;
};

Card.Body = function CardBody({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-4 border-t border-gray-100 ${className}`}>{children}</div>;
};

export default Card; 