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

  // GET /chat/all - Lấy tất cả lịch sử chat (chỉ dành cho admin)
  getAllChats: (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    
    return axiosInstance.get(`/chat/all${params.toString() ? `?${params.toString()}` : ''}`);
  },


  // DELETE /api/chat/{chatId} - Xóa cuộc trò chuyện theo ID
  deleteChatById: (chatId: string) => {
    return axiosInstance.delete(`/api/chat/${chatId}`);
  }
};