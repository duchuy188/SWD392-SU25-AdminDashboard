import React, { useEffect, useState } from 'react';
import { getUsers, updateUser, updateUserStatus, createUser } from '../services/accountServices';
import { User } from '../types/account';
import UserDetail from './UserDetail';
import { CreateUserRequest } from '../services/accountServices';
import CreateUserModal from './CreateUserModal';

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
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Không thể cập nhật vai trò người dùng');
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
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Không thể cập nhật trạng thái người dùng');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg';
      case 'student':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg';
    }
  };

  const getStatusBadgeClass = (isActive: boolean) => {
    return isActive
      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg'
      : 'bg-gradient-to-r from-red-500 to-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg';
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
          <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center mr-4 animate-pulse-custom">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Quản lý người dùng</h1>
            <p className="text-white/80">Quản lý thông tin và quyền hạn người dùng</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 gradient-success text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Tạo người dùng mới
          </button>
          <div className="flex items-center space-x-3 glass rounded-xl px-4 py-3">
            <label htmlFor="role-filter" className="font-medium text-white">Lọc theo vai trò:</label>
            <select
              id="role-filter"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 cursor-pointer hover:from-indigo-600 hover:to-purple-600 font-semibold"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              <option value="all" className="bg-gray-800 text-white">Tất cả</option>
              <option value="student" className="bg-gray-800 text-white">Học viên</option>
              <option value="admin" className="bg-gray-800 text-white">Quản trị viên</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass rounded-2xl p-6 hover-lift group animate-fadeIn delay-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-white mb-1">{totalItems}</div>
              <div className="text-white/80">Tổng người dùng</div>
            </div>
            <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-2xl p-6 hover-lift group animate-fadeIn delay-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-white mb-1">{users.filter(u => u.role === 'student').length}</div>
              <div className="text-white/80">Học viên</div>
            </div>
            <div className="w-12 h-12 gradient-success rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-2xl p-6 hover-lift group animate-fadeIn delay-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-white mb-1">{users.filter(u => u.role === 'admin').length}</div>
              <div className="text-white/80">Quản trị viên</div>
            </div>
            <div className="w-12 h-12 gradient-warning rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl shadow-2xl overflow-hidden animate-fadeIn delay-300">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="glass-dark">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    Email
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Họ tên
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Vai trò
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Trạng thái
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 12v6m0 0l3-3m-3 3l-3-3m3 3V9a4 4 0 118 0v8" />
                    </svg>
                    Ngày tạo
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                    Thao tác
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {users.map((user, index) => (
                <tr 
                  key={user._id} 
                  className={`hover:bg-white/10 transition-colors duration-300 animate-fadeIn delay-${index % 5}00`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 gradient-secondary rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">
                          {user.email[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{user.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {updatingRole === user._id ? (
                      <div className="animate-pulse">
                        <div className="h-8 w-20 glass rounded-full"></div>
                      </div>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user._id, e.target.value as 'student' | 'admin')}
                        title="Chọn vai trò"
                        aria-label="Chọn vai trò người dùng"
                        className={`text-white px-4 py-2 rounded-full text-sm font-bold border-none cursor-pointer focus:ring-2 focus:ring-yellow-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                          user.role === 'admin' 
                            ? 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 hover:from-red-600 hover:via-pink-600 hover:to-purple-700' 
                            : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600'
                        }`}
                      >
                        <option value="student" className="bg-gray-800 text-white font-medium">student</option>
                        <option value="admin" className="bg-gray-800 text-white font-medium">admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {updatingStatus === user._id ? (
                      <div className="animate-pulse">
                        <div className="h-8 w-20 glass rounded-full"></div>
                      </div>
                    ) : (
                      <select
                        value={user.isActive.toString()}
                        onChange={(e) => handleStatusUpdate(user._id, e.target.value)}
                        title="Chọn trạng thái"
                        aria-label="Chọn trạng thái người dùng"
                        className={`text-white px-4 py-2 rounded-full text-sm font-bold border-none cursor-pointer focus:ring-2 focus:ring-yellow-400 transition-all duration-300 min-w-[100px] shadow-lg hover:shadow-xl transform hover:scale-105 ${
                          user.isActive 
                            ? 'bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700' 
                            : 'bg-gradient-to-r from-red-500 via-rose-500 to-pink-600 hover:from-red-600 hover:via-rose-600 hover:to-pink-700'
                        }`}
                      >
                        <option value="true" className="bg-gray-800 text-white font-medium">Unblock</option>
                        <option value="false" className="bg-gray-800 text-white font-medium">Block</option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white/80">
                      {new Date(user.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedUserId(user._id)}
                      className="glass text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
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
            <div className="w-16 h-16 gradient-info rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-white/80 text-lg">Không tìm thấy người dùng nào</div>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <div className="mt-8 glass rounded-2xl p-6 animate-fadeIn delay-400">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
            className={`relative inline-flex items-center rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 ${
              page === 1
                ? 'glass-dark text-white/50 cursor-not-allowed'
                : 'glass text-white hover:bg-white/20 hover:scale-105 transform'
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
            className={`relative ml-3 inline-flex items-center rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300 ${
              page === totalPages
                ? 'glass-dark text-white/50 cursor-not-allowed'
                : 'glass text-white hover:bg-white/20 hover:scale-105 transform'
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
            <div className="w-8 h-8 gradient-info rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-white/90 font-medium">
              Hiển thị <span className="text-yellow-400 font-bold">{(page - 1) * limit + 1}</span> đến{' '}
              <span className="text-yellow-400 font-bold">{Math.min(page * limit, totalItems)}</span> trong{' '}
              <span className="text-yellow-400 font-bold">{totalItems}</span> kết quả
            </p>
          </div>
          <div>
            <nav className="flex items-center space-x-2" aria-label="Pagination">
              <button
                onClick={() => setPage(page > 1 ? page - 1 : 1)}
                disabled={page === 1}
                className={`relative inline-flex items-center rounded-xl px-4 py-3 transition-all duration-300 ${
                  page === 1
                    ? 'glass-dark text-white/50 cursor-not-allowed'
                    : 'glass text-white hover:bg-white/20 hover:scale-105 transform'
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
                      className={`relative inline-flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                        page === pageNum
                          ? 'gradient-primary text-white shadow-lg transform scale-110'
                          : 'glass text-white hover:bg-white/20 hover:scale-105 transform'
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
                className={`relative inline-flex items-center rounded-xl px-4 py-3 transition-all duration-300 ${
                  page === totalPages
                    ? 'glass-dark text-white/50 cursor-not-allowed'
                    : 'glass text-white hover:bg-white/20 hover:scale-105 transform'
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
        />
      )}
    </div>
  );
};

export default UserManagement; 