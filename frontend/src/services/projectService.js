import api from './api';

export const fetchProjects = () => api.get('/projects').then((res) => res.data);
export const createProject = (payload) => api.post('/projects', payload).then((res) => res.data);
export const addProjectMember = (projectId, payload) => api.put(`/projects/${projectId}/members`, payload).then((res) => res.data);
export const removeProjectMember = (projectId, payload) => api.delete(`/projects/${projectId}/members`, { data: payload }).then((res) => res.data);
