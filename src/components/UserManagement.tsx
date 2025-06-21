import React, { useEffect, useState } from 'react';
import { getUsers } from '../services/accountServices';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  profilePicture: string;
  isActive: boolean;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers({ page, limit });
        setUsers(res.data.users);
        setTotalPages(res.data.pagination.pages);
      } catch (err: any) {
        setError('Không thể tải danh sách người dùng');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, limit]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Quản lý người dùng</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Họ tên</th>
              <th className="px-4 py-2 border-b">Vai trò</th>
              <th className="px-4 py-2 border-b">Trạng thái</th>
              <th className="px-4 py-2 border-b">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">{user.fullName}</td>
                <td className="px-4 py-2 border-b">{user.role}</td>
                <td className="px-4 py-2 border-b">{user.isActive ? 'Hoạt động' : 'Bị khóa'}</td>
                <td className="px-4 py-2 border-b">{new Date(user.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Trang trước
        </button>
        <span>Trang {page} / {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default UserManagement; 