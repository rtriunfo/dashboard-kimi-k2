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
      className={`fixed z-[1000] px-3 py-2 text-sm text-white bg-slate-900 rounded-lg pointer-events-none shadow-xl ${className}`}
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        marginTop: -8,
      }}
      role="tooltip"
      aria-live="polite"
    >
      {content.split('\n').map((line, index) => (
        <div key={index} className="whitespace-nowrap">
          {line}
        </div>
      ))}
      <div
        className="absolute border-4 border-transparent top-full left-1/2 transform -translate-x-1/2"
        style={{ borderTopColor: '#0f172a' }}
      />
    </div>
  );
};
