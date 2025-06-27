import React, { useEffect, useState } from 'react';
import { getUserById, updateUser } from '../services/accountServices';
import { User, StudentInfo, UserDetailResponse } from '../types/account';

interface UserDetailProps {
  userId: string;
  onClose: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ userId, onClose }) => {
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
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Không thể cập nhật thông tin người dùng'
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <p className="text-gray-700">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="flex items-center space-x-2 text-red-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Thông tin người dùng</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.fullName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-3xl text-gray-500">{user.fullName.charAt(0)}</span>
                  </div>
                )}
                <span 
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                    user.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{user.fullName}</h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>Chỉnh sửa</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chỉnh sửa thông tin</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleInputChange}
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
                    value={editForm.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                    value={editForm.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      updateLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {updateLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Đang cập nhật...</span>
                      </div>
                    ) : (
                      'Lưu thay đổi'
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Họ và tên</p>
                  <p className="mt-1 text-gray-900">{user.fullName}</p>
                </div>
                {user.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                    <p className="mt-1 text-gray-900">{user.phone}</p>
                  </div>
                )}
                {user.address && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                    <p className="mt-1 text-gray-900">{user.address}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày tạo tài khoản</p>
                  <p className="mt-1 text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Student Information */}
          {studentInfo && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin học viên</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  {studentInfo.grade && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Lớp</p>
                      <p className="mt-1 text-gray-900">{studentInfo.grade}</p>
                    </div>
                  )}
                  {studentInfo.personalityType && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tính cách</p>
                      <p className="mt-1 text-gray-900">{studentInfo.personalityType}</p>
                    </div>
                  )}
                </div>

                {/* Interests - Show even if empty */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-500 mb-2">Sở thích</p>
                  <div className="flex flex-wrap gap-2">
                    {studentInfo.interests.length > 0 ? (
                      studentInfo.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">Chưa có thông tin sở thích</p>
                    )}
                  </div>
                </div>

                {/* Preferred FPT Majors - Show even if empty */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-500 mb-2">Ngành học quan tâm</p>
                  <div className="flex flex-wrap gap-2">
                    {studentInfo.preferredFPTMajors.length > 0 ? (
                      studentInfo.preferredFPTMajors.map((major, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                        >
                          {major}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">Chưa có thông tin ngành học quan tâm</p>
                    )}
                  </div>
                </div>

                {/* Academic Results - Show even if empty */}
                <div className="mt-6">
                  <h4 className="text-base font-semibold text-gray-900 mb-4">Kết quả học tập</h4>
                  {studentInfo.academicResults.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Môn học
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Điểm
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Học kỳ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {studentInfo.academicResults.map((result, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {result.subject}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {result.score}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {result.semester}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 italic">Chưa có kết quả học tập</p>
                    </div>
                  )}
                </div>

                {/* Test Results - Show even if empty */}
                <div className="mt-6">
                  <h4 className="text-base font-semibold text-gray-900 mb-4">Kết quả kiểm tra</h4>
                  {studentInfo.testResults.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Bài kiểm tra
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Điểm
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ngày
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {studentInfo.testResults.map((result, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {result.test}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {result.score}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 italic">Chưa có kết quả kiểm tra</p>
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