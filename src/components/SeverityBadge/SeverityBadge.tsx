import React from 'react';

export interface SeverityBadgeProps {
  severity: string;
}

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'BLOCKER':
        return 'bg-[#ef4444] text-white';
      case 'CRITICAL':
        return 'bg-[#f97316] text-white';
      case 'MAJOR':
        return 'bg-[#eab308] text-white';
      case 'MINOR':
        return 'bg-[#3b82f6] text-white';
      case 'NONE':
        return 'bg-[#10b981] text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const displaySeverity = severity || 'UNKNOWN';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(severity)}`}>
      {displaySeverity}
    </span>
  );
};

export default SeverityBadge;
