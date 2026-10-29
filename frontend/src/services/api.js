import axios from 'axios';

// Automatically resolve API base: prefer env var, otherwise use relative '/api/v1'
// so it works seamlessly with Vite dev proxy and reverse proxies without CORS or host mismatch
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return '/api/v1';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Centralized error interceptor with friendly offline fallback message
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Request timed out' : null) ||
      error.message ||
      'Server unreachable, using local persistent data';
    console.warn('API Notice:', errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
);

export default apiClient;
