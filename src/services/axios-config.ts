import axios from 'axios';

// Create simple axios instance with basic configuration
const apiClient = axios.create({
  timeout: 10000, // 10 second default timeout
});

export default apiClient;
