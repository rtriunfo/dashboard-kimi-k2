import React from 'react';

interface SeverityBadgeProps {
  severity: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'BLOCKER':
        return 'bg-red-600 text-white';
      case 'CRITICAL':
        return 'bg-red-500 text-white';
      case 'MAJOR':
        return 'bg-orange-500 text-white';
      case 'MINOR':
        return 'bg-yellow-500 text-black';
      case 'NONE':
        return 'bg-gray-500 text-white';
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
