import axiosInstance from "./axiosInstance";

export interface CreateUserRequest {
  email: string;
  fullName: string;
  password: string;
  phone: string;
  address: string;
  role: 'student' | 'admin';
}

// Lấy danh sách người dùng (có filter, sort, phân trang cho admin)
export const getUsers = (params?: {
  search?: string;
  role?: 'student' | 'admin';
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) => axiosInstance.get("/admin/users", { params });

// Tạo người dùng mới
export const createUser = (data: CreateUserRequest) => axiosInstance.post("/admin/users", data);

// Lấy thông tin chi tiết của một người dùng
export const getUserById = (id: string) => axiosInstance.get(`/admin/users/${id}`);

// Cập nhật thông tin người dùng
export const updateUser = (id: string , data: any) => axiosInstance.put(`/admin/users/${id}`, data);

// Ban hoặc mở ban tài khoản người dùng
export const updateUserStatus = (id: string, isActive: boolean) => 
  axiosInstance.put(`/admin/users/${id}/status`, { isActive });
