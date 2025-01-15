import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Authentication
export const login = async (email, password) => {
  try {
    console.log('Sending login request:', { email, password });
    const response = await api.post('/employees/login.php', { email, password });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

// Fetch Employees
export const fetchEmployees = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await axios.get(`${API_BASE_URL}/employees/read.php`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;

    // Handle wrapped response
    if (data && Array.isArray(data.data)) {
      return data.data; // Extract array from "data"
    } else if (Array.isArray(data)) {
      return data; // If it's already an array
    } else {
      throw new Error('API response is not an array.');
    }
  } catch (error) {
    console.error('Failed to fetch employees:', error.response?.data || error.message);
    throw error;
  }
};

// Fetch Equipment Data
export const fetchEquipment = async () => {
  try {
    const response = await api.get('/equipment/read.php');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch equipment:', error.response?.data || error.message);
    throw error;
  }
};

// Fetch Suppliers
export const fetchSuppliers = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await axios.get(`${API_BASE_URL}/suppliers/read.php`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch suppliers:', error.response?.data || error.message);
    throw error;
  }
};

// Create Equipment
export const createEquipment = async (data) => {
  return await api.post('/equipment/create.php', data);
};

// Update Equipment
export const updateEquipment = async (id, data) => {
  return await api.put(`/equipment/update.php?id=${id}`, data);
};

export const archiveEquipment = async (id) => {
  try {
    const response = await api.put(`/equipment/archive.php`, { equipment_id: id });
    return response.data;
  } catch (error) {
    console.error('Failed to archive equipment:', error.response?.data || error.message);
    throw error;
  }
};



// Create Supplier
export const createSupplier = async (data) => {
  return await api.post('/suppliers/create.php', data);
};

// Update Supplier
export const updateSupplier = async (id, data) => {
  return await api.put(`/suppliers/update.php?id=${id}`, data);
};

// Archive Supplier
export const archiveSupplier = async (id) => {
  return await api.put(`/suppliers/archive.php?id=${id}`);
};

// Fetch Tasks
export const fetchTasks = async () => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) throw new Error('No token found. Please log in.');

  const response = await axios.get(`${API_BASE_URL}/tasks/read.php`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Create Task
export const createTask = async (data) => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) throw new Error('No token found. Please log in.');

  const response = await axios.post(`${API_BASE_URL}/tasks/create.php`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const updateTask = async (data) => {
  try {
    const response = await api.put('/tasks/update.php', data);
    return response.data;
  } catch (error) {
    console.error('Failed to update task:', error.response?.data || error.message);
    throw error;
  }
};


// Archive Task
export const archiveTask = async (id) => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) throw new Error('No token found. Please log in.');

  const response = await axios.put(`${API_BASE_URL}/tasks/archive.php?id=${id}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const fetchDocuments = async () => {
  try {
    const response = await api.get('/documents/read.php');
    return response.data; // Returns the documents data
  } catch (error) {
    console.error('Failed to fetch documents:', error.response?.data || error.message);
    throw error;
  }
};

export const updateDocument = async (data) => {
  return await api.put(`/documents/update.php`, data);
};

export const archiveDocument = async (id) => {
  return await api.put(`/documents/archive.php?id=${id}`);
};


export default api;
