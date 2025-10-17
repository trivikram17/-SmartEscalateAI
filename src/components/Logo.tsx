import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 56
  };

  const height = sizeMap[size];
  const width = height;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Outer circle */}
      <circle cx="100" cy="100" r="90" fill="url(#logoGradient)" opacity="0.1" />
      
      {/* Main hexagon shape */}
      <path
        d="M100 20 L160 55 L160 125 L100 160 L40 125 L40 55 Z"
        fill="url(#logoGradient)"
        stroke="url(#accentGradient)"
        strokeWidth="3"
      />
      
      {/* Inner AI brain symbol */}
      <circle cx="100" cy="85" r="15" fill="white" opacity="0.9" />
      <circle cx="75" cy="100" r="12" fill="white" opacity="0.9" />
      <circle cx="125" cy="100" r="12" fill="white" opacity="0.9" />
      <circle cx="100" cy="115" r="10" fill="white" opacity="0.9" />
      
      {/* Connecting lines (neural network) */}
      <line x1="100" y1="85" x2="75" y2="100" stroke="white" strokeWidth="2" opacity="0.7" />
      <line x1="100" y1="85" x2="125" y2="100" stroke="white" strokeWidth="2" opacity="0.7" />
      <line x1="75" y1="100" x2="100" y2="115" stroke="white" strokeWidth="2" opacity="0.7" />
      <line x1="125" y1="100" x2="100" y2="115" stroke="white" strokeWidth="2" opacity="0.7" />
      
      {/* Upward arrow (escalation symbol) */}
      <path
        d="M100 130 L100 145 M95 135 L100 130 L105 135"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
};

export default Logo;
