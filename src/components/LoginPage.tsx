import React, { useState } from 'react';
import { userServices } from '../services/userServices';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await userServices.login(email, password);
      // Lưu thông tin user vào localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Lưu accessToken vào localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      // Kiểm tra role, chỉ cho phép admin
      if (response.data.user.role === 'admin') {
        // Set authentication state
        localStorage.setItem('isAuthenticated', 'true');
        // Use navigate instead of window.location for better routing
        navigate('/dashboard');
      } else {
        setError('Chỉ admin mới được truy cập dashboard');
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('isAuthenticated');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đăng nhập thất bại');
      localStorage.removeItem('isAuthenticated');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">EduBot Admin</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              title="Nhập email"
              placeholder="Nhập email của bạn"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mật khẩu</label>
            <input
              type="password"
              title="Nhập mật khẩu"
              placeholder="Nhập mật khẩu của bạn"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage; 