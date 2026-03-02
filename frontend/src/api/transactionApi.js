import api from './axiosConfig';

export const transactionApi = {
  getAll: (params) => api.get('/transactions', { params }),
  create: (data)   => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id)     => api.delete(`/transactions/${id}`),
  scanReceipt: (formData) => api.post('/transactions/scan-receipt', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
}),
search: (keyword, page = 0) => api.get('/transactions/search', {
    params: { keyword, page, size: 20 }
}),
exportCsv: (from, to) => api.get('/transactions/export/csv', {
    params: { from, to },
    responseType: 'blob',  // Important — tells Axios to treat response as a file
}),
getRecurring: () => api.get('/transactions/recurring'),
importCsv: (formData) => api.post('/transactions/import/csv', formData, {
    headers: { 'Content-Type': undefined },
}),
};