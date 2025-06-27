export interface Test {
  _id: string;
  name: string;
  type: string;
  description: string;
  questions?: Question[];
  results?: TestResult[];
}

export interface Question {
  question: string;
  options?: string[];
  weight: number;
  category: string;
}

export interface TestResult {
  type: string;
  description: string;
  recommendedMajors?: string[];
  recommendedFPTMajors?: string[];
}

export interface TestResponse {
  tests: Test[];
}

// API response type for GET /api/tests
export type GetTestsResponse = Test[];