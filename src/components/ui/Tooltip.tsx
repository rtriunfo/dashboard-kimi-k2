import React from 'react';

interface TooltipProps {
  x: number;
  y: number;
  content: string;
  visible: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  x,
  y,
  content,
  visible,
  className = ''
}) => {
  if (!visible || !content) return null;

  return (
    <div
      className={`chart-tooltip ${className}`}
      style={{
        left: x,
        top: y,
        position: 'fixed',
        zIndex: 1000,
      }}
      role="tooltip"
      aria-live="polite"
    >
      {content.split('\n').map((line, index) => (
        <div key={index} className="whitespace-nowrap">
          {line}
        </div>
      ))}
    </div>
  );
};