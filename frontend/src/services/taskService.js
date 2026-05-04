import api from './api';

export const fetchTasks = (params) => api.get('/tasks', { params }).then((res) => res.data);
export const fetchTask = (id) => api.get(`/tasks/${id}`).then((res) => res.data);
export const createTask = (payload) => api.post('/tasks', payload).then((res) => res.data);
export const updateTask = (id, payload) => api.put(`/tasks/${id}`, payload).then((res) => res.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then((res) => res.data);
export const fetchTaskActivity = (id) => api.get(`/tasks/${id}/activity`).then((res) => res.data);
