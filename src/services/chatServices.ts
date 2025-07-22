import axiosInstance from "./axiosInstance";

export const chatServices = {

  // POST /api/chat/new - Tạo đoạn chat mới
  createNewChat: () => {
    return axiosInstance.post('/chat/new');
  },

  // GET /chat/history - Lấy lịch sử chat của người dùng hiện tại
  getChatHistory: () => {
    return axiosInstance.get('/chat/history');
  },

  // GET /chat/history/{studentId} - Lấy lịch sử chat của học sinh theo ID (chỉ dành cho admin)
  getChatHistoryByStudentId: (studentId: string) => {
    return axiosInstance.get(`/chat/history/${studentId}`);
  },

  // GET /api/chat/all - Lấy tất cả lịch sử chat (chỉ dành cho admin)
  getAllChats: (page?: number, limit?: number, userId?: string, keyword?: string, startDate?: string, endDate?: string, hasImage?: boolean) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (userId) params.append('userId', userId);
    if (keyword) params.append('keyword', keyword);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (hasImage !== undefined) params.append('hasImage', hasImage.toString());
    
    return axiosInstance.get(`/chat/admin/conversations${params.toString() ? `?${params.toString()}` : ''}`);
  },


  // DELETE /api/chat/{chatId} - Xóa cuộc trò chuyện theo ID
  deleteChatById: (chatId: string) => {
    return axiosInstance.delete(`/api/chat/${chatId}`);
  }
};