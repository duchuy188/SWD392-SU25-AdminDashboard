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
        return 'bg-emerald-500';
      case 'blue':
        return 'bg-blue-500';
      case 'orange':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-black">{label}</span>
        <span className="text-sm font-bold text-black px-2 py-1 bg-gray-100 rounded-lg">{value}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full ${getColorClasses(color)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function SystemStatus() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
        </div>
        <h3 className="text-xl font-bold text-black">Trạng thái hệ thống</h3>
      </div>
      
      <div className="flex items-center justify-between mb-8 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
          <span className="text-black font-semibold">Hệ thống đang hoạt động</span>
        </div>
        <span className="text-black bg-white px-3 py-1 rounded-full">
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