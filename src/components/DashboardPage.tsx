import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { RecentActivity } from './RecentActivity';
import UserManagement from './UserManagement';
import ChatManagement from './ChatManagement';
import TestManagement from './TestManagement';
import CreateNotifications from './CreateNotifications';
import MajorManagement from './MajorManagement';
import CreateUserModal from './CreateUserModal';
import { 
  DivideIcon,
  ChevronDown
} from 'lucide-react';

function DashboardPage() {
  const [activeItem, setActiveItem] = useState('users');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
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
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'users':
      case 'users-list':
      case 'users-create':
        return (
          <>
            <UserManagement />
            {activeItem === 'users-create' && (
              <CreateUserModal 
                isOpen={true}
                onClose={() => setActiveItem('users')}
                onSuccess={() => {
                  setActiveItem('users');
                }}
              />
            )}
          </>
        );
      case 'chat':
        return <ChatManagement />;
      case 'tests':
        return <TestManagement />;
      case 'majors':
        return <MajorManagement />;
      case 'notifications':
        return (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary-900 mb-2">Quản lý thông báo</h1>
              <p className="text-primary-700 text-lg">Gửi thông báo đến người dùng</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary-200">
              <div className="flex justify-center">
                <button
                  onClick={() => setShowNotificationModal(true)}
                  className="mb-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Tạo thông báo mới
                </button>
              </div>
              {showNotificationModal && (
                <div className="fixed inset-0 bg-primary-900/50 backdrop-blur-sm flex items-center justify-center z-50">
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
        );
      default:
        return (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary-900 mb-2">Dashboard</h1>
              <p className="text-primary-700 text-lg">Tổng quan về hoạt động của hệ thống EduBot</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-primary-200">
                <RecentActivity />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} onLogout={handleLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage; 