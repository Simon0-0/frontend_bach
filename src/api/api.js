import axios from 'axios';


const API_BASE_URL = 'http://localhost/bch_final_project/api';

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the Authorization token dynamically
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const login = async (email, password) => {
    try {
      console.log('Sending login request:', { email, password });
      const response = await api.post('/employees/login.php', { email, password });
      console.log('Login response:', response.data); // Debug response
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message); // Debug error
      throw error; 
    }
  };
  
// Fetch Equipment Data
export const fetchEquipment = async () => {
  try {
    const response = await api.get('/equipment/read.php');
    return response.data; // Returns the equipment data
  } catch (error) {
    console.error('Failed to fetch equipment:', error.response?.data || error.message);
    throw error; // Re-throw the error for the caller to handle
  }
};

// Other API calls can be added here...
export const createEquipment = async (data) => {
  return await api.post('/equipment/create.php', data);
};

export const updateEquipment = async (id, data) => {
  return await api.put(`/equipment/update.php?id=${id}`, data);
};

export const archiveEquipment = async (id) => {
  return await api.put(`/equipment/archive.php?id=${id}`);
};


export default api;
