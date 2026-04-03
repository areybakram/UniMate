import axios from 'axios';
import { Platform } from 'react-native';

// Use the specified backend IP for local network communication
const BASE_URL = 'http://172.16.7.33:5000/api';


const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
