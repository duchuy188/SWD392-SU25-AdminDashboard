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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(https://chamsockhachang.com/wp-content/uploads/truong-dai-hoc-fpt-ho-chi-minh.jpeg)' }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">EduBot Admin</h2>
          <p className="text-gray-600 text-sm">Chào mừng trở lại FPT University</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              title="Nhập email"
              placeholder="Nhập email của bạn"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Mật khẩu</label>
            <input
              type="password"
              title="Nhập mật khẩu"
              placeholder="Nhập mật khẩu của bạn"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang đăng nhập...
              </span>
            ) : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage; 