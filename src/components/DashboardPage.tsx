import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MetricCard from './MetricCard';
import { SystemStatus } from './SystemStatus';
import { RecentActivity } from './RecentActivity';
import UserManagement from './UserManagement';
import ChatManagement from './ChatManagement';
import { 
  Users, 
  MessageSquare, 
  Target, 
  Clock,
  DivideIcon
} from 'lucide-react';

function DashboardPage() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role !== 'admin') {
        handleLogout();
      }
    } catch {
      handleLogout();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const metrics = [
    {
      title: "Total Users",
      value: "1,234",
      description: "Total number of registered users",
      icon: DivideIcon
    },
    {
      title: "Active Sessions",
      value: "56",
      description: "Current active user sessions",
      icon: DivideIcon
    },
    {
      title: "Response Rate",
      value: "98%",
      description: "Average bot response rate",
      icon: DivideIcon
    }
  ];

  return (
    <div className="flex h-screen gradient-primary">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} onLogout={handleLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeItem === 'users' ? (
            <div className="animate-fadeIn">
              <UserManagement />
            </div>
          ) : activeItem === 'chat' ? (
            <div className="animate-fadeIn">
              <ChatManagement />
            </div>
          ) : (
            <div className="animate-fadeIn">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-white/80 text-lg">Tổng quan về hoạt động của hệ thống EduBot</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {metrics.map((metric, index) => (
                  <div 
                    key={index} 
                    className={`animate-fadeIn hover-lift delay-${index}00`}
                  >
                    <MetricCard {...metric} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="animate-fadeIn hover-lift delay-400">
                  <SystemStatus />
                </div>
                <div className="animate-fadeIn hover-lift delay-500">
                  <RecentActivity />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage; 