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

export const fetchEmployeeById = async (employeeId) => {
  try {
    console.log(`Fetching employee with ID: ${employeeId}`);

    const response = await fetch(`http://localhost/bch_final_project/api/employees/getEmployeeById.php?employee_id=${employeeId}`);
    const data = await response.json();

    console.log("API Response:", data);  // Log the response to verify the structure

    // Check if the response has an 'employee' property
    if (data && data.employee) {
      return data.employee;  // Return the employee data
    } else {
      // If no employee data is found, log the message
      console.error("Employee not found in response:", data);
      throw new Error("Employee not found");
    }
  } catch (error) {
    console.error("Error fetching employee:", error);  // Log the error message
    throw error;  // Rethrow the error
  }
};
export const updateEmployee = async (employeeId, updatedData) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await axios.put(
      `${API_BASE_URL}/employees/update.php`,
      { employee_id: employeeId, ...updatedData }, // Sending employee_id and updated data
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Employee updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update employee:", error.response?.data || error.message);
    throw error;
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No token found. Please log in.');

    console.log("📡 Sending API Request:", employeeData);

    const response = await axios.post(
      `${API_BASE_URL}/employees/create.php`,
      employeeData, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("✅ Employee Created Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to create employee:", error.response?.data || error.message);
    throw error;
  }
};
export const updatePassword = async ({ currentPassword, newPassword, token }) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/employees/change_password.php`,
      { currentPassword, newPassword },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("✅ Password updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to update password:", error.response?.data || error.message);
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
export const createEquipment = async (data) => {
  try {
    console.log("📡 Sending API request for equipment creation:", data);

    const response = await api.post('/equipment/create.php', data, {
      headers: { 'Content-Type': 'multipart/form-data' }, // Ensure correct format
    });

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    throw error;
  }
};


export const updateEquipment = async (data) => {
  try {
    const token = await AsyncStorage.getItem('authToken'); // Get stored token
    if (!token) throw new Error("Auth token is missing. Please log in again.");

    console.log("📡 Sending API request with data:", JSON.stringify(data, null, 2));

    const response = await axios.put(`${API_BASE_URL}/equipment/update.php`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Add Authorization token
      },
    });

    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const archiveEquipment = async (equipmentId) => {
  try {
    const response = await api.put('/equipment/archive.php', { equipment_id: equipmentId });

    console.log("📡 API Response (Archive Equipment):", response.data);

    if (response.data?.message) {
      return response.data;
    } else {
      console.error("❌ Unexpected API response format:", response.data);
      return { message: "Failed to archive equipment." };
    }
  } catch (error) {
    console.error('Failed to archive equipment:', error.response?.data || error.message);
    throw error;
  }
};

export const createSupplier = async (data, image) => {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("contact_name", data.contact_name);
    formData.append("email", data.email);
    formData.append("phone_number", data.phone_number);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("country", data.country);

    if (image) {
      formData.append("image", {
        uri: image.uri,
        type: "image/jpeg", // Ensure correct format
        name: "supplier_image.jpg",
      });
    }

    const response = await axios.post(`${API_BASE_URL}/suppliers/create.php`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to create supplier:", error.response?.data || error.message);
    throw error;
  }
};
export const updateSupplier = async (id, data, image) => {
  try {
    const formData = new FormData();
    formData.append("supplier_id", id);
    formData.append("name", data.name);
    formData.append("contact_name", data.contact_name);
    formData.append("email", data.email);
    formData.append("phone_number", data.phone_number);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("country", data.country);

    // If an image URL is provided, add it to formData
    if (data.image_url) {
      formData.append("image_url", data.image_url);
    }

    // If an image file is selected, append it to formData
    if (image) {
      formData.append("image", {
        uri: image.uri,
        type: "image/jpeg", // Adjust based on file type
        name: "supplier_image.jpg",
      });
    }

    console.log("📡 Sending update request:", formData);

    const response = await axios.post(`${API_BASE_URL}/suppliers/update.php`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(" API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(" API Error:", error.response?.data || error.message);
    throw error;
  }
};


export const archiveSupplier = async (id) => {
  try {
      const response = await axios.put(
          `http://localhost/bch_final_project/api/suppliers/archive.php`,
          { supplier_id: id },  // Ensure key matches PHP expectation
          { headers: { "Content-Type": "application/json" } } // Ensure JSON format
      );
      return response.data;
  } catch (error) {
      console.error("Error archiving supplier:", error.response?.data || error.message);
      throw error;
  }
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


