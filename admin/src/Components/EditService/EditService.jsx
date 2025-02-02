import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditService.css';
import LocationInput from '../Map/LocationInput';
import { toast } from 'react-toastify';

const EditService = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [service, setService] = useState({
    name: '',
    location: '',
    description: '',
    serviceType: '',
    mainPhoto: null,
    extraPhotos: []
  });
  const [file, setFile] = useState(null);
  const [extraFiles, setExtraFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/service/${id}`);
        setService(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service:', error);
      }
    };

    fetchService();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevService) => ({ ...prevService, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleExtraFileChange = (e) => {
    setExtraFiles([...e.target.files]);
  };

  // Function to handle location selection
  const handleLocationSelect = (location) => {
    setService((prevService) => ({ ...prevService, location }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    formData.append('name', service.name);
    formData.append('location', service.location);
    formData.append('description', service.description);
    formData.append('serviceType', service.serviceType);
    if (file) {
      formData.append('mainPhoto', file);
    }

    try {
      await axios.put(`http://localhost:5000/api/service/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Services updated successfully")
      
      if (extraFiles.length > 0) {
        const extraPhotosData = new FormData();
        extraFiles.forEach((file) => {
          extraPhotosData.append('extraPhotos', file);
        });

        console.log('Extra Photos Data:', extraPhotosData); // Log the FormData content

        await axios.put(`http://localhost:5000/api/extraphotos/${id}`, extraPhotosData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Photos Updated Successfully")
      }
      
      switch (service.serviceType) {
        case 'accommodation':
          navigate('/accommodation');
          break;
        case 'transport':
          navigate('/transport');
          break;
        case 'food':
          navigate('/food-shop');
          break;
        case 'medical':
          navigate('/medical-centers');
          break;
        case 'attractiveplaces':
          navigate('/attractive-places');
          break;
        default:
          navigate('/');
          break;
      }
    } catch (error) {
      console.error('Error updating service:', error.response ? error.response.data : error);
      toast.error(error)
    }
};


  if (loading) return <p>Loading...</p>;
  return (
    <div className="edit-service-container">
      <h2>Edit Service</h2>
      <form className="edit-service-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="edit-service-label">Name:</label>
          <input
            className="edit-service-input" 
            type="text"
            name="name"
            value={service.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="edit-service-label">Location:</label>
          <LocationInput 
            onLocationSelect={handleLocationSelect} 
            currentLocation={service.location} // Pass current location to the component
          />
        </div>
        <div className="form-group">
          <label className="edit-service-label">Description:</label>
          <textarea
            className="edit-service-textarea" 
            name="description"
            value={service.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="edit-service-label">Service Type:</label>
          <input
            className="edit-service-input" 
            type="text"
            name="serviceType"
            value={service.serviceType}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="edit-service-label">Main Photo:</label>
          <input
            className="edit-service-input" 
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <label className="edit-service-label">Extra Photos:</label>
          <input
            className="edit-service-input" 
            type="file"
            accept="image/*"
            multiple
            onChange={handleExtraFileChange}
          />
        </div>
        <button className="edit-service-button" type="submit">Update Service</button> 
      </form>
    </div>
  );
};

export default EditService;
