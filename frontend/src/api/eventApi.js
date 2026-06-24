import api from './axiosConfig';

export const eventApi = {
  getEvents: () => api.get('/events'),
  createEvent: (data) => api.post('/events', data), // New
  addExpense: (eventId, data) => api.post(`/events/${eventId}/expenses`, data), // New
  getDebts: (eventId) => api.get(`/events/${eventId}/debts`),
  getPendingSettlements: (eventId) => api.get(`/events/${eventId}/settlements/pending`),
 // ---> UPDATED: Secure Account Parameter added <---
  initiatePayment: (eventId, payeeId, amount, payerAccountId) => 
    api.post(`/events/${eventId}/settle`, null, { params: { payeeId, amount, payerAccountId } }),
  confirmPayment: (settlementId) => 
    api.put(`/events/settlements/${settlementId}/confirm`),
  inviteFriend: (eventId, email) => api.post(`/events/${eventId}/invite`, null, { params: { email } }),
  // Add these below your existing endpoints:
  getInvites: () => api.get('/events/invites'),
  respondToInvite: (inviteId, accept) => api.post(`/events/invites/${inviteId}/respond`, null, { params: { accept } }),
  getEventExpenses: (eventId) => api.get(`/events/${eventId}/expenses`)
};