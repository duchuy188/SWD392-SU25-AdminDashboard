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
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Hoạt động gần đây</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 mt-1">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">{activity.message}</p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}