export interface User {
    id: string;
    email: string;
    fullName: string;
    role: "student" | "admin" | "other"; // Thêm các role khác nếu có
    profilePicture: string;
    isActive: boolean;
    createdAt: string; // ISO date string
  }