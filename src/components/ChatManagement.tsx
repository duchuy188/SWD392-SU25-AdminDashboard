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
      console.log('API Response:', response.data); // Debug log
      console.log('Response structure:', typeof response.data, Object.keys(response.data || {})); // Debug log
      setChatData(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu chat');
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện này?')) {
      try {
        await chatServices.deleteChatById(chatId);
        fetchAllChats(); // Refresh the list
      } catch (err) {
        console.error('Error deleting chat:', err);
        alert('Không thể xóa cuộc trò chuyện');
      }
    }
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
        <button
          onClick={fetchAllChats}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Chat</h1>
        <button
          onClick={fetchAllChats}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc chủ đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Stats */}
      {chatData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-blue-600">{chatData.pagination?.total || 0}</div>
            <div className="text-gray-600">Tổng cuộc trò chuyện</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-green-600">{filteredConversations.length}</div>
            <div className="text-gray-600">Hiển thị</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-purple-600">{chatData.pagination?.pages || 0}</div>
            <div className="text-gray-600">Tổng trang</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-2xl font-bold text-orange-600">{chatData.pagination?.page || 0}</div>
            <div className="text-gray-600">Trang hiện tại</div>
          </div>
        </div>
      )}

      {/* Chat List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Học sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian bắt đầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ đề cuối
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tương tác
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConversations.map((conversation: Conversation) => (
                <tr key={conversation._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {conversation.student?.fullName || 'Không có tên'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {conversation.student?.email || 'Không có email'}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {conversation._id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {conversation.startTime ? formatDate(conversation.startTime) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {conversation.lastTopic || 'Chưa có chủ đề'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {conversation.interactions?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedConversation(conversation)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleDeleteChat(conversation._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredConversations.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">Không tìm thấy cuộc trò chuyện nào</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {chatData && chatData.pagination && (chatData.pagination.pages || 0) > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(chatData.pagination?.pages || 1, currentPage + 1))}
              disabled={currentPage === (chatData.pagination?.pages || 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{' '}
                <span className="font-medium">{((currentPage - 1) * (chatData.pagination?.limit || 10)) + 1}</span>
                {' '}-{' '}
                <span className="font-medium">
                  {Math.min(currentPage * (chatData.pagination?.limit || 10), chatData.pagination?.total || 0)}
                </span>
                {' '}trong{' '}
                <span className="font-medium">{chatData.pagination?.total || 0}</span>
                {' '}kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {/* Previous button */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  title="Trang trước"
                  aria-label="Trang trước"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      <span key="dots1" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    );
                  }

                  if (!shouldShow && pageNum === totalPages - 1 && currentPage < totalPages - 3) {
                    return (
                      <span key="dots2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    );
                  }

                  if (!shouldShow) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
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
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Chi tiết cuộc trò chuyện - {selectedConversation.student?.fullName || 'Không có tên'}
              </h3>
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-gray-400 hover:text-gray-600"
                title="Đóng"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Thông tin cơ bản */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Thông tin cuộc trò chuyện</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">ID:</span> {selectedConversation._id}
                  </div>
                  <div>
                    <span className="font-medium">Thời gian bắt đầu:</span> {selectedConversation.startTime ? formatDate(selectedConversation.startTime) : 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Học sinh:</span> {selectedConversation.student?.fullName || 'Không có tên'}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {selectedConversation.student?.email || 'Không có email'}
                  </div>
                  <div>
                    <span className="font-medium">Chủ đề cuối:</span> {selectedConversation.lastTopic || 'Chưa có chủ đề'}
                  </div>
                  <div>
                    <span className="font-medium">Số tương tác:</span> {selectedConversation.interactions?.length || 0}
                  </div>
                </div>
              </div>

              {/* Các tương tác */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Lịch sử tương tác</h4>
                {selectedConversation.interactions && selectedConversation.interactions.length > 0 ? (
                  selectedConversation.interactions.map((interaction, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="text-xs text-gray-500 mb-2">
                        {interaction.timestamp ? formatDate(interaction.timestamp) : 'N/A'}
                      </div>
                      <div className="mb-2">
                        <div className="font-semibold text-gray-700">Câu hỏi:</div>
                        <div className="text-gray-900 bg-gray-50 p-3 rounded">
                          {interaction.query || 'Không có câu hỏi'}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-700">Phản hồi:</div>
                        <div className="text-gray-900 bg-blue-50 p-3 rounded">
                          {interaction.response || 'Không có phản hồi'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-8">Không có tương tác nào</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatManagement;
