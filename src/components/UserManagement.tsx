import React, { useEffect, useState } from 'react';
import { getUsers, updateUser, updateUserStatus, createUser } from '../services/accountServices';
import { User } from '../types/account';
import UserDetail from './UserDetail';
import { CreateUserRequest } from '../services/accountServices';
import CreateUserModal from './CreateUserModal';
import { toast } from 'react-toastify';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRole, setSelectedRole] = useState<'all' | 'student' | 'admin'>('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const fetchUsers = async () => {
    try {
      const params = {
        page,
        limit,
        ...(selectedRole !== 'all' && { role: selectedRole })
      };
      const res = await getUsers(params);
      setUsers(res.data.users);
      setTotalPages(res.data.pagination.pages);
      setTotalItems(res.data.pagination.total);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, selectedRole]);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value as 'all' | 'student' | 'admin');
    setPage(1);
  };

  const handleRoleUpdate = async (userId: string, newRole: 'student' | 'admin') => {
    try {
      setUpdatingRole(userId);
      await updateUser(userId, { role: newRole });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      // Thêm thông báo toast
      const user = users.find(u => u._id === userId);
      toast.success(`Đã cập nhật vai trò của ${user?.email || userId} thành ${newRole === 'admin' ? 'Quản trị viên' : 'Học viên'}!`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Không thể cập nhật vai trò người dùng');
      toast.error(`Không thể cập nhật vai trò: ${err?.response?.data?.message || 'Đã xảy ra lỗi'}`);
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleStatusUpdate = async (userId: string, newValue: string) => {
    try {
      setUpdatingStatus(userId);
      await updateUserStatus(userId, newValue === 'true');
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive: newValue === 'true' } : user
      ));
      
      // Thêm thông báo toast
      const user = users.find(u => u._id === userId);
      const statusText = newValue === 'true' ? 'mở khóa' : 'khóa';
      toast.success(`Đã ${statusText} tài khoản ${user?.email || userId} thành công!`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Không thể cập nhật trạng thái người dùng');
      toast.error(`Không thể cập nhật trạng thái: ${err?.response?.data?.message || 'Đã xảy ra lỗi'}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-medium border border-gray-200';
      case 'student':
        return 'bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-medium border border-gray-200';
      default:
        return 'bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-medium border border-gray-200';
    }
  };

  const getStatusBadgeClass = (isActive: boolean) => {
    return isActive
      ? 'bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-medium border border-gray-200'
      : 'bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-medium border border-gray-200';
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    try {
      await createUser(createForm);
      // Refresh the user list
      const params = {
        page,
        limit,
        ...(selectedRole !== 'all' && { role: selectedRole })
      };
      const res = await getUsers(params);
      setUsers(res.data.users);
      setTotalPages(res.data.pagination.pages);
      setTotalItems(res.data.pagination.total);
      toast.success('Đã tạo người dùng mới thành công!');
      // Close modal and reset form
      setIsCreateModalOpen(false);
      setCreateForm({
        email: '',
        fullName: '',
        password: '',
        phone: '',
        address: '',
        role: 'student'
      });
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || 'Không thể tạo người dùng mới');
      toast.error(err?.response?.data?.message || 'Không thể tạo người dùng mới');
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

  // Thêm hàm callback để cập nhật thông tin người dùng
  const handleUserUpdate = async (userId: string, updatedData: Partial<User>) => {
    try {
      // Cập nhật thông tin người dùng trong danh sách
      setUsers(users.map(user => 
        user._id === userId ? { ...user, ...updatedData } : user
      ));
      
      // Không cần hiển thị toast ở đây vì đã có toast trong UserDetail
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Không thể cập nhật thông tin người dùng');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 animate-fadeIn">
      <div className="relative">
        <div className="w-16 h-16 gradient-primary rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 gradient-secondary rounded-full animate-ping opacity-20"></div>
        <div className="absolute inset-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <div className="w-4 h-4 gradient-warning rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="glass rounded-2xl p-6 border-l-4 border-red-500 animate-fadeIn">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-red-800 font-semibold text-lg">{error}</div>
      </div>
      <button
        onClick={fetchUsers}
        className="px-6 py-3 gradient-secondary text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        Thử lại
      </button>
    </div>
  );

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black mb-1">Quản lý người dùng</h1>
            <p className="text-black">Quản lý thông tin và quyền hạn người dùng</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-white rounded-xl px-4 py-3">
            <label htmlFor="role-filter" className="font-medium text-black">Lọc theo vai trò:</label>
            <select
              id="role-filter"
              className="bg-gray-100 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-200 font-semibold"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              <option value="all" className="bg-white text-black">Tất cả</option>
              <option value="student" className="bg-white text-black">Học viên</option>
              <option value="admin" className="bg-white text-black">Quản trị viên</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-black mb-1">{totalItems}</div>
              <div className="text-black">Tổng người dùng</div>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-black mb-1">{users.filter(u => u.role === 'student').length}</div>
              <div className="text-black">Học viên</div>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-black mb-1">{users.filter(u => u.role === 'admin').length}</div>
              <div className="text-black">Quản trị viên</div>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    Email
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Họ tên
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Vai trò
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Trạng thái
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12v6m0 0l3-3m-3 3l-3-3m3 3V9a4 4 0 118 0v8" />
                    </svg>
                    Ngày tạo
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                    Thao tác
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr 
                  key={user._id} 
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-gray-600 font-bold text-sm">
                          {user.email[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-black">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-black">{user.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getRoleBadgeClass(user.role)}>
                      {user.role === 'admin' ? 'Admin' : 'Student'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {updatingStatus === user._id ? (
                      <div className="animate-pulse">
                        <div className="h-8 w-20 bg-gray-100 rounded-full"></div>
                      </div>
                    ) : (
                      <select
                        value={user.isActive.toString()}
                        onChange={(e) => handleStatusUpdate(user._id, e.target.value)}
                        title="Chọn trạng thái"
                        aria-label="Chọn trạng thái người dùng"
                        className="bg-gray-100 text-black px-4 py-2 rounded-full text-sm font-medium border border-gray-200 cursor-pointer focus:ring-2 focus:ring-gray-300 min-w-[100px] hover:bg-gray-200"
                      >
                        <option value="true" className="bg-white text-black font-medium">Unblock</option>
                        <option value="false" className="bg-white text-black font-medium">Block</option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black">
                      {new Date(user.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedUserId(user._id)}
                      className="bg-gray-100 text-black px-4 py-2 rounded-xl hover:bg-gray-200 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-black text-lg">Không tìm thấy người dùng nào</div>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="mt-8 bg-white rounded-2xl p-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
            className={`relative inline-flex items-center rounded-xl px-6 py-3 text-sm font-medium ${
              page === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-black hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Trang trước
          </button>
          <button
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            disabled={page === totalPages}
            className={`relative ml-3 inline-flex items-center rounded-xl px-6 py-3 text-sm font-medium ${
              page === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-black hover:bg-gray-50'
            }`}
          >
            Trang sau
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-black font-medium">
              Hiển thị <span className="font-bold">{(page - 1) * limit + 1}</span> đến{' '}
              <span className="font-bold">{Math.min(page * limit, totalItems)}</span> trong{' '}
              <span className="font-bold">{totalItems}</span> kết quả
            </p>
          </div>
          <div>
            <nav className="flex items-center space-x-2" aria-label="Pagination">
              <button
                onClick={() => setPage(page > 1 ? page - 1 : 1)}
                disabled={page === 1}
                className={`relative inline-flex items-center rounded-xl px-4 py-3 ${
                  page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Trang trước</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Page numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-3 text-sm font-semibold rounded-xl ${
                        page === pageNum
                          ? 'bg-gray-100 text-black'
                          : 'bg-white text-black hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                disabled={page === totalPages}
                className={`relative inline-flex items-center rounded-xl px-4 py-3 ${
                  page === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Trang sau</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchUsers}
      />

      {/* User Detail Modal */}
      {selectedUserId && (
        <UserDetail
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onRoleUpdate={handleRoleUpdate}
          onUserUpdate={handleUserUpdate}
        />
      )}
    </div>
  );
};

export default UserManagement; 