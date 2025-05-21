import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const signup = (userData) => api.post('/auth/signup', userData);
export const login = (credentials) => api.post('/auth/login', credentials);

export const createSoftware = (softwareData) => api.post('/software', softwareData);
export const getAllSoftware = () => api.get('/software');

export const submitAccessRequest = (requestData) => api.post('/requests', requestData);
export const getMyRequests = () => api.get('/requests/my-requests');
export const getPendingRequests = () => api.get('/requests/pending');
export const updateRequestStatus = (requestId, statusData) => api.patch(`/requests/${requestId}`, statusData);
export default api;
