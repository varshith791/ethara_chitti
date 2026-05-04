import api from './api';

export const addComment = (payload) => api.post('/comments', payload).then((res) => res.data);
export const fetchComments = (taskId) => api.get(`/comments/task/${taskId}`).then((res) => res.data);
