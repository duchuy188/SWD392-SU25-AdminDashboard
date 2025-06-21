export interface User {
    _id: string;
    email: string;
    fullName: string;
    role: 'student' | 'admin';
    profilePicture: string | null;
    isActive: boolean;
    createdAt: string; // ISO date string
    phone: string | null;
    address: string | null;
    status: string;
    googleId?: string;
    __v?: number;
  }

export interface AcademicResult {
  subject: string;
  score: number;
  semester: number;
}

export interface TestResult {
  test: string;
  score: number;
  date: string;
}

export interface StudentInfo {
  _id: string;
  userId: string;
  grade?: number;
  academicResults: AcademicResult[];
  interests: string[];
  personalityType?: string;
  preferredFPTMajors: string[];
  testResults: TestResult[];
  __v?: number;
}

export interface UserDetailResponse {
  user: User;
  studentInfo: StudentInfo;
}