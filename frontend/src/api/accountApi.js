import api from './axiosConfig';

export const accountApi = {
  getAll:  ()           => api.get('/accounts'),
  create:  (data)       => api.post('/accounts', data),
  update:  (id, data)   => api.put(`/accounts/${id}`, data),
  delete:  (id)         => api.delete(`/accounts/${id}`),
};