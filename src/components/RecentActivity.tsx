import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ActivityItem {
  id: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'info';
}

const activities: ActivityItem[] = [
  {
    id: '1',
    message: 'Cập nhật dữ liệu điểm chuẩn năm 2023 thành công',
    time: '10:23',
    type: 'success'
  },
  {
    id: '2',
    message: 'Hệ thống gửi thông báo tới tất cả người dùng',
    time: '10:15',
    type: 'info'
  },
  {
    id: '3',
    message: 'Phát hiện lỗi kết nối cơ sở dữ liệu tạm thời',
    time: '09:45',
    type: 'warning'
  },
  {
    id: '4',
    message: 'Backup dữ liệu hàng ngày hoàn tất',
    time: '09:30',
    type: 'success'
  }
];

export function RecentActivity() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-white" />
          </div>
        );
      case 'info':
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Info className="w-4 h-4 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <Info className="w-4 h-4 text-white" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center mb-6">
        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
        </div>
        <h3 className="text-xl font-bold text-black">Hoạt động gần đây</h3>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl"
          >
            <div className="flex-shrink-0 mt-1">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black leading-relaxed">{activity.message}</p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-xs text-black bg-white px-2 py-1 rounded-full font-semibold">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}