import axiosInstance from './axiosInstance';
import { Test, GetTestsResponse } from '../types/Test';

const testServices = {
  // GET /api/tests - Lấy danh sách tất cả bài test
  getAllTests: async (): Promise<Test[]> => {
    const response = await axiosInstance.get<GetTestsResponse>('/tests');
    return response.data;
  },

  // GET /api/tests/:id - Lấy chi tiết một bài test
  getTestById: async (id: string): Promise<Test> => {
    const response = await axiosInstance.get<Test>(`tests/${id}`);
    return response.data;
  },

};

export default testServices;