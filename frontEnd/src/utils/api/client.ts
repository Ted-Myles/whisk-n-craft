import axios from 'axios';

const baseURL: string = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({ baseURL });

// Attach the member's session token, if logged in — needed for actions
// like submitting a review. Public GET requests ignore it harmlessly.
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('bp_member_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If the token is invalid/expired, the backend returns 401 — clear it so
// the app doesn't keep retrying with a stale token.
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('bp_member_token');
        }
        return Promise.reject(error);
    }
);

export default apiClient;