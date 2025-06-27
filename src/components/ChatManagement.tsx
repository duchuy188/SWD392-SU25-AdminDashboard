import React, { useState, useEffect } from 'react';
import { chatServices } from '../services/chatServices';
import { ChatResponse, Conversation } from '../types/chat';    


const ChatManagement: React.FC = () => {
  const [chatData, setChatData] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAllChats();
  }, [currentPage]);

  const fetchAllChats = async () => {
    try {
      setLoading(true);
      const response = await chatServices.getAllChats(currentPage);
      setChatData(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-red-800 font-semibold text-lg">{error}</div>
        </div>
        <button
          onClick={fetchAllChats}
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
          <div className="w-10 h-10 gradient-info rounded-2xl flex items-center justify-center mr-4 animate-pulse-custom">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.18-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.18 4.03-8 9-8s9 3.82 9 8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Quản lý Chat</h1>
            <p className="text-white/80">Theo dõi và quản lý các cuộc trò chuyện</p>
          </div>
        </div>
        <button
          onClick={fetchAllChats}
          className="px-6 py-3 glass text-white rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex items-center font-semibold"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8 animate-slideIn">
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc chủ đề..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-12 pr-6 py-4 glass rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 text-white placeholder-white/70 text-lg"
          />
          <svg className="absolute left-4 top-4 h-6 w-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Stats */}
      {chatData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-2xl p-6 hover-lift group animate-fadeIn delay-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-1">{chatData.pagination?.total || 0}</div>
                <div className="text-white/80">Tổng cuộc trò chuyện</div>
              </div>
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.18-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.18 4.03-8 9-8s9 3.82 9 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 hover-lift group animate-fadeIn delay-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-1">{filteredConversations.length}</div>
                <div className="text-white/80">Hiển thị</div>
              </div>
              <div className="w-12 h-12 gradient-success rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 hover-lift group animate-fadeIn delay-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-1">{chatData.pagination?.pages || 0}</div>
                <div className="text-white/80">Tổng trang</div>
              </div>
              <div className="w-12 h-12 gradient-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="glass rounded-2xl p-6 hover-lift group animate-fadeIn delay-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-1">{chatData.pagination?.page || 0}</div>
                <div className="text-white/80">Trang hiện tại</div>
              </div>
              <div className="w-12 h-12 gradient-warning rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat List */}
      <div className="glass rounded-2xl shadow-2xl overflow-hidden animate-fadeIn delay-400">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="glass-dark">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Học sinh
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Thời gian bắt đầu
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Chủ đề cuối
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Số tương tác
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                    Thao tác
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {filteredConversations.map((conversation: Conversation, index) => (
                <tr key={conversation._id} className={`hover:bg-white/10 transition-colors duration-300 animate-fadeIn delay-${index % 5}00`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 gradient-secondary rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">
                          {(conversation.student?.fullName || 'N')[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {conversation.student?.fullName || 'Không có tên'}
                        </div>
                        <div className="text-sm text-white/70">
                          {conversation.student?.email || 'Không có email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white font-medium">
                      {conversation.startTime ? formatDate(conversation.startTime) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full glass text-white">
                      {conversation.lastTopic || 'Chưa có chủ đề'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 gradient-warning rounded-full flex items-center justify-center mr-2">
                        <span className="text-white font-bold text-xs">
                          {conversation.interactions?.length || 0}
                        </span>
                      </div>
                      <span className="text-white/80 text-sm">tương tác</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedConversation(conversation)}
                      className="glass text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredConversations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 gradient-info rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.18-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.18 4.03-8 9-8s9 3.82 9 8z" />
              </svg>
            </div>
            <div className="text-white/80 text-lg">Không tìm thấy cuộc trò chuyện nào</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {chatData && chatData.pagination && (chatData.pagination.pages || 0) > 1 && (
        <div className="glass px-6 py-4 flex items-center justify-between rounded-2xl mt-6 animate-fadeIn delay-500">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 glass border border-white/30 text-sm font-medium rounded-xl text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Trước
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(chatData.pagination?.pages || 1, currentPage + 1))}
              disabled={currentPage === (chatData.pagination?.pages || 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 glass border border-white/30 text-sm font-medium rounded-xl text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Sau
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-white font-medium">
                Hiển thị{' '}
                <span className="font-bold text-yellow-400">{((currentPage - 1) * (chatData.pagination?.limit || 10)) + 1}</span>
                {' '}-{' '}
                <span className="font-bold text-yellow-400">
                  {Math.min(currentPage * (chatData.pagination?.limit || 10), chatData.pagination?.total || 0)}
                </span>
                {' '}trong{' '}
                <span className="font-bold text-yellow-400">{chatData.pagination?.total || 0}</span>
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
                  className="relative inline-flex items-center px-3 py-2 rounded-l-xl glass border border-white/30 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: chatData.pagination?.pages || 1 }, (_, i) => i + 1).map((pageNum) => {
                  // Show first page, last page, current page, and pages around current page
                  const totalPages = chatData.pagination?.pages || 1;
                  const shouldShow = 
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);

                  if (!shouldShow && pageNum === 2 && currentPage > 4) {
                    return (
                      <span key="dots1" className="relative inline-flex items-center px-4 py-2 glass border border-white/30 text-sm font-medium text-white">
                        ...
                      </span>
                    );
                  }

                  if (!shouldShow && pageNum === totalPages - 1 && currentPage < totalPages - 3) {
                    return (
                      <span key="dots2" className="relative inline-flex items-center px-4 py-2 glass border border-white/30 text-sm font-medium text-white">
                        ...
                      </span>
                    );
                  }

                  if (!shouldShow) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-300 ${
                        currentPage === pageNum
                          ? 'z-10 gradient-warning text-gray-800 border-yellow-400 shadow-lg'
                          : 'glass border-white/30 text-white hover:bg-white/20'
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
                  className="relative inline-flex items-center px-3 py-2 rounded-r-xl glass border border-white/30 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
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
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-sm transition-opacity" onClick={() => setSelectedConversation(null)}></div>
            
            <div className="inline-block align-bottom bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full animate-slideIn border border-purple-500/30">
              <div className="px-8 py-6 border-b border-purple-400/30 flex justify-between items-center bg-gradient-to-r from-purple-800/50 to-pink-800/50">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {(selectedConversation.student?.fullName || 'N')[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                      Chi tiết cuộc trò chuyện
                    </h3>
                    <p className="text-purple-200">{selectedConversation.student?.fullName || 'Không có tên'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white rounded-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                  title="Đóng"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto max-h-[70vh]">
                {/* Thông tin cơ bản */}
                <div className="mb-8 bg-gradient-to-r from-purple-800/40 to-pink-800/40 rounded-3xl p-8 border border-purple-400/20">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">Thông tin cuộc trò chuyện</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-purple-700/30 to-pink-700/30 rounded-2xl p-5 border border-purple-400/20">
                      <div className="text-sm text-purple-300 mb-2 font-medium">Thời gian bắt đầu</div>
                      <div className="text-purple-100 font-semibold text-lg">
                        {selectedConversation.startTime ? formatDate(selectedConversation.startTime) : 'N/A'}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-700/30 to-pink-700/30 rounded-2xl p-5 border border-purple-400/20">
                      <div className="text-sm text-purple-300 mb-2 font-medium">Học sinh</div>
                      <div className="text-purple-100 font-semibold text-lg">
                        {selectedConversation.student?.fullName || 'Không có tên'}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-700/30 to-pink-700/30 rounded-2xl p-5 border border-purple-400/20">
                      <div className="text-sm text-purple-300 mb-2 font-medium">Email</div>
                      <div className="text-purple-100 font-semibold text-lg">
                        {selectedConversation.student?.email || 'Không có email'}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-700/30 to-pink-700/30 rounded-2xl p-5 border border-purple-400/20">
                      <div className="text-sm text-purple-300 mb-2 font-medium">Chủ đề cuối</div>
                      <div className="text-purple-100 font-semibold text-lg">
                        {selectedConversation.lastTopic || 'Chưa có chủ đề'}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-700/30 to-pink-700/30 rounded-2xl p-5 md:col-span-2 border border-purple-400/20">
                      <div className="text-sm text-purple-300 mb-2 font-medium">Số tương tác</div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">
                            {selectedConversation.interactions?.length || 0}
                          </span>
                        </div>
                        <span className="text-purple-100 font-semibold text-lg">tương tác</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Các tương tác */}
                <div className="space-y-8">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Lịch sử tương tác</h4>
                  </div>
                  {selectedConversation.interactions && selectedConversation.interactions.length > 0 ? (
                    selectedConversation.interactions.map((interaction, index) => (
                      <div key={index} className={`bg-gradient-to-r from-indigo-800/40 to-purple-800/40 rounded-3xl p-8 border border-indigo-400/20 animate-fadeIn delay-${index % 3}00`}>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                            <span className="text-purple-200 font-semibold text-lg">Tương tác #{index + 1}</span>
                          </div>
                          <div className="text-xs text-purple-300 bg-purple-700/30 px-4 py-2 rounded-full border border-purple-400/20">
                            {interaction.timestamp ? formatDate(interaction.timestamp) : 'N/A'}
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <div className="flex items-center mb-3">
                              <svg className="w-5 h-5 text-sky-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-bold text-sky-400">Câu hỏi</span>
                            </div>
                            <div className="text-purple-100 bg-gradient-to-r from-sky-900/40 to-blue-900/40 p-5 rounded-2xl border-l-4 border-sky-400">
                              {interaction.query || 'Không có câu hỏi'}
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center mb-3">
                              <svg className="w-5 h-5 text-emerald-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                              </svg>
                              <span className="text-sm font-bold text-emerald-400">Phản hồi</span>
                            </div>
                            <div className="text-purple-100 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 p-5 rounded-2xl border-l-4 border-emerald-400">
                              {interaction.response || 'Không có phản hồi'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gradient-to-r from-slate-800/40 to-gray-800/40 rounded-3xl p-16 text-center border border-slate-400/20">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 opacity-60">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.18-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.18 4.03-8 9-8s9 3.82 9 8z" />
                        </svg>
                      </div>
                      <div className="text-slate-300 text-xl font-semibold mb-2">Không có tương tác nào</div>
                      <div className="text-slate-400 text-sm">Cuộc trò chuyện này chưa có bất kỳ tương tác nào</div>
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
