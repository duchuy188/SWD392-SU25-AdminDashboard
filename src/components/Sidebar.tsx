import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  Users, 
  FileText, 
  GraduationCap, 
  MapPin,
  School
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'system', label: 'Hệ thống', icon: Settings },
  { id: 'users', label: 'Quản lý người dùng', icon: Users },
  { id: 'logs', label: 'Logs', icon: FileText },
  { id: 'majors', label: 'Ngành học', icon: GraduationCap },
  { id: 'career', label: 'Hướng nghiệp', icon: MapPin },
];

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  // Lấy role từ localStorage
  let role = '';
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    role = user.role || '';
  } catch {}

  // Lọc menu: chỉ admin mới thấy mục 'users'
  const filteredMenuItems = menuItems.filter(item => {
    if (item.id === 'users') {
      return role === 'admin';
    }
    return true;
  });

  return (
    <div className="bg-white h-screen w-64 border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">EduBot Admin</h2>
      </div>
      <nav className="mt-6">
        {filteredMenuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <Link
              key={item.id}
              to={`/${item.id}`}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500' : ''
              }`}
            >
              <IconComponent className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;