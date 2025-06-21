import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MetricCard from './MetricCard';
import { SystemStatus } from './SystemStatus';
import { RecentActivity } from './RecentActivity';
import UserManagement from './UserManagement';
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} onLogout={handleLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeItem === 'users' ? (
            <UserManagement />
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Tổng quan về hoạt động của hệ thống EduBot</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {metrics.map((metric, index) => (
                  <MetricCard key={index} {...metric} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SystemStatus />
                <RecentActivity />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage; 