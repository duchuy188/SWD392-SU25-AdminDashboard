import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { SystemStatus } from './SystemStatus';
import { RecentActivity } from './RecentActivity';
import UserManagement from './UserManagement';
import ChatManagement from './ChatManagement';
import TestManagement from './TestManagement';
import CreateNotifications from './CreateNotifications';
import MajorManagement from './MajorManagement';
import { 
  Users, 
  MessageSquare, 
  Target, 
  Clock,
  DivideIcon
} from 'lucide-react';

function DashboardPage() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
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

  const handleNotificationSuccess = () => {
    setShowNotificationModal(false);
    // You can add additional success handling here, like showing a toast message
  };

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
          ) : activeItem === 'tests' ? (
            <div className="animate-fadeIn">
              <TestManagement />
            </div>
          ) : activeItem === 'majors' ? (
            <div className="animate-fadeIn">
              <MajorManagement />
            </div>
          ) : activeItem === 'notifications' ? (
            <div className="animate-fadeIn">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Quản lý thông báo</h1>
                <p className="text-white/80 text-lg">Gửi thông báo đến người dùng</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowNotificationModal(true)}
                    className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tạo thông báo mới
                  </button>
                </div>
                {showNotificationModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="max-w-2xl w-full mx-4">
                      <CreateNotifications
                        onClose={() => setShowNotificationModal(false)}
                        onSuccess={handleNotificationSuccess}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-white/80 text-lg">Tổng quan về hoạt động của hệ thống EduBot</p>
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