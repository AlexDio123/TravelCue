import axios from 'axios';

// Create axios instance with default configuration
const apiClient = axios.create({
  timeout: 10000, // 10 second default timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Log request for debugging
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Enhanced error logging
    if (error.response) {
      // Server responded with error status
      console.error(`❌ API Error ${error.response.status}:`, {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
        message: error.message
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('❌ Network Error:', {
        url: error.config?.url,
        message: 'No response received from server',
        timeout: error.code === 'ECONNABORTED' ? 'Request timeout' : 'Unknown'
      });
    } else {
      // Something else happened
      console.error('❌ Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
