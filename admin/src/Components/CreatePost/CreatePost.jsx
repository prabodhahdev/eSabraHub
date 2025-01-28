import React, { useState } from 'react';
import axios from 'axios';
import ExtraPosts from '../ExtraPosts/ExtraPosts';

const serviceTypes = [
  'accommodation',
  'food',
  'medical',
  'transport',
  'attractiveplaces'
];

const CreatePost = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    serviceType: ''
  });
  const [mainPhoto, setMainPhoto] = useState(null);
  const [mainPhotoUrl, setMainPhotoUrl] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [showExtraPhotosForm, setShowExtraPhotosForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'mainPhoto') {
      setMainPhoto(files[0]);
      setMainPhotoUrl(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append('name', formData.name);
    data.append('location', formData.location);
    data.append('description', formData.description);
    data.append('serviceType', formData.serviceType);
    if (mainPhoto) {
      data.append('mainPhoto', mainPhoto);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/service/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { service } = response.data;
      if (service && service._id) {
        setServiceDetails(service);
        setShowExtraPhotosForm(true);
        alert('Service created successfully!');
        fetchServiceDetails(service._id); // Fetch service details to get the photo URL
      } else {
        alert('Error creating service. Please try again.');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      alert('Error creating service. Please try again.');
    }
  };

  const fetchServiceDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/service/${id}`);
      const service = response.data;
      setServiceDetails(service); // Store the service details
      if (service && service.mainPhoto) {
        setMainPhotoUrl(`http://localhost:5000/uploads/mainphotos/${service.mainPhoto}`);
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
    }
  };

  return (
    <div>
      <h1>Create New Service</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="serviceType">Service Type:</label>
          <select
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
          >
            <option value="">Select Service Type</option>
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="mainPhoto">Main Photo:</label>
          <input
            type="file"
            id="mainPhoto"
            name="mainPhoto"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Create Service</button>
      </form>

      {mainPhotoUrl && !serviceDetails && (
        <div style={{ marginTop: '20px' }}>
          <h2>Uploaded Main Photo Preview:</h2>
          <img src={mainPhotoUrl} alt="Main" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}

      {serviceDetails && (
        <div style={{ marginTop: '20px' }}>
          <h2>Service Details:</h2>
          <p><strong>Name:</strong> {serviceDetails.name}</p>
          <p><strong>Location:</strong> {serviceDetails.location}</p>
          <p><strong>Description:</strong> {serviceDetails.description}</p>
          <p><strong>Service Type:</strong> {serviceDetails.serviceType}</p>
          {serviceDetails.mainPhoto && (
            <div>
              <h3>Main Photo:</h3>
              <img src={`http://localhost:5000/uploads/mainphotos/${serviceDetails.mainPhoto}`} alt="Main" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          )}
        </div>
      )}

      {showExtraPhotosForm && serviceDetails && (
        <ExtraPosts serviceId={serviceDetails._id} />
      )}
    </div>
  );
};

export default CreatePost;
