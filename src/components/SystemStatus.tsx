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
        return 'gradient-success';
      case 'blue':
        return 'gradient-primary';
      case 'orange':
        return 'gradient-warning';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-3 group">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors duration-300">{label}</span>
        <span className="text-sm font-bold text-gray-900 px-2 py-1 bg-white/50 rounded-lg">{value}%</span>
      </div>
      <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-700 ease-out ${getColorClasses(color)} shadow-lg`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function SystemStatus() {
  return (
    <div className="glass rounded-2xl shadow-2xl p-6 group">
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 gradient-secondary rounded-full flex items-center justify-center mr-3">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors duration-300">Trạng thái hệ thống</h3>
      </div>
      
      <div className="flex items-center justify-between mb-8 p-4 glass rounded-xl">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 rounded-full mr-3 animate-pulse-custom"></div>
          <span className="text-gray-800 font-semibold">Hệ thống đang hoạt động</span>
        </div>
        <span className="text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-full">
          Cập nhật lần cuối: 15:00:00 15/5/2024
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProgressBar label="Thời gian hoạt động" value={98.7} color="green" />
        <ProgressBar label="Sử dụng CPU" value={42.8} color="blue" />
        <ProgressBar label="Sử dụng RAM" value={68.3} color="orange" />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
}