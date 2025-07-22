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
  { id: 'users', label: 'Quản lý người dùng', icon: Users },
  { id: 'chat', label: 'Quản lý Chat', icon: MessageCircle },
  { id: 'notifications', label: 'Quản lý thông báo', icon: Bell },
  { id: 'tests', label: 'Quản lý bài test', icon: Brain },
  { id: 'majors', label: 'Ngành học', icon: GraduationCap },
];

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick, onLogout }) => {
  let role = '';
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    role = user.role || '';
  } catch {}

  const filteredMenuItems = menuItems.filter(item => {
    if (item.id === 'users' || item.id === 'chat' || item.id === 'tests' || item.id === 'notifications') {
      return role === 'admin';
    }
    return true;
  });

  return (
    <div className="bg-white h-screen w-64 border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mr-3">
            <span className="text-black font-bold text-lg">E</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">EduBot</h2>
            <p className="text-sm text-black">Admin Dashboard</p>
          </div>
        </div>
      </div>
      <nav className="mt-6 flex-1 px-4">
        {filteredMenuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`flex items-center px-4 py-3 my-1 w-full text-left rounded-xl ${
                isActive 
                  ? 'bg-gray-100 text-black' 
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              <IconComponent className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-gray-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center px-4 py-3 text-black hover:bg-gray-50 hover:text-red-600 w-full text-left rounded-xl"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;