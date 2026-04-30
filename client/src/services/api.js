const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getSession = () => {
  const raw = localStorage.getItem('team-task-session');
  return raw ? JSON.parse(raw) : null;
};

const request = async (path, options = {}) => {
  const session = getSession();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const api = {
  signup: (payload) =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getUsers: () => request('/users'),
  getProjects: () => request('/projects'),
  createProject: (payload) =>
    request('/projects', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updateProjectMembers: (id, payload) =>
    request(`/projects/${id}/members`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  getTasks: (projectId) => request(`/tasks${projectId ? `?projectId=${projectId}` : ''}`),
  createTask: (payload) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updateTaskStatus: (id, status) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
};
