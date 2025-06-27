export interface Student {
  _id: string;
  fullName?: string;
  email?: string;
}

export interface Interaction {
  timestamp: string;
  query?: string;
  response?: string;
}

export interface Conversation {
  _id: string;
  student?: Student;
  startTime: string;
  interactions?: Interaction[];
  lastTopic?: string;
}

export interface ChatResponse {
  conversations?: Conversation[];
  pagination?: {
    total?: number;
    page?: number;
    pages?: number;
    limit?: number;
  };
}