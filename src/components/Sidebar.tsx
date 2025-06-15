import React from 'react';
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

export function Sidebar({ activeItem, onItemClick }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center font-bold text-xl">
          <School className="text-blue-700" size={32} />
          <span className="ml-3 text-blue-700 font-bold">EduBot</span>
        </div>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <IconComponent className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}