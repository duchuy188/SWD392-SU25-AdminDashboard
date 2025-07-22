import React, { useState, useEffect } from 'react';
import { Test } from '../types/Test';
import testServices from '../services/testServices';
import { 
  Brain, 
  Eye, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import TestDetailModal from './TestDetailModal';

const TestManagement: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [error, setError] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await testServices.getAllTests();
      setTests(data);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setError('Không thể tải danh sách bài test. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (testId: string) => {
    try {
      setLoadingDetail(true);
      const detailedTest = await testServices.getTestById(testId);
      setSelectedTest(detailedTest);
    } catch (error) {
      setError('Không thể tải chi tiết bài test. Vui lòng thử lại.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || test.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PERSONALITY':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-purple-300';
      case 'CAREER':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-300';
      case 'SKILL':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'PERSONALITY':
        return 'Tính cách';
      case 'CAREER':
        return 'Nghề nghiệp';
      case 'SKILL':
        return 'Kỹ năng';
      default:
        return type;
    }
  };

  if (error) {
    return (
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
          onClick={fetchTests}
          className="px-6 py-3 gradient-secondary text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-sky-100 rounded-2xl flex items-center justify-center mr-4">
            <Brain className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black mb-1">Quản lý bài test</h1>
            <p className="text-black">Quản lý các bài test tính cách và hướng nghiệp</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchTests}
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
          <div className="flex items-center space-x-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl px-4 py-3 border border-gray-200">
            <label htmlFor="type-filter" className="font-medium text-black">Lọc theo loại:</label>
            <select
              id="type-filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-100 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-200 font-semibold"
            >
              <option value="ALL" className="bg-white text-black">Tất cả</option>
              <option value="PERSONALITY" className="bg-white text-black">Tính cách</option>
              <option value="CAREER" className="bg-white text-black">Nghề nghiệp</option>
              <option value="SKILL" className="bg-white text-black">Kỹ năng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-900 mb-1">{tests.length}</div>
              <div className="text-blue-700">Tổng số bài test</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-inner">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-900 mb-1">
                {tests.filter(t => t.type === 'PERSONALITY').length}
              </div>
              <div className="text-purple-700">Test tính cách</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-white font-bold">P</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-indigo-900 mb-1">
                {tests.filter(t => t.type === 'CAREER').length}
              </div>
              <div className="text-indigo-700">Test nghề nghiệp</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-white font-bold">C</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-900 mb-1">
                {tests.filter(t => t.type === 'SKILL').length}
              </div>
              <div className="text-green-700">Test kỹ năng</div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-white font-bold">S</span>
            </div>
          </div>
        </div>
      </div>
      {/* Test List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64 animate-fadeIn">
            <div className="relative">
              <div className="w-16 h-16 gradient-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 gradient-secondary rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 gradient-warning rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-black text-lg">Không tìm thấy bài test nào</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Brain className="w-4 h-4 mr-2 text-blue-600" />
                      Tên bài test
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Filter className="w-4 h-4 mr-2 text-blue-600" />
                      Loại
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                      Mô tả
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center justify-end">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                      Thao tác
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTests.map((test) => (
                  <tr 
                    key={test._id} 
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <Brain className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-black">{test.name}</div>
                          <div className="text-sm text-gray-500">ID: {test._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${getTypeColor(test.type)} px-3 py-1 rounded-full text-sm font-medium`}>
                        {getTypeLabel(test.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">{test.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetail(test._id)}
                          title="Xem chi tiết"
                          className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:from-gray-100 hover:to-gray-200 flex items-center gap-2 border border-gray-200 transition-all duration-300"
                          disabled={loadingDetail}
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredTests.length > 0 && (
        <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              className="relative inline-flex items-center rounded-xl px-6 py-3 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Trang trước
            </button>
            <button
              className="relative ml-3 inline-flex items-center rounded-xl px-6 py-3 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            >
              Trang sau
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">
                Hiển thị <span className="font-bold text-gray-900">{filteredTests.length}</span> bài test
              </p>
            </div>
            <div>
              <nav className="flex items-center space-x-2" aria-label="Pagination">
                <button
                  className="relative inline-flex items-center rounded-xl px-4 py-3 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                >
                  <span className="sr-only">Trang trước</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="relative inline-flex items-center px-4 py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-sm">
                  1
                </span>
                <button
                  className="relative inline-flex items-center rounded-xl px-4 py-3 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
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
      )}

      {/* Test Detail Modal */}
      {selectedTest && (
        <TestDetailModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
        />
      )}

      {/* Loading Modal */}
      {loadingDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow p-8 mx-4">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Đang tải chi tiết bài test...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagement;
