import api from './axiosConfig';

export const eventApi = {
  getEvents: () => api.get('/events'),
  createEvent: (data) => api.post('/events', data), // New
  addExpense: (eventId, data) => api.post(`/events/${eventId}/expenses`, data), // New
  getDebts: (eventId) => api.get(`/events/${eventId}/debts`),
  getPendingSettlements: (eventId) => api.get(`/events/${eventId}/settlements/pending`),
  initiatePayment: (eventId, payeeId, amount) => 
    api.post(`/events/${eventId}/settle`, null, { params: { payeeId, amount } }),
  confirmPayment: (settlementId) => 
    api.put(`/events/settlements/${settlementId}/confirm`)
};