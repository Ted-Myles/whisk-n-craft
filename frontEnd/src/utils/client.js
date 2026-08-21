import axios from 'axios';

// Vite: import.meta.env.VITE_API_URL — set VITE_API_URL=http://localhost:5000/api in .env
// Create React App: swap for process.env.REACT_APP_API_URL instead.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Public-facing site only ever reads published data — no auth token needed.
// (The admin dashboard is a separate app with its own client + token handling.)
const apiClient = axios.create({ baseURL });

export default apiClient;