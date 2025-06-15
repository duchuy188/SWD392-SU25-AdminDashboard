import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  iconBgColor, 
  iconColor 
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? '↗' : '↘'} {change}
            </span>
            <span className="text-sm text-gray-500 ml-1">so với tuần trước</span>
          </div>
        </div>
        <div className={`${iconBgColor} rounded-lg p-3 ml-4`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}