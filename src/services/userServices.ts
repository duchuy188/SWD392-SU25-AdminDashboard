import axiosInstance from "./axiosInstance"; 


export const userServices = {

  login: (email: string, password: string) => {
    return axiosInstance.post('/auth/login', { email, password });
  },
  logout: () => {
    return axiosInstance.post('/auth/logout');
  },
  getProfile: () => {
    return axiosInstance.get('/auth/profile');
  },

};