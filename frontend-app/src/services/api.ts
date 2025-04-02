import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const auth = {
  login: (data: { email: string; password: string }) => api.post('/user/login', data),
  register: (data: { email: string; username: string; password: string }) => api.post('/user/register', data),
  verify: () => api.get('/user/verify'),
};

export const tweets = {
  getAll: (page: number = 1, limit: number = 15) => api.get(`/tweets?page=${page}&limit=${limit}`),
  create: (content: string) => api.post('/tweets', { content }),
  delete: (id: string) => api.delete(`/tweets/${id}`),
  update: (id: string, content: string) => api.patch(`/tweets/${id}`, { content }),
  like: (id: string) => api.post(`/like/toggle/${id}`),
  unlike: (id: string) => api.post(`/like/toggle/${id}`),
  retweet: (id: string) => api.post(`/tweets/${id}/retweet`),
  unretweet: (id: string) => api.delete(`/tweets/${id}/retweet`),
  getMyTweets: (page: number = 1, limit: number = 15) => 
    api.get(`/tweets/me?page=${page}&limit=${limit}`),
  getLikedTweets: (page: number = 1, limit: number = 15) => 
    api.get(`/like/my-likes?page=${page}&limit=${limit}`),
};

export default api; 