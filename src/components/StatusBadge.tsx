import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', showIcon = false }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pass':
        return 'bg-green-500';
      case 'fail':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    const iconSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    switch (status.toLowerCase()) {
      case 'pass':
        return <CheckCircle className={iconSize} />;
      case 'fail':
        return <XCircle className={iconSize} />;
      default:
        return <AlertTriangle className={iconSize} />;
    }
  };

  const sizeClasses = size === 'lg' ? 'px-4 py-2 text-sm' : 'px-2 py-1 text-xs';

  return (
    <span className={`${sizeClasses} font-semibold text-white rounded-full flex items-center gap-2 ${getStatusColor(status)}`}>
      {showIcon && getStatusIcon(status)}
      {status}
    </span>
  );
};
