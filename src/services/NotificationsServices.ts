import axiosInstance from './axiosInstance';
import { NotificationRequest, NotificationResponse } from '../types/Notifications';

export const NotificationsServices = {
  // Send notification to a single user
  sendToUser: async (data: NotificationRequest): Promise<NotificationResponse> => {
    const response = await axiosInstance.post('/notifications/send-to-user', data);
    return response.data;
  },

  // Send notification to multiple users
  sendToMany: async (data: NotificationRequest): Promise<NotificationResponse> => {
    const response = await axiosInstance.post('/notifications/send-to-many', data);
    return response.data;
  },

  // Send notification to all users
  sendToAll: async (data: NotificationRequest): Promise<NotificationResponse> => {
    const response = await axiosInstance.post('/notifications/send-to-all', data);
    return response.data;
  }
};
