import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: typeof LucideIcon;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon: Icon }) => {
  // Tạo gradient khác nhau cho mỗi card dựa trên title
  const getGradientClass = (title: string) => {
    switch (title.toLowerCase()) {
      case 'total users':
        return 'gradient-secondary';
      case 'active sessions':
        return 'gradient-success';
      case 'response rate':
        return 'gradient-warning';
      default:
        return 'gradient-info';
    }
  };

  const gradientClass = getGradientClass(title);

  return (
    <div className="glass rounded-2xl shadow-2xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 opacity-80 group-hover:opacity-100 transition-opacity duration-300">{title}</p>
          <p className="mt-2 text-4xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">{value}</p>
        </div>
        <div className={`p-4 ${gradientClass} rounded-2xl shadow-lg transform group-hover:rotate-12 transition-all duration-300`}>
          <Icon className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200/50">
        <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{description}</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default MetricCard;