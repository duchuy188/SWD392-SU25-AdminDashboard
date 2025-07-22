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
  List,
  LucideIcon
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  subItems?: MenuItem[];
  showModal?: boolean;
}

const menuItems: MenuItem[] = [
  { 
    id: 'users', 
    label: 'Quản lý người dùng', 
    icon: Users
  },
  { id: 'chat', label: 'Quản lý Chat', icon: MessageCircle },
  { id: 'notifications', label: 'Tạo thông báo', icon: Bell, showModal: true },
  { id: 'tests', label: 'Quản lý bài test', icon: Brain },
  { id: 'majors', label: 'Ngành học', icon: GraduationCap },
];

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  onLogout: () => void;
  onShowNotificationModal?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick, onLogout, onShowNotificationModal }) => {
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

  const handleItemClick = (itemId: string, hasSubItems: boolean, showModal?: boolean) => {
    if (showModal && onShowNotificationModal) {
      onShowNotificationModal();
      return;
    }
    
    if (hasSubItems) {
      setExpandedItem(expandedItem === itemId ? null : itemId);
    } else {
      onItemClick(itemId);
      setExpandedItem(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-100 to-primary-200 h-screen w-64 border-r border-primary-300 flex flex-col">
      <div className="p-6 border-b border-primary-300 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary-900">EduBot</h2>
            <p className="text-sm text-primary-700">Admin Dashboard</p>
          </div>
        </div>
      </div>
      <nav className="mt-6 flex-1 px-4">
        {filteredMenuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.id;
          const isExpanded = expandedItem === item.id;
          
          return (
            <div key={item.id}>
              <button
                onClick={() => handleItemClick(item.id, false, item.showModal)}
                className={`flex items-center px-4 py-3 my-1 w-full text-left rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/50 backdrop-blur-sm text-primary-900 shadow-sm' 
                    : 'text-primary-800 hover:bg-white/30 hover:backdrop-blur-sm'
                }`}
              >
                <IconComponent className={`w-5 h-5 mr-3 ${
                  item.id === 'users' ? 'text-primary-600' :
                  item.id === 'chat' ? 'text-emerald-600' :
                  item.id === 'notifications' ? 'text-amber-600' :
                  item.id === 'tests' ? 'text-violet-600' :
                  item.id === 'majors' ? 'text-rose-600' : ''
                }`} />
                <span className="font-medium">{item.label}</span>
                {false && (
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
                  <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
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
                        className={`flex items-center px-4 py-2 w-full text-left rounded-lg transition-all duration-200 ${
                          isSubActive
                            ? 'bg-white/50 backdrop-blur-sm text-primary-900 shadow-sm'
                            : 'text-primary-800 hover:bg-white/30 hover:backdrop-blur-sm'
                        }`}
                      >
                        <SubIconComponent className="w-4 h-4 mr-3" />
                        <span className="font-medium text-sm">{subItem.label}</span>
                        {isSubActive && (
                          <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
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
      <div className="p-4 border-t border-primary-300 bg-white/30 backdrop-blur-sm">
        <button
          onClick={onLogout}
          className="flex items-center px-4 py-3 text-primary-800 hover:bg-white/50 hover:text-rose-600 w-full text-left rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;