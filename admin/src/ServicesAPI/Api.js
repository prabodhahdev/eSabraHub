import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Fetch services by type
export const fetchServicesByType = async (postType) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/service/by-type`, {
      params: { postType },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Fetch a service by ID
export const fetchServiceById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/service/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    throw error;
  }
};

// Create a new service with main photo
export const createService = async (serviceData) => {
  try {
    const formData = new FormData();
    for (const key in serviceData) {
      formData.append(key, serviceData[key]);
    }
    const response = await axios.post(`${API_BASE_URL}/service/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

// Update an existing service with main photo
export const updateService = async (id, serviceData) => {
  try {
    const formData = new FormData();
    for (const key in serviceData) {
      if (serviceData.hasOwnProperty(key)) {
        // If serviceData[key] is an array (e.g., files), handle appropriately
        if (Array.isArray(serviceData[key])) {
          serviceData[key].forEach(item => formData.append(key, item));
        } else {
          formData.append(key, serviceData[key]);
        }
      }
    }

    const response = await axios.put(`${API_BASE_URL}/service/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

// Delete a service by ID
export const deleteService = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/service/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

// Upload extra photos for a service
export const uploadExtraPhotos = async (serviceId, extraPhotos) => {
  try {
    const formData = new FormData();
    for (let i = 0; i < extraPhotos.length; i++) {
      formData.append('extraPhotos', extraPhotos[i]);
    }
    const response = await axios.post(`${API_BASE_URL}/service/extra/${serviceId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading extra photos:', error);
    throw error;
  }
};

// Get extra photos for a service
export const getExtraPhotos = async (serviceId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/service/extra/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching extra photos:', error);
    throw error;
  }
};

// Update extra photos for a service
export const updateExtraPhotos = async (serviceId, extraPhotos) => {
  try {
    const formData = new FormData();
    for (let i = 0; i < extraPhotos.length; i++) {
      formData.append('extraPhotos', extraPhotos[i]);
    }
    const response = await axios.put(`${API_BASE_URL}/service/extra/${serviceId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating extra photos:', error);
    throw error;
  }
};

// Delete extra photos for a service
export const deleteExtraPhotos = async (serviceId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/service/extra/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting extra photos:', error);
    throw error;
  }
};
