import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number;
  color: string;
}

function ProgressBar({ label, value, color }: ProgressBarProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'blue':
        return 'bg-blue-500';
      case 'orange':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getColorClasses(color)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function SystemStatus() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Trạng thái hệ thống</h3>
      
      <div className="flex items-center mb-6">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
        <span className="text-gray-900 font-medium">Hệ thống đang hoạt động</span>
        <span className="text-sm text-gray-500 ml-auto">
          Cập nhật lần cuối: 15:00:00 15/5/2024
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProgressBar label="Thời gian hoạt động" value={98.7} color="green" />
        <ProgressBar label="Sử dụng CPU" value={42.8} color="blue" />
        <ProgressBar label="Sử dụng RAM" value={68.3} color="orange" />
      </div>
    </div>
  );
}