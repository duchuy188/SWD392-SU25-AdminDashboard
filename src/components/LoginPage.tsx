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
    <div className="min-h-screen flex items-center justify-center gradient-primary animate-fadeIn">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative z-10 glass p-8 rounded-2xl shadow-2xl w-full max-w-md hover-lift animate-slideIn">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center mb-4 animate-pulse-custom">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">E</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">EduBot Admin</h2>
          <p className="text-white opacity-80 text-sm">Chào mừng trở lại</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-white font-medium mb-2 transition-all duration-300 group-focus-within:text-yellow-300">Email</label>
            <input
              type="email"
              title="Nhập email"
              placeholder="Nhập email của bạn"
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="group">
            <label className="block text-white font-medium mb-2 transition-all duration-300 group-focus-within:text-yellow-300">Mật khẩu</label>
            <input
              type="password"
              title="Nhập mật khẩu"
              placeholder="Nhập mật khẩu của bạn"
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl animate-fadeIn">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full gradient-warning text-gray-800 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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