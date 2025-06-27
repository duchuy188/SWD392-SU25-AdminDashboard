import React, { useState } from 'react';
import { createUser, CreateUserRequest } from '../services/accountServices';

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
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    try {
      await createUser(createForm);
      // Reset form
      setCreateForm({
        email: '',
        fullName: '',
        password: '',
        phone: '',
        address: '',
        role: 'student'
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || 'Không thể tạo người dùng mới');
    } finally {
      setCreateLoading(false);
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="glass rounded-2xl shadow-2xl max-w-lg w-full mx-4 animate-slideUp">
        <div className="glass-dark px-8 py-6 flex justify-between items-center rounded-t-2xl border-b border-white/20">
          <div className="flex items-center">
            <div className="w-10 h-10 gradient-success rounded-2xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Tạo người dùng mới</h3>
              <p className="text-white/80">Thêm người dùng vào hệ thống</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Đóng modal"
            aria-label="Đóng modal tạo người dùng"
            className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 p-2 rounded-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleCreateSubmit} className="p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  📧 Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={createForm.email}
                  onChange={handleCreateInputChange}
                  className="w-full glass text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 placeholder-white/50 border border-blue-400/30"
                  placeholder="Nhập email"
                  required
                />
              </div>
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-white mb-2">
                  👤 Họ và tên
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={createForm.fullName}
                  onChange={handleCreateInputChange}
                  className="w-full glass text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 placeholder-white/50 border border-green-400/30"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={createForm.password}
                  onChange={handleCreateInputChange}
                  className="w-full glass text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 placeholder-white/50"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={createForm.phone}
                  onChange={handleCreateInputChange}
                  className="w-full glass text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 placeholder-white/50"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-white mb-2">
                Địa chỉ
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={createForm.address}
                onChange={handleCreateInputChange}
                className="w-full glass text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 placeholder-white/50"
                placeholder="Nhập địa chỉ"
                required
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-white mb-2">
                Vai trò
              </label>
              <select
                id="role"
                name="role"
                value={createForm.role}
                onChange={handleCreateInputChange}
                className={`w-full text-white rounded-xl px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 transition-all duration-300 cursor-pointer ${
                  createForm.role === 'admin' ? 'select-role-admin' : 'select-role-student'
                }`}
                required
              >
                <option value="student" className="bg-gray-800 text-white">
                  👨‍🎓 Học viên
                </option>
                <option value="admin" className="bg-gray-800 text-white">
                  👑 Quản trị viên
                </option>
              </select>
            </div>
          </div>
          
          {createError && (
            <div className="mt-6 glass-dark rounded-xl p-4 border-l-4 border-red-500 animate-fadeIn">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-300 font-medium">{createError}</p>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 glass text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className={`px-6 py-3 gradient-success text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold flex items-center space-x-2 ${
                createLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {createLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Tạo người dùng</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal; 