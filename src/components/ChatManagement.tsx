import React, { useState, useEffect } from 'react';
import { chatServices } from '../services/chatServices';
import { ChatResponse, Conversation } from '../types/chat';    

// Custom hook for debouncing
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ChatManagement: React.FC = () => {
  const [chatData, setChatData] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    startDate: '',
    endDate: '',
  });

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Initial load
  useEffect(() => {
    fetchAllChats(true);
  }, []);

  // Watch for search params and pagination changes
  useEffect(() => {
    if (chatData) { // Only if data is already loaded
      fetchAllChats(false);
    }
  }, [currentPage, searchParams]);

  // Thêm useEffect mới để theo dõi debouncedSearchTerm
  useEffect(() => {
    setSearchParams(prev => ({
      ...prev,
      keyword: debouncedSearchTerm
    }));
  }, [debouncedSearchTerm]);

  const fetchAllChats = async (isInitialLoad: boolean) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setSearchLoading(true);
      }
      const response = await chatServices.getAllChats(
        currentPage, 
        10, 
        undefined,
        searchParams.keyword, 
        searchParams.startDate, 
        searchParams.endDate, 
        undefined
      );
      setChatData(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu chat');
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Thêm hàm này để áp dụng bộ lọc
  const applyFilters = () => {
    setSearchParams({
      keyword: searchTerm,
      startDate,
      endDate,
    });
    setCurrentPage(1); // Reset về trang 1 khi áp dụng bộ lọc mới
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const filteredConversations = chatData?.conversations?.filter((conv: Conversation) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      conv.student?.fullName?.toLowerCase().includes(searchLower) ||
      conv.student?.email?.toLowerCase().includes(searchLower) ||
      conv.lastTopic?.toLowerCase().includes(searchLower) ||
      conv._id?.toLowerCase().includes(searchLower)
    );
  }) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 animate-fadeIn">
        <div className="relative">
          <div className="w-16 h-16 gradient-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 gradient-secondary rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 gradient-warning rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-6 border-l-4 border-red-500 animate-fadeIn">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-red-800 font-semibold text-lg">{error}</div>
        </div>
        <button
          onClick={() => fetchAllChats(true)}
          className="px-6 py-3 gradient-secondary text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.18-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.18 4.03-8 9-8s9 3.82 9 8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">Quản lý Chat</h1>
            <p className="text-gray-600">Theo dõi và quản lý các cuộc trò chuyện</p>
          </div>
        </div>
        <button
          onClick={() => fetchAllChats(true)}
          className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 flex items-center font-semibold transition-all duration-300"
        >
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8 animate-slideIn">
        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc chủ đề..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-10 py-2.5 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-500 text-sm border border-gray-200"
          />
          {searchLoading ? (
            <div className="absolute right-3 top-2.5">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>



      {/* Stats */}
      {chatData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{chatData.pagination?.total || 0}</div>
                <div className="text-gray-600">Tổng cuộc trò chuyện</div>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.18-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.18 4.03-8 9-8s9 3.82 9 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{filteredConversations.length}</div>
                <div className="text-gray-600">Hiển thị</div>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{chatData.pagination?.pages || 0}</div>
                <div className="text-gray-600">Tổng trang</div>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{chatData.pagination?.page || 0}</div>
                <div className="text-gray-600">Trang hiện tại</div>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Học sinh
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Thời gian bắt đầu
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Chủ đề cuối
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Số tương tác
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                    Thao tác
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredConversations.map((conversation: Conversation) => (
                <tr key={conversation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-bold text-sm">
                          {(conversation.student?.fullName || 'N')[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {conversation.student?.fullName || 'Không có tên'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {conversation.student?.email || 'Không có email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800 font-medium">
                      {conversation.startTime ? formatDate(conversation.startTime) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 text-blue-600">
                      {conversation.lastTopic || 'Chưa có chủ đề'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center mr-2">
                        <span className="text-purple-600 font-bold text-xs">
                          {conversation.interactions?.length || 0}
                        </span>
                      </div>
                      <span className="text-gray-600 text-sm">tương tác</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedConversation(conversation)}
                      title="Xem chi tiết cuộc trò chuyện"
                      className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:from-gray-100 hover:to-gray-200 flex items-center gap-2 border border-gray-200 transition-all duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredConversations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.18-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.18 4.03-8 9-8s9 3.82 9 8z" />
              </svg>
            </div>
            <div className="text-black text-lg">Không tìm thấy cuộc trò chuyện nào</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {chatData && chatData.pagination && (chatData.pagination.pages || 0) > 1 && (
        <div className="bg-white px-6 py-4 flex items-center justify-between rounded-xl mt-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 bg-gray-100 text-sm font-medium rounded-xl text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(chatData.pagination?.pages || 1, currentPage + 1))}
              disabled={currentPage === (chatData.pagination?.pages || 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 bg-gray-100 text-sm font-medium rounded-xl text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-black font-medium">
                Hiển thị{' '}
                <span className="font-bold">{((currentPage - 1) * (chatData.pagination?.limit || 10)) + 1}</span>
                {' '}-{' '}
                <span className="font-bold">
                  {Math.min(currentPage * (chatData.pagination?.limit || 10), chatData.pagination?.total || 0)}
                </span>
                {' '}trong{' '}
                <span className="font-bold">{chatData.pagination?.total || 0}</span>
                {' '}kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px" aria-label="Pagination">
                {/* Previous button */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  title="Trang trước"
                  aria-label="Trang trước"
                  className="relative inline-flex items-center px-3 py-2 rounded-l-xl bg-white text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: chatData.pagination?.pages || 1 }, (_, i) => i + 1).map((pageNum) => {
                  const totalPages = chatData.pagination?.pages || 1;
                  const shouldShow = 
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                  if (!shouldShow && pageNum === 2 && currentPage > 4) {
                    return (
                      <span key="dots1" className="relative inline-flex items-center px-4 py-2 bg-white text-sm font-medium text-black">
                        ...
                      </span>
                    );
                  }

                  if (!shouldShow && pageNum === totalPages - 1 && currentPage < totalPages - 3) {
                    return (
                      <span key="dots2" className="relative inline-flex items-center px-4 py-2 bg-white text-sm font-medium text-black">
                        ...
                      </span>
                    );
                  }

                  if (!shouldShow) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                        currentPage === pageNum
                          ? 'bg-gray-100 text-black'
                          : 'bg-white text-black hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next button */}
                <button
                  onClick={() => setCurrentPage(Math.min(chatData.pagination?.pages || 1, currentPage + 1))}
                  disabled={currentPage === (chatData.pagination?.pages || 1)}
                  title="Trang sau"
                  aria-label="Trang sau"
                  className="relative inline-flex items-center px-3 py-2 rounded-r-xl bg-white text-sm font-medium text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Chat Detail Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden mx-4 animate-slideUp border border-blue-200">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-6 flex justify-between items-center border-b border-purple-300">
              <div className="flex items-center">
                <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.18-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.18 4.03-8 9-8s9 3.82 9 8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Chi tiết cuộc trò chuyện</h2>
                  <p className="text-white/80">Thông tin và lịch sử tương tác</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedConversation(null)}
                title="Đóng modal"
                className="text-white/90 hover:text-white hover:bg-white/20 transition-all duration-300 p-2 rounded-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl gradient-secondary flex items-center justify-center border-4 border-purple-200 shadow-2xl">
                      <span className="text-3xl text-white font-bold">
                        {(selectedConversation.student?.fullName || 'N')[0]?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedConversation.student?.fullName || 'Không có tên'}</h3>
                    <p className="text-gray-600 text-lg mb-3">{selectedConversation.student?.email || 'Không có email'}</p>
                    <div className="flex items-center space-x-3">
                      <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {selectedConversation.interactions?.length || 0} tương tác
                      </span>
                      <span className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                        {selectedConversation.lastTopic || 'Chưa có chủ đề'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin cơ bản */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 animate-fadeIn shadow-lg border border-purple-200">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 gradient-info rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Thông tin cơ bản</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Email</p>
                      <p className="text-gray-800 text-lg">{selectedConversation.student?.email || 'Không có email'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Họ và tên</p>
                      <p className="text-gray-800 text-lg">{selectedConversation.student?.fullName || 'Không có tên'}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Thời gian bắt đầu</p>
                      <p className="text-gray-800 text-lg">
                        {selectedConversation.startTime ? formatDate(selectedConversation.startTime) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Chủ đề cuối</p>
                      <p className="text-gray-800 text-lg">{selectedConversation.lastTopic || 'Chưa có chủ đề'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lịch sử tương tác */}
              <div className="space-y-8">
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 animate-fadeIn shadow-lg border border-purple-200">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 gradient-success rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.18-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.18 4.03-8 9-8s9 3.82 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Lịch sử tương tác</h3>
                  </div>

                  {selectedConversation.interactions && selectedConversation.interactions.length > 0 ? (
                    <div className="space-y-6">
                      {selectedConversation.interactions.map((interaction, index) => (
                        <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-purple-100">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 gradient-warning rounded-xl flex items-center justify-center mr-3">
                                <span className="text-white font-bold">{index + 1}</span>
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-800">Tương tác #{index + 1}</h4>
                                <p className="text-sm text-gray-600">
                                  {interaction.timestamp ? formatDate(interaction.timestamp) : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center mb-2">
                                <div className="w-6 h-6 gradient-info rounded-lg flex items-center justify-center mr-2">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Câu hỏi</span>
                              </div>
                              <div className="bg-purple-50/80 rounded-xl p-4 text-gray-800">
                                {interaction.query || 'Không có câu hỏi'}
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center mb-2">
                                <div className="w-6 h-6 gradient-success rounded-lg flex items-center justify-center mr-2">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                                  </svg>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Phản hồi</span>
                              </div>
                              <div className="bg-pink-50/80 rounded-xl p-4 text-gray-800">
                                {interaction.response || 'Không có phản hồi'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 text-center border border-purple-100">
                      <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.18-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.18 4.03-8 9-8s9 3.82 9 8z" />
                        </svg>
                      </div>
                      <p className="text-gray-800 text-xl font-semibold mb-2">Không có tương tác nào</p>
                      <p className="text-gray-600">Cuộc trò chuyện này chưa có bất kỳ tương tác nào</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatManagement;
