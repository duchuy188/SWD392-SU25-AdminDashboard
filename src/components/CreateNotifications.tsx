import React, { useState, useEffect, useRef } from 'react';
import { NotificationsServices } from '../services/NotificationsServices';
import { NotificationRequest } from '../types/Notifications';
import { getUsers } from '../services/accountServices';
import { toast } from 'react-toastify';

interface User {
  _id: string;
  email: string;
}

interface CreateNotificationsProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

type NotificationType = 'single' | 'multiple' | 'all';
type NotificationImportance = 'low' | 'medium' | 'high';

const CreateNotifications: React.FC<CreateNotificationsProps> = ({ onClose, onSuccess }) => {
  const [notificationType, setNotificationType] = useState<NotificationType>('single');
  const [notificationData, setNotificationData] = useState<NotificationRequest>({
    userId: '',
    userIds: [],
    title: '',
    body: '',
    data: {
      type: 'message',
      importance: 'medium'
    }
  });
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUserForSingle, setSelectedUserForSingle] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    let isComponentMounted = true;

    const fetchAllUsers = async () => {
      if (!isComponentMounted) return;
      
      try {
        setIsLoading(true);
        let allUsers: User[] = [];
        let page = 1;
        const limit = 100;
        let hasMore = true;

        while (hasMore && isComponentMounted) {
          const response = await getUsers({ 
            page, 
            limit,
          });
          
          if (!isComponentMounted) break;
          
          const users = response.data.users || [];
          allUsers = [...allUsers, ...users];
          
          hasMore = users.length === limit;
          page++;
        }

        if (isComponentMounted) {
          setUsers(allUsers);
          setFilteredUsers(allUsers);
        }
      } catch (error) {
        if (isComponentMounted) {
          console.error('Error fetching users:', error);
        }
      } finally {
        if (isComponentMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAllUsers();

    return () => {
      isComponentMounted = false;
      abortController.abort();
    };
  }, []);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSubmitting) {
      console.log('Already submitting, preventing duplicate submission');
      return;
    }

    // Validate data before submitting
    if (notificationType === 'single' && !notificationData.userId) {
      toast.error('Vui lòng chọn người dùng để gửi thông báo');
      console.error('No user selected for single notification');
      return;
    }
    if (notificationType === 'multiple' && (!notificationData.userIds || notificationData.userIds.length === 0)) {
      toast.error('Vui lòng chọn ít nhất một người dùng để gửi thông báo');
      console.error('No users selected for multiple notification');
      return;
    }
    if (!notificationData.title.trim() || !notificationData.body.trim()) {
      toast.error('Vui lòng nhập tiêu đề và nội dung thông báo');
      console.error('Title and body are required');
      return;
    }

    console.log('Submitting notification:', { type: notificationType, data: notificationData });
    setIsSubmitting(true);
    
    try {
      let response;
      let successMessage = '';
      
      switch (notificationType) {
        case 'single':
          response = await NotificationsServices.sendToUser(notificationData);
          successMessage = `Đã gửi thông báo cho người dùng ${selectedUserForSingle?.email || 'đã chọn'}`;
          break;
        case 'multiple':
          response = await NotificationsServices.sendToMany(notificationData);
          successMessage = `Đã gửi thông báo cho ${notificationData.userIds ? notificationData.userIds.length : 0} người dùng`;
          break;
        case 'all':
          response = await NotificationsServices.sendToAll(notificationData);
          successMessage = 'Đã gửi thông báo cho tất cả người dùng';
          break;
      }
      
      console.log('Notification response:', response);
      
      if (response?.success) {
        toast.success(successMessage);
        
        // Call onSuccess first
        if (onSuccess) {
          onSuccess();
        }
        // Then close after a short delay
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 100);
      } else {
        toast.error('Gửi thông báo thất bại: ' + (response?.message || 'Lỗi không xác định'));
      }
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast.error('Gửi thông báo thất bại: ' + (error.message || 'Lỗi không xác định'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'notificationType') {
      setNotificationType(value as NotificationType);
      setNotificationData(prev => ({
        ...prev,
        userId: '',
        userIds: []
      }));
      setSelectedUserForSingle(null);
      setSearchTerm('');
    } else if (name === 'userIds') {
      const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions);
      const selectedUserIds = selectedOptions.map(option => option.value);
      setNotificationData(prev => ({
        ...prev,
        userIds: selectedUserIds
      }));
    } else if (name === 'type' || name === 'importance') {
      setNotificationData(prev => ({
        ...prev,
        data: {
          ...prev.data,
          [name]: value,
          // Reset specific fields when type changes
          ...(name === 'type' && { chatId: '', testId: '' })
        }
      }));
    } else {
      setNotificationData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUserForSingle(user);
    setNotificationData(prev => ({
      ...prev,
      userId: user._id
    }));
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">✉️ Tạo thông báo mới</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-blue-100 mt-2">Gửi thông báo đến người dùng</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="notificationType" className="block text-sm font-semibold text-gray-700">
                📋 Loại gửi thông báo
              </label>
              <select
                id="notificationType"
                name="notificationType"
                value={notificationType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                required
              >
                <option value="single">👤 Gửi cho một người dùng</option>
                <option value="multiple">👥 Gửi cho nhiều người dùng</option>
                <option value="all">🌐 Gửi cho tất cả người dùng</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-semibold text-gray-700">
                🏷️ Loại thông báo
              </label>
              <select
                id="type"
                name="type"
                value={notificationData.data?.type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                required
              >
                <option value="message">💬 Tin nhắn</option>
                <option value="test">📝 Bài kiểm tra</option>
                <option value="system">⚙️ Hệ thống</option>
              </select>
            </div>
          </div>

        {notificationType === 'single' && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="relative" ref={dropdownRef}>
              <label htmlFor="userId" className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Chọn người dùng
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="userSearch"
                  placeholder={selectedUserForSingle ? `${selectedUserForSingle.email} - ${selectedUserForSingle._id}` : "🔍 Tìm kiếm người dùng..."}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setIsDropdownOpen(true)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  title="Mở danh sách người dùng"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
                  {isLoading ? (
                    <div className="px-4 py-3 text-gray-500 flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span>Đang tải...</span>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="px-4 py-3 text-gray-500">❌ Không tìm thấy người dùng</div>
                  ) : (
                    filteredUsers.map((user) => (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() => handleUserSelect(user)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-b last:border-b-0"
                      >
                        <div className="font-semibold text-gray-800">{user.email}</div>
                        <div className="text-sm text-gray-500">{user._id}</div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {notificationType === 'multiple' && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <label htmlFor="userIds" className="block text-sm font-semibold text-gray-700 mb-2">
              👥 Chọn người dùng
            </label>
            <div className="mb-3">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white"
              />
            </div>
            <select
              id="userIds"
              name="userIds"
              multiple
              value={notificationData.userIds}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white"
              required
              disabled={isLoading}
              size={6}
            >
              {filteredUsers.map((user) => (
                <option key={user._id} value={user._id} className="py-2">
                  {user.email} - {user._id}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-green-600 flex items-center space-x-1">
              <span>💡</span>
              <span>Giữ Ctrl (Windows) hoặc Command (Mac) để chọn nhiều người dùng</span>
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="importance" className="block text-sm font-semibold text-gray-700">
            ⚡ Mức độ quan trọng
          </label>
          <select
            id="importance"
            name="importance"
            value={notificationData.data?.importance}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white"
            required
          >
            <option value="low">🟢 Thấp</option>
            <option value="medium">🟡 Trung bình</option>
            <option value="high">🔴 Cao</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
            📝 Tiêu đề
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={notificationData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white"
            placeholder="Nhập tiêu đề thông báo..."
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="body" className="block text-sm font-semibold text-gray-700">
            💬 Nội dung
          </label>
          <textarea
            id="body"
            name="body"
            value={notificationData.body}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-white resize-none"
            placeholder="Nhập nội dung thông báo..."
            required
          />
        </div>

        {notificationData.data?.type === 'message' && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <label htmlFor="chatId" className="block text-sm font-semibold text-gray-700 mb-2">
              💬 Chat ID (tùy chọn)
            </label>
            <input
              type="text"
              id="chatId"
              name="chatId"
              value={notificationData.data?.chatId || ''}
              onChange={(e) => setNotificationData(prev => ({
                ...prev,
                data: {
                  ...prev.data,
                  chatId: e.target.value
                }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200 bg-white"
              placeholder="Nhập Chat ID nếu có"
            />
          </div>
        )}

        {notificationData.data?.type === 'test' && (
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <label htmlFor="testId" className="block text-sm font-semibold text-gray-700 mb-2">
              📝 Test ID (tùy chọn)
            </label>
            <input
              type="text"
              id="testId"
              name="testId"
              value={notificationData.data?.testId || ''}
              onChange={(e) => setNotificationData(prev => ({
                ...prev,
                data: {
                  ...prev.data,
                  testId: e.target.value
                }
              }))}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 bg-white"
              placeholder="Nhập Test ID nếu có"
            />
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2"
          >
            <span>❌ Hủy</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>⏳ Đang gửi...</span>
              </>
            ) : (
              <span>🚀 Gửi thông báo</span>
            )}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNotifications;
