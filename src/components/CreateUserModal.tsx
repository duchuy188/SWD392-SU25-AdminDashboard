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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Tạo người dùng mới</h3>
          <button
            onClick={onClose}
            title="Đóng modal"
            aria-label="Đóng modal tạo người dùng"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleCreateSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={createForm.email}
                onChange={handleCreateInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={createForm.fullName}
                onChange={handleCreateInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={createForm.password}
                onChange={handleCreateInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={createForm.phone}
                onChange={handleCreateInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={createForm.address}
                onChange={handleCreateInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Vai trò
              </label>
              <select
                id="role"
                name="role"
                value={createForm.role}
                onChange={handleCreateInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="student">Học viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
          </div>
          {createError && (
            <div className="mt-4 text-sm text-red-600">
              {createError}
            </div>
          )}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                createLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {createLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang tạo...</span>
                </div>
              ) : (
                'Tạo người dùng'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal; 