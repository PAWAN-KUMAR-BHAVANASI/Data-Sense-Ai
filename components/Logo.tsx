
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d2ff" />
          <stop offset="100%" stopColor="#3a7bd5" />
        </linearGradient>
      </defs>
      {/* Bars on the left */}
      <rect x="5" y="55" width="10" height="15" rx="2" fill="url(#logo-gradient)" />
      <rect x="20" y="45" width="10" height="25" rx="2" fill="url(#logo-gradient)" />
      <rect x="35" y="35" width="10" height="35" rx="2" fill="url(#logo-gradient)" />
      <rect x="50" y="25" width="10" height="45" rx="2" fill="url(#logo-gradient)" />
      
      {/* Swoosh line through bars */}
      <path 
        d="M2 72C15 70 35 55 58 30" 
        stroke="white" 
        strokeWidth="3" 
        strokeLinecap="round" 
        opacity="0.8"
      />
      <path 
        d="M2 75C20 72 45 55 60 25" 
        fill="url(#logo-gradient)" 
        fillOpacity="0.2"
      />

      {/* Brain/Neural part on the right */}
      <path 
        d="M65 35C65 28 72 25 78 25C85 25 92 30 92 40C92 50 85 55 78 55C72 55 65 52 65 45V35Z" 
        fill="url(#logo-gradient)" 
      />
      <circle cx="75" cy="35" r="3" fill="white" fillOpacity="0.6" />
      <circle cx="85" cy="45" r="3" fill="white" fillOpacity="0.6" />
      <circle cx="78" cy="48" r="2.5" fill="white" fillOpacity="0.6" />
      <path d="M75 35L85 45M85 45L78 48" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      
      {/* Lower brain lobe */}
      <path 
        d="M65 55C65 62 70 68 78 68C85 68 92 62 92 55" 
        stroke="url(#logo-gradient)" 
        strokeWidth="8" 
        strokeLinecap="round" 
      />
    </svg>
  );
};
