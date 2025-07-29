import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

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
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create or get the portal container
    let container = document.getElementById('tooltip-portal');
    if (!container) {
      container = document.createElement('div');
      container.id = 'tooltip-portal';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '9999';
      document.body.appendChild(container);
    }
    setPortalContainer(container);

    return () => {
      // Clean up if no tooltips are using it
      if (container && !visible) {
        const tooltips = container.querySelectorAll('[role="tooltip"]');
        if (tooltips.length === 0) {
          document.body.removeChild(container);
        }
      }
    };
  }, [visible]);

  const [screenPosition, setScreenPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!visible || !containerRef?.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calculate screen coordinates
    const screenX = rect.left + x;
    const screenY = rect.top + y;
    
    setScreenPosition({ x: screenX, y: screenY });
  }, [x, y, visible, containerRef]);

  if (!visible || !content || !portalContainer) return null;

  const tooltipElement = (
    <div
      className={`fixed z-[9999] px-3 py-2 text-sm text-white bg-slate-900 rounded-lg pointer-events-none shadow-xl ${className}`}
      style={{
        left: screenPosition.x,
        top: screenPosition.y,
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

  return ReactDOM.createPortal(tooltipElement, portalContainer);
};
