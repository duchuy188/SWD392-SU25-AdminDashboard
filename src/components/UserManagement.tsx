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
  const [limit, setLimit] = useState(10);
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
        return 'bg-[#f3f0ff] text-[#7950f2] px-2 py-1 rounded-full text-sm font-medium';
      case 'student':
        return 'bg-[#e6f8f3] text-[#0ca678] px-2 py-1 rounded-full text-sm font-medium border border-[#0ca678]';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium';
    }
  };

  const getStatusBadgeClass = (isActive: boolean) => {
    return isActive
      ? 'bg-[#e3fafc] text-[#0c8599] px-2 py-1 rounded-full text-sm font-medium'
      : 'bg-red-50 text-red-600 px-2 py-1 rounded-full text-sm font-medium';
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
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Tạo người dùng mới
          </button>
          <label htmlFor="role-filter" className="font-medium text-gray-700">Lọc theo vai trò:</label>
          <select
            id="role-filter"
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 cursor-pointer hover:bg-gray-50"
            value={selectedRole}
            onChange={handleRoleChange}
          >
            <option value="all">Tất cả</option>
            <option value="student">Học viên</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr 
                key={user._id} 
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {updatingRole === user._id ? (
                    <div className="animate-pulse">
                      <div className="h-6 w-20 bg-gray-200 rounded"></div>
                    </div>
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleUpdate(user._id, e.target.value as 'student' | 'admin')}
                      className={`${getRoleBadgeClass(user.role)} border-none cursor-pointer focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="student">student</option>
                      <option value="admin">admin</option>
                    </select>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {updatingStatus === user._id ? (
                    <div className="animate-pulse">
                      <div className="h-6 w-20 bg-gray-200 rounded"></div>
                    </div>
                  ) : (
                    <select
                      value={user.isActive.toString()}
                      onChange={(e) => handleStatusUpdate(user._id, e.target.value)}
                      className={`${getStatusBadgeClass(user.isActive)} border-none cursor-pointer focus:ring-2 focus:ring-blue-500`}
                      style={{ minWidth: '100px' }}
                    >
                      <option value="true" className="bg-[#e3fafc] text-[#0c8599]">Unblock</option>
                      <option value="false" className="bg-red-50 text-red-600">Block</option>
                    </select>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedUserId(user._id)}
                    className="text-blue-600 hover:text-blue-900 transition-colors duration-200 flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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

      {/* Pagination controls */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
            className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
              page === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300`}
          >
            Trang trước
          </button>
          <button
            onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
            disabled={page === totalPages}
            className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
              page === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300`}
          >
            Trang sau
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{(page - 1) * limit + 1}</span> đến{' '}
              <span className="font-medium">{Math.min(page * limit, totalItems)}</span> trong{' '}
              <span className="font-medium">{totalItems}</span> kết quả
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setPage(page > 1 ? page - 1 : 1)}
                disabled={page === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                  page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                } border border-gray-300`}
              >
                <span className="sr-only">Trang trước</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    page === pageNum
                      ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                disabled={page === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                  page === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                } border border-gray-300`}
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