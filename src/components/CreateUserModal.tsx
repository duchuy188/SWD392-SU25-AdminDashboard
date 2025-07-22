import React, { useState } from 'react';
import { createUser, CreateUserRequest } from '../services/accountServices';
import { toast } from 'react-toastify';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [createForm, setCreateForm] = useState<CreateUserRequest>({
    email: '',
    fullName: '',
    password: '',
    phone: '',
    address: '',
    role: 'student'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await createUser(createForm);
      console.log('Create user response:', response); // Debug log
      
      // Reset form
      setCreateForm({
        email: '',
        fullName: '',
        password: '',
        phone: '',
        address: '',
        role: 'student'
      });
      
      toast.success('Tạo người dùng thành công!');
      
      // Đảm bảo gọi onSuccess trước khi đóng modal
      if (typeof onSuccess === 'function') {
        await onSuccess();
      }
      onClose();
    } catch (err: any) {
      console.error('Create user error:', err); // Debug log
      toast.error(err?.response?.data?.message || 'Không thể tạo người dùng mới');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Tạo người dùng mới</h2>
                <p className="text-blue-100 mt-1">Thêm người dùng vào hệ thống</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Đóng modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleCreateSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                📧 Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={createForm.email}
                onChange={handleCreateInputChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                placeholder="Nhập email"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
                👤 Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={createForm.fullName}
                onChange={handleCreateInputChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                placeholder="Nhập họ và tên"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                🔒 Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={createForm.password}
                onChange={handleCreateInputChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                📱 Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={createForm.phone}
                onChange={handleCreateInputChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
              🏠 Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={createForm.address}
              onChange={handleCreateInputChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
              placeholder="Nhập địa chỉ"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
              👑 Vai trò
            </label>
            <select
              id="role"
              name="role"
              value={createForm.role}
              onChange={handleCreateInputChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white"
              required
            >
              <option value="student">👨‍🎓 Học viên</option>
              <option value="admin">👑 Quản trị viên</option>
            </select>
          </div>

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
                  <span>⏳ Đang tạo...</span>
                </>
              ) : (
                <span>✨ Tạo người dùng</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal; 