import React from 'react';

interface PieChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size = 120 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return null;

  let currentAngle = 0;
  const radius = size / 2;
  const center = radius;

  const segments = data.map((item) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    const x1 = center + radius * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = center + radius * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = center + radius * Math.cos((endAngle - 90) * Math.PI / 180);
    const y2 = center + radius * Math.sin((endAngle - 90) * Math.PI / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    currentAngle = endAngle;
    
    return {
      path: pathData,
      color: item.color,
      percentage: (percentage * 100).toFixed(1),
      label: item.label,
      value: item.value
    };
  });

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {segments.map((segment, index) => (
        <path
          key={index}
          d={segment.path}
          fill={segment.color}
          className="transition-all duration-300 hover:opacity-80"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
        />
      ))}
      
      {/* Center circle for glass effect */}
      <circle
        cx={center}
        cy={center}
        r={radius * 0.6}
        fill="rgba(38, 38, 38, 0.8)"
        stroke="rgba(47, 47, 47, 0.5)"
        strokeWidth="1"
      />
      
      {/* Total value in center */}
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-white text-sm font-bold"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${center}px ${center}px` }}
      >
        {total}
      </text>
    </svg>
  );
};
