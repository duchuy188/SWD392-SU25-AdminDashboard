import React, { useState } from 'react';
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
  Bell,
  UserPlus,
  List
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { 
    id: 'users', 
    label: 'Quản lý người dùng', 
    icon: Users
  },
  { id: 'chat', label: 'Quản lý Chat', icon: MessageCircle },
  { id: 'notifications', label: 'Quản lý thông báo', icon: Bell },
  { id: 'tests', label: 'Quản lý bài test', icon: Brain },
  { id: 'majors', label: 'Ngành học', icon: GraduationCap },
];

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick, onLogout }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
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

  const handleItemClick = (itemId: string, hasSubItems: boolean) => {
    if (hasSubItems) {
      setExpandedItem(expandedItem === itemId ? null : itemId);
    } else {
      onItemClick(itemId);
      setExpandedItem(null);
    }
  };

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
          const isActive = activeItem === item.id || (item.subItems?.some(sub => sub.id === activeItem));
          const isExpanded = expandedItem === item.id;
          
          return (
            <div key={item.id}>
              <button
                onClick={() => handleItemClick(item.id, !!item.subItems)}
                className={`flex items-center px-4 py-3 my-1 w-full text-left rounded-xl ${
                  isActive 
                    ? 'bg-gray-100 text-black' 
                    : 'text-black hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
                {item.subItems && (
                  <svg
                    className={`ml-auto w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                {isActive && !item.subItems && (
                  <div className="ml-auto w-2 h-2 bg-gray-400 rounded-full"></div>
                )}
              </button>
              
              {item.subItems && isExpanded && (
                <div className="ml-4 space-y-1">
                  {item.subItems.map((subItem) => {
                    const SubIconComponent = subItem.icon;
                    const isSubActive = activeItem === subItem.id;
                    
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => handleItemClick(subItem.id, false)}
                        className={`flex items-center px-4 py-2 w-full text-left rounded-lg ${
                          isSubActive
                            ? 'bg-gray-100 text-black'
                            : 'text-black hover:bg-gray-50'
                        }`}
                      >
                        <SubIconComponent className="w-4 h-4 mr-3" />
                        <span className="font-medium text-sm">{subItem.label}</span>
                        {isSubActive && (
                          <div className="ml-auto w-2 h-2 bg-gray-400 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
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