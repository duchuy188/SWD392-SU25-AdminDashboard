import React, { useEffect, useState } from 'react';
import { getUserById, updateUser } from '../services/accountServices';
import { User, StudentInfo, UserDetailResponse } from '../types/account';
import { toast } from 'react-toastify';

interface UserDetailProps {
  userId: string;
  onClose: () => void;
  onRoleUpdate?: (userId: string, newRole: 'student' | 'admin') => Promise<void>;
}

const UserDetail: React.FC<UserDetailProps> = ({ userId, onClose, onRoleUpdate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    address: '',
  });

  // Thêm state để theo dõi trạng thái cập nhật vai trò
  const [updatingRole, setUpdatingRole] = useState(false);
  
  // Hàm xử lý cập nhật vai trò
  const handleRoleChange = async (newRole: 'student' | 'admin') => {
    if (!onRoleUpdate) return;
    
    try {
      setUpdatingRole(true);
      await onRoleUpdate(userId, newRole);
      // Cập nhật lại thông tin người dùng sau khi thay đổi vai trò
      if (user) {
        setUser(prev => prev ? { ...prev, role: newRole } : null);
        
        // Thêm thông báo toast
        toast.success(`Đã cập nhật vai trò của ${user.email} thành ${newRole === 'admin' ? 'Quản trị viên' : 'Học viên'}!`);
      }
    } catch (error) {
      // Xử lý lỗi
      console.error('Không thể cập nhật vai trò:', error);
      toast.error(`Không thể cập nhật vai trò: ${error}`);
    } finally {
      setUpdatingRole(false);
    }
  };

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }

        const response = await getUserById(userId);
        if (!response.data) {
          throw new Error('Không nhận được dữ liệu từ API');
        }

        const userData: UserDetailResponse = response.data;
        if (!userData.user || !userData.user._id) {
          throw new Error('Dữ liệu người dùng không hợp lệ');
        }

        setUser(userData.user);
        setStudentInfo(userData.studentInfo);
        setEditForm({
          fullName: userData.user.fullName || '',
          phone: userData.user.phone || '',
          address: userData.user.address || '',
        });
      } catch (err: any) {
        setError(
          err.response?.data?.message || 
          err.message || 
          'Không thể tải thông tin chi tiết người dùng'
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetail();
    }
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setUpdateLoading(true);
      setError(null);

      const response = await updateUser(user._id, editForm);
      if (response.data) {
        setUser(prev => prev ? { ...prev, ...editForm } : null);
        setIsEditing(false);
        
        // Thêm thông báo toast
        toast.success(`Đã cập nhật thông tin người dùng ${user.email} thành công!`);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Không thể cập nhật thông tin người dùng'
      );
      toast.error(`Không thể cập nhật thông tin: ${err.response?.data?.message || err.message || 'Đã xảy ra lỗi'}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
        <div className="glass rounded-2xl p-8 max-w-md w-full mx-4 animate-slideUp">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 gradient-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 gradient-secondary rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 gradient-warning rounded-full animate-bounce"></div>
              </div>
            </div>
            <p className="text-white font-medium text-lg">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
        <div className="glass rounded-2xl p-8 max-w-md w-full mx-4 border-l-4 border-red-500 animate-slideUp">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Lỗi</h3>
              <p className="text-white/80">{error}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 gradient-danger text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="glass rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden mx-4 animate-slideUp">
        <div className="sticky top-0 glass-dark px-8 py-6 flex justify-between items-center border-b border-white/20">
          <div className="flex items-center">
            <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Thông tin người dùng</h2>
              <p className="text-white/80">Chi tiết và thông tin học viên</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Đóng modal"
            className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 p-2 rounded-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.fullName}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-2xl"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl gradient-secondary flex items-center justify-center border-4 border-white/20 shadow-2xl">
                    <span className="text-3xl text-white font-bold">{user.fullName.charAt(0)}</span>
                  </div>
                )}
                <span 
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white shadow-lg ${
                    user.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{user.fullName}</h3>
                <p className="text-white/80 text-lg mb-3">{user.email}</p>
                <div className="flex items-center space-x-3">
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                    user.role === 'admin' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  }`}>
                    {user.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
                  </span>
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                    user.isActive 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                      : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                  }`}>
                    {user.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="px-6 py-3 gradient-warning text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Chỉnh sửa</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="glass rounded-2xl p-8 animate-fadeIn">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 gradient-warning rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Chỉnh sửa thông tin</h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-white mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={editForm.fullName}
                      onChange={handleInputChange}
                      className="w-full glass text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 placeholder-white/50"
                      placeholder="Nhập họ và tên"
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
                      value={editForm.phone}
                      onChange={handleInputChange}
                      className="w-full glass text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 placeholder-white/50"
                      placeholder="Nhập số điện thoại"
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
                    value={editForm.address}
                    onChange={handleInputChange}
                    className="w-full glass text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 placeholder-white/50"
                    placeholder="Nhập địa chỉ"
                  />
                </div>
                
                {/* Thêm phần chỉnh sửa vai trò khi đang ở chế độ chỉnh sửa */}
                {onRoleUpdate && (
                  <div>
                    <label htmlFor="role" className="block text-sm font-semibold text-white mb-2">
                      Vai trò
                    </label>
                    <select
                      id="role"
                      value={user.role}
                      onChange={(e) => handleRoleChange(e.target.value as 'student' | 'admin')}
                      className="w-full glass text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
                      disabled={updatingRole}
                    >
                      <option value="student" className="bg-gray-800 text-white">Học viên</option>
                      <option value="admin" className="bg-gray-800 text-white">Quản trị viên</option>
                    </select>
                  </div>
                )}
                
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-3 glass text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-semibold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className={`px-6 py-3 gradient-success text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold flex items-center space-x-2 ${
                      updateLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {updateLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Đang cập nhật...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Lưu thay đổi</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="glass rounded-2xl p-8 animate-fadeIn">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 gradient-info rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Thông tin cơ bản</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-white/60 mb-1">Email</p>
                    <p className="text-white text-lg">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/60 mb-1">Họ và tên</p>
                    <p className="text-white text-lg">{user.fullName}</p>
                  </div>
                  {user.phone && (
                    <div>
                      <p className="text-sm font-semibold text-white/60 mb-1">Số điện thoại</p>
                      <p className="text-white text-lg">{user.phone}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  {user.address && (
                    <div>
                      <p className="text-sm font-semibold text-white/60 mb-1">Địa chỉ</p>
                      <p className="text-white text-lg break-words">{user.address}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-white/60 mb-1">Ngày tạo tài khoản</p>
                    <p className="text-white text-lg">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Student Information */}
          {studentInfo && (
            <div className="space-y-8">
              <div className="glass rounded-2xl p-8 animate-fadeIn">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 gradient-success rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">Thông tin học viên</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {studentInfo.grade && (
                    <div>
                      <p className="text-sm font-semibold text-white/60 mb-1">Lớp</p>
                      <p className="text-white text-lg">{studentInfo.grade}</p>
                    </div>
                  )}
                  {studentInfo.personalityType && (
                    <div>
                      <p className="text-sm font-semibold text-white/60 mb-1">Tính cách</p>
                      <p className="text-white text-lg">{studentInfo.personalityType}</p>
                    </div>
                  )}
                </div>

                {/* Interests */}
                <div className="mb-8">
                  <p className="text-sm font-semibold text-white/60 mb-4">Sở thích</p>
                  <div className="flex flex-wrap gap-3">
                    {studentInfo.interests.length > 0 ? (
                      studentInfo.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 interest-tag text-white rounded-xl text-sm font-medium"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <div className="glass-dark rounded-xl p-4 w-full text-center">
                        <div className="w-12 h-12 empty-state-icon gradient-info rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <p className="text-white/60 italic">Chưa có thông tin sở thích</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferred FPT Majors */}
                <div className="mb-8">
                  <p className="text-sm font-semibold text-white/60 mb-4">Ngành học quan tâm</p>
                  <div className="flex flex-wrap gap-3">
                    {studentInfo.preferredFPTMajors.length > 0 ? (
                      studentInfo.preferredFPTMajors.map((major, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 major-tag text-white rounded-xl text-sm font-medium"
                        >
                          {major}
                        </span>
                      ))
                    ) : (
                      <div className="glass-dark rounded-xl p-4 w-full text-center">
                        <div className="w-12 h-12 empty-state-icon gradient-success rounded-full flex items-center justify-center mx-auto mb-2">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          </svg>
                        </div>
                        <p className="text-white/60 italic">Chưa có thông tin ngành học quan tâm</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Results */}
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                    <div className="w-6 h-6 gradient-warning rounded-full flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    Kết quả học tập
                  </h4>
                  {studentInfo.academicResults.length > 0 ? (
                    <div className="glass-dark rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-white/10">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                                Môn học
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                                Điểm
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                                Học kỳ
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/20">
                            {studentInfo.academicResults.map((result, index) => (
                              <tr key={index} className="table-row-hover">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                                  {result.subject}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                                    result.score >= 8 ? 'score-excellent' : 
                                    result.score >= 6.5 ? 'score-good' : 'score-poor'
                                  }`}>
                                    {result.score}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                                  {result.semester}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-dark rounded-xl p-8 text-center">
                      <div className="w-16 h-16 empty-state-icon gradient-info rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="text-white/60 italic">Chưa có kết quả học tập</p>
                    </div>
                  )}
                </div>

                {/* Test Results */}
                <div>
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                    <div className="w-6 h-6 gradient-info rounded-full flex items-center justify-center mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    Kết quả kiểm tra
                  </h4>
                  {user.testResults && user.testResults.length > 0 ? (
                    <div className="glass-dark rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-white/10">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                                Bài kiểm tra
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                                Kết quả
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                                Loại
                              </th>
                              <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                                Ngày
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/20">
                            {user.testResults
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                              .filter((result, index, self) => 
                                index === self.findIndex((t) => t.testId === result.testId)
                              )
                              .slice(0, 5)
                              .map((result, index) => (
                                <tr key={index} className="table-row-hover">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                                    {result.testName}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500">
                                      {result.result}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                                    {result.testType}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                                    {new Date(result.date).toLocaleDateString('vi-VN', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-dark rounded-xl p-8 text-center">
                      <div className="w-16 h-16 empty-state-icon gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                      </div>
                      <p className="text-white/60 italic">Chưa có kết quả kiểm tra</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail; 