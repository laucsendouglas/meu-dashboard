import React from 'react';

interface DashboardCardProps {
  title: string;
  value: number | string;
  color: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, color, onClick }) => {
  const isClickable = !!onClick;
  return (
    <div 
      className={`${color} bg-opacity-20 backdrop-blur-sm border border-slate-700 p-4 rounded-lg shadow-md hover:bg-opacity-30 transition-all duration-300 ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={isClickable ? 'button' : 'figure'}
      aria-label={isClickable ? `Show details for ${title}` : undefined}
      tabIndex={isClickable ? 0 : -1}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <h3 className="text-sm font-medium text-slate-300 truncate">{title}</h3>
      <p className="text-3xl font-bold mt-2 text-white">{value}</p>
    </div>
  );
};

export default DashboardCard;
