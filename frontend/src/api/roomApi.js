import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: `${API_BASE}/api`,
    headers: { 'Content-Type': 'application/json' },
});

// Rooms
export const getStats = () => api.get('/rooms/stats');
export const getRooms = (params) => api.get('/rooms', { params });
export const getRoomDetail = (id) => api.get(`/rooms/${id}`);
export const createRoom = (data) => api.post('/rooms', data);
export const allocateRoom = (data) => api.post('/rooms/allocate', data);
export const resetRoom = (id) => api.post(`/rooms/${id}/reset`);
export const deleteRoom = (id) => api.delete(`/rooms/${id}`);
export const exportRoomsCSV = () => `${API_BASE}/api/rooms/export`;

// Students
export const getStudents = (params) => api.get('/students', { params });
export const getStudentsByRoom = (roomId) => api.get(`/students/room/${roomId}`);
export const allocateStudent = (data) => api.post('/students/allocate', data);
export const deallocateStudent = (id) => api.post(`/students/${id}/deallocate`);
export const exportStudentsCSV = () => `${API_BASE}/api/students/export`;

// Fees
export const getFees = (params) => api.get('/fees', { params });
export const getFeeStats = () => api.get('/fees/stats');
export const createFee = (data) => api.post('/fees', data);
export const markFeePaid = (id) => api.patch(`/fees/${id}/pay`);
export const deleteFee = (id) => api.delete(`/fees/${id}`);

// Activity
export const getActivityLogs = (limit) => api.get('/activity', { params: { limit } });

export default api;
