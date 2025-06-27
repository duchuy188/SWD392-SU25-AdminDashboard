export interface NotificationRequest {
  userId?: string;
  userIds?: string[];
  title: string;
  body: string;
  data?: {
    type?: string;
    importance?: string;
    [key: string]: any;
  };
}

export interface NotificationResponse {
  success: boolean;
  message: string;
}
