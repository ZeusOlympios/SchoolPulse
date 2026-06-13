import axios from 'axios';

const API_BASE = 'http://localhost:5170/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Learners
export const learnerService = {
  getAll: () => api.get('/learner'),
  getById: (id) => api.get(`/learner/${id}`),
  getByGrade: (grade) => api.get(`/learner/grade/${grade}`),
  search: (name) => api.get(`/learner/search?name=${name}`),
  getStats: () => api.get('/learner/stats'),
  create: (data) => api.post('/learner', data),
  update: (id, data) => api.put(`/learner/${id}`, data),
  delete: (id) => api.delete(`/learner/${id}`),
};

// Staff
export const staffService = {
  getAll: () => api.get('/staff'),
  getById: (id) => api.get(`/staff/${id}`),
  getByType: (type) => api.get(`/staff/type/${type}`),
  search: (name) => api.get(`/staff/search?name=${name}`),
  getStats: () => api.get('/staff/stats'),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
};

// Attendance
export const attendanceService = {
  getAll: () => api.get('/attendance'),
  getByDate: (date) => api.get(`/attendance/date/${date}`),
  getByLearner: (id) => api.get(`/attendance/learner/${id}`),
  getByStaff: (id) => api.get(`/attendance/staff/${id}`),
  getStats: () => api.get('/attendance/stats'),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`),
};

// Results
export const resultService = {
  getAll: () => api.get('/result'),
  getById: (id) => api.get(`/result/${id}`),
  getByLearner: (id) => api.get(`/result/learner/${id}`),
  getStats: () => api.get('/result/stats'),
  create: (data) => api.post('/result', data),
  update: (id, data) => api.put(`/result/${id}`, data),
  delete: (id) => api.delete(`/result/${id}`),
};

// Infrastructure
export const infrastructureService = {
  getAll: () => api.get('/infrastructure'),
  getById: (id) => api.get(`/infrastructure/${id}`),
  getByType: (type) => api.get(`/infrastructure/type/${type}`),
  getMaintenance: () => api.get('/infrastructure/maintenance'),
  getStats: () => api.get('/infrastructure/stats'),
  create: (data) => api.post('/infrastructure', data),
  update: (id, data) => api.put(`/infrastructure/${id}`, data),
  delete: (id) => api.delete(`/infrastructure/${id}`),
};

// Textbooks
export const textbookService = {
  getAll: () => api.get('/textbookmaterial'),
  getById: (id) => api.get(`/textbookmaterial/${id}`),
  getByGrade: (grade) => api.get(`/textbookmaterial/grade/${grade}`),
  getLowStock: () => api.get('/textbookmaterial/low-stock'),
  getStats: () => api.get('/textbookmaterial/stats'),
  create: (data) => api.post('/textbookmaterial', data),
  update: (id, data) => api.put(`/textbookmaterial/${id}`, data),
  delete: (id) => api.delete(`/textbookmaterial/${id}`),
};

export default api;