export const archiveTask = async (task_id) => {
  console.log("📡 Sending Archive Request to:", `http://localhost/bch_final_project/api/tasks/archive.php`);

  const response = await fetch(`http://localhost/bch_final_project/api/tasks/archive.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${await AsyncStorage.getItem("authToken")}`,
    },
    body: JSON.stringify({ task_id }), // ✅ Ensure correct JSON format
  });

  const textResponse = await response.text(); // ✅ Read response as text
  console.log("📡 Raw API Response:", textResponse); // ✅ Debug unexpected HTML response

  try {
    return JSON.parse(textResponse); // ✅ Convert to JSON
  } catch (error) {
    throw new Error(`Unexpected response: ${textResponse}`);
  }
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

export const archiveDocument = async (document_id) => {
  console.log("📡 API Request URL:", `http://localhost/api/documents/archive.php`); // ✅ Debugging

  const response = await fetch(`http://localhost/api/documents/archive.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${await AsyncStorage.getItem("authToken")}`, // ✅ Include token if needed
    },
    body: JSON.stringify({ document_id }),
  });

  if (!response.ok) {
    throw new Error(`Server Error: ${response.status}`);
  }

  return response.json();
};

export const createDocument = async (data) => {
  try {
    console.log("📡 Sending API request:", JSON.stringify(data, null, 2));

    const response = await api.post("/documents/create.php", data, {
      headers: { "Content-Type": "application/json" },
    });

    console.log(" API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(" API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const fetchArchivedDocuments = async () => {
  try {
    const response = await api.get('/documents/read_archived.php');
    console.log("📡 API Response (Documents):", response.data); // Debug response

    // Ensure response is an array
    if (Array.isArray(response.data)) {
      return response.data; // ✅ Correctly return the array
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data; // Handle wrapped responses
    } else {
      console.error("❌ Unexpected API response format:", response.data);
      return []; // Prevent app crash
    }
  } catch (error) {
    console.error('Failed to fetch archived documents:', error.response?.data || error.message);
    throw error;
  }
};


export const fetchArchivedEquipment = async () => {
  try {
    const response = await api.get('/equipment/read_archived.php');
    console.log("📡 API Response (Equipment):", response.data);

    // Ensure response is an array
    if (Array.isArray(response.data)) {
      return response.data; // ✅ Return the array directly
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data; // Handle wrapped responses
    } else {
      console.error("❌ Unexpected API response format:", response.data);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch archived equipment:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchArchivedTasks = async () => {
  try {
    const response = await api.get('/tasks/read_archived.php');
    console.log("📡 API Response (Tasks):", response.data);

    // Ensure response is an array
    if (Array.isArray(response.data)) {
      return response.data; // ✅ Correctly return the array
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data; // Handle wrapped responses
    } else {
      console.error("❌ Unexpected API response format:", response.data);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch archived tasks:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchArchivedSuppliers = async () => {
  try {
    const response = await api.get('/suppliers/read_archived.php');
    console.log("📡 API Response (Suppliers):", response.data);

    // Ensure response is an array
    if (Array.isArray(response.data)) {
      return response.data; // ✅ Return the array directly
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data; // Handle wrapped responses
    } else {
      console.error("❌ Unexpected API response format:", response.data);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch archived suppliers:', error.response?.data || error.message);
    throw error;
  }
};



export const fetchArchivedEmployees = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken'); // Retrieve token

    console.log("🔑 Stored Token:", token); // Debugging to check if token exists

    if (!token) {
      console.error("❌ No token found. User must log in.");
      return [];
    }

    const response = await api.get('/employees/read_archived.php', {
      headers: { Authorization: `Bearer ${token}` }, // ✅ Ensure token is included
    });

    console.log("📡 API Response (Employees):", response.data);

    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data?.message) {
      console.error("❌ API returned an error:", response.data.message);
      return [];
    } else {
      console.error("❌ Unexpected API response format:", response.data);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch archived employees:', error.response?.data || error.message);
    throw error;
  }
};


export default api;
