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
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'CAREER':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'SKILL':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Có lỗi xảy ra</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTests}
            className="bg-gray-100 text-black px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Quản lý bài test</h1>
          <p className="text-gray-600">Quản lý các bài test tính cách và hướng nghiệp</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm bài test..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-600 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-gray-100 cursor-pointer"
              aria-label="Lọc theo loại bài test"
            >
              <option value="ALL" className="bg-white text-black">Tất cả loại</option>
              <option value="PERSONALITY" className="bg-white text-black">Tính cách</option>
              <option value="CAREER" className="bg-white text-black">Nghề nghiệp</option>
              <option value="SKILL" className="bg-white text-black">Kỹ năng</option>
            </select>
          </div>
          <button
            onClick={fetchTests}
            className="bg-gray-100 text-black px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Test Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng số bài test</p>
              <p className="text-2xl font-bold text-black">{tests.length}</p>
            </div>
            <Brain className="w-8 h-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Test tính cách</p>
              <p className="text-2xl font-bold text-black">
                {tests.filter(t => t.type === 'PERSONALITY').length}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 text-sm font-bold">P</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Test nghề nghiệp</p>
              <p className="text-2xl font-bold text-black">
                {tests.filter(t => t.type === 'CAREER').length}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 text-sm font-bold">C</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Test kỹ năng</p>
              <p className="text-2xl font-bold text-black">
                {tests.filter(t => t.type === 'SKILL').length}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-600 text-sm font-bold">S</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test List */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Đang tải danh sách bài test...</p>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">
              {searchTerm || filterType !== 'ALL' 
                ? 'Không tìm thấy bài test nào' 
                : 'Chưa có bài test nào'}
            </p>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'ALL'
                ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                : 'Thêm bài test đầu tiên để bắt đầu'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Tên bài test</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Loại</th>
                  <th className="text-left py-3 px-4 text-gray-600 font-medium">Mô tả</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((test) => (
                  <tr 
                    key={test._id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-black font-medium">{test.name}</p>
                          <p className="text-gray-500 text-sm">ID: {test._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        {getTypeLabel(test.type)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600 max-w-md truncate">{test.description}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Xem chi tiết"
                          onClick={() => handleViewDetail(test._id)}
                          disabled={loadingDetail}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
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
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-gray-600">
            Hiển thị {filteredTests.length} bài test
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-gray-600 hover:text-black transition-colors">
              Trước
            </button>
            <span className="px-3 py-1 bg-gray-100 text-black rounded">1</span>
            <button className="px-3 py-1 text-gray-600 hover:text-black transition-colors">
              Sau
            </button>
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
