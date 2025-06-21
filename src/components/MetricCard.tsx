import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: typeof LucideIcon;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon: Icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className="p-3 bg-blue-500 bg-opacity-10 rounded-full">
          <Icon className="h-6 w-6 text-blue-500" />
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default MetricCard;