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
      <div className="glass p-6 rounded-xl border border-white/20">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️ Có lỗi xảy ra</div>
          <p className="text-white/80 mb-4">{error}</p>
          <button
            onClick={fetchTests}
            className="btn-primary flex items-center gap-2 mx-auto"
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
          <h1 className="text-3xl font-bold text-white mb-2">Quản lý bài test</h1>
          <p className="text-white/80">Quản lý các bài test tính cách và hướng nghiệp</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass p-6 rounded-xl border border-white/20">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm bài test..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-purple-300 w-4 h-4" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-200 appearance-none cursor-pointer"
              aria-label="Lọc theo loại bài test"
            >
              <option value="ALL" className="bg-gray-800 text-white">Tất cả loại</option>
              <option value="PERSONALITY" className="bg-gray-800 text-white">Tính cách</option>
              <option value="CAREER" className="bg-gray-800 text-white">Nghề nghiệp</option>
              <option value="SKILL" className="bg-gray-800 text-white">Kỹ năng</option>
            </select>
          </div>
          <button
            onClick={fetchTests}
            className="btn-secondary flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Test Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Tổng số bài test</p>
              <p className="text-2xl font-bold text-white">{tests.length}</p>
            </div>
            <Brain className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="glass p-4 rounded-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Test tính cách</p>
              <p className="text-2xl font-bold text-white">
                {tests.filter(t => t.type === 'PERSONALITY').length}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-purple-300 text-sm font-bold">P</span>
            </div>
          </div>
        </div>
        <div className="glass p-4 rounded-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Test nghề nghiệp</p>
              <p className="text-2xl font-bold text-white">
                {tests.filter(t => t.type === 'CAREER').length}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-blue-300 text-sm font-bold">C</span>
            </div>
          </div>
        </div>
        <div className="glass p-4 rounded-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Test kỹ năng</p>
              <p className="text-2xl font-bold text-white">
                {tests.filter(t => t.type === 'SKILL').length}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-green-300 text-sm font-bold">S</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test List */}
      <div className="glass p-6 rounded-xl border border-white/20">
        {loading ? (
          <div className="text-center py-8">
            <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-white/80">Đang tải danh sách bài test...</p>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg mb-2">
              {searchTerm || filterType !== 'ALL' 
                ? 'Không tìm thấy bài test nào' 
                : 'Chưa có bài test nào'}
            </p>
            <p className="text-white/40">
              {searchTerm || filterType !== 'ALL'
                ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                : 'Thêm bài test đầu tiên để bắt đầu'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Tên bài test</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Loại</th>
                  <th className="text-left py-3 px-4 text-white/80 font-medium">Mô tả</th>
                  <th className="text-right py-3 px-4 text-white/80 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((test) => (
                  <tr 
                    key={test._id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{test.name}</p>
                          <p className="text-white/50 text-sm">ID: {test._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(test.type)}`}>
                        {getTypeLabel(test.type)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-white/80 max-w-md truncate">{test.description}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="Xem chi tiết"
                          onClick={() => handleViewDetail(test._id)}
                          disabled={loadingDetail}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
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
        <div className="flex items-center justify-between glass p-4 rounded-xl border border-white/20">
          <p className="text-white/60">
            Hiển thị {filteredTests.length} bài test
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-white/60 hover:text-white transition-colors">
              Trước
            </button>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded">1</span>
            <button className="px-3 py-1 text-white/60 hover:text-white transition-colors">
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass rounded-2xl shadow-2xl p-8 mx-4">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
              <p className="text-white/80">Đang tải chi tiết bài test...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagement;
