import React, { useEffect, useState } from 'react';

interface TooltipProps {
  x: number;
  y: number;
  content: string;
  visible: boolean;
  className?: string;
  containerRef?: React.RefObject<HTMLElement>;
}

export const Tooltip: React.FC<TooltipProps> = ({
  x,
  y,
  content,
  visible,
  className = '',
  containerRef
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!visible || !containerRef?.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calculate position relative to viewport
    const screenX = rect.left + x;
    const screenY = rect.top + y;
    
    setPosition({ x: screenX, y: screenY });
  }, [x, y, visible, containerRef]);

  if (!visible || !content) return null;

  return (
    <div
      className={`fixed z-[1000] px-3 py-2 text-sm text-white bg-slate-900 rounded-lg pointer-events-none shadow-xl ${className}`}
      style={{
        left: position.x,
        top: position.y,
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
