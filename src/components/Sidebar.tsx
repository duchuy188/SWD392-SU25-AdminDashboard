import React from 'react';
import { 
  Home, 
  Settings, 
  Users, 
  FileText, 
  GraduationCap, 
  MapPin,
  LogOut,
  MessageCircle,
  Brain,
  Bell
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'system', label: 'Hệ thống', icon: Settings },
  { id: 'users', label: 'Quản lý người dùng', icon: Users },
  { id: 'chat', label: 'Quản lý Chat', icon: MessageCircle },
  { id: 'notifications', label: 'Quản lý thông báo', icon: Bell },
  { id: 'tests', label: 'Quản lý bài test', icon: Brain },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'majors', label: 'Ngành học', icon: GraduationCap },
  { id: 'career', label: 'Hướng nghiệp', icon: MapPin },
];

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick, onLogout }) => {
  // Lấy role từ localStorage
  let role = '';
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    role = user.role || '';
  } catch {}

  // Lọc menu: chỉ admin mới thấy mục 'users', 'chat', 'tests' và 'notifications'
  const filteredMenuItems = menuItems.filter(item => {
    if (item.id === 'users' || item.id === 'chat' || item.id === 'tests' || item.id === 'notifications') {
      return role === 'admin';
    }
    return true;
  });

  return (
    <div className="glass h-screen w-64 border-r border-white/20 flex flex-col animate-slideIn">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center">
          <div className="w-10 h-10 gradient-secondary rounded-xl flex items-center justify-center mr-3 animate-pulse-custom">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">EduBot</h2>
            <p className="text-sm text-gray-600">Admin Dashboard</p>
          </div>
        </div>
      </div>
      <nav className="mt-6 flex-1 px-4">
        {filteredMenuItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.id;
          const delayClass = `delay-${index * 100}`;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`group flex items-center px-4 py-3 my-1 text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white w-full text-left rounded-xl transition-all duration-300 transform hover:scale-105 animate-fadeIn ${delayClass} ${
                isActive ? 'gradient-primary text-white shadow-lg scale-105' : ''
              }`}
            >
              <IconComponent className={`w-5 h-5 mr-3 transition-all duration-300 ${isActive ? 'animate-pulse-custom' : ''}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/20">
        <button
          onClick={onLogout}
          className="group flex items-center px-4 py-3 text-red-500 hover:bg-red-500 hover:text-white w-full text-left rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          <LogOut className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;