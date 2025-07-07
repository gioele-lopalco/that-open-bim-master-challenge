import React from 'react';
import './Avatar.css';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  backgroundColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  initials, 
  size = 'md',
  backgroundColor = 'var(--warning)'
}) => {
  return (
    <div 
      className={`avatar avatar--${size}`}
      style={{ backgroundColor }}
    >
      {initials}
    </div>
  );
};

export default Avatar; 