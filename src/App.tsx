import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MetricCard } from './components/MetricCard';
import { SystemStatus } from './components/SystemStatus';
import { RecentActivity } from './components/RecentActivity';
import { 
  Users, 
  MessageSquare, 
  Target, 
  Clock
} from 'lucide-react';

function App() {
  const [activeItem, setActiveItem] = useState('dashboard');

  const metrics = [
    {
      title: 'Người dùng trực tuyến',
      value: '245',
      change: '+5.2%',
      trend: 'up' as const,
      icon: Users,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Tổng phiên chat',
      value: '1879',
      change: '+12.8%',
      trend: 'up' as const,
      icon: MessageSquare,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Tỷ lệ hoàn thành',
      value: '73.4%',
      change: '+3.6%',
      trend: 'up' as const,
      icon: Target,
      iconBgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-600'
    },
    {
      title: 'Thời gian phản hồi',
      value: '1.2s',
      change: '+0.3s',
      trend: 'down' as const,
      icon: Clock,
      iconBgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-600">Dashboard</h1>
            <p className="text-gray-600 mt-2">Tổng quan về hoạt động của hệ thống EduBot</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          <div className="space-y-8">
            <SystemStatus />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;