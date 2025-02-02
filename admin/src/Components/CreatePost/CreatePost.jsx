import React, { useState } from 'react';
import axios from 'axios';
import ExtraPosts from '../ExtraPosts/ExtraPosts';
import LocationInput from '../Map/LocationInput'; 
import './CreatePost.css';
import camera from '../../Assets/cam.webp';
import { toast } from 'react-toastify';

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
    const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
    const [mainPhoto, setMainPhoto] = useState(null);
    const [mainPhotoUrl, setMainPhotoUrl] = useState(camera);
    const [serviceDetails, setServiceDetails] = useState(null);
    const [showExtraPhotosForm, setShowExtraPhotosForm] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { files } = e.target;
        if (files.length > 0) {
            setMainPhoto(files[0]);
            setMainPhotoUrl(URL.createObjectURL(files[0]));
        }
    };

    const handleLocationSelect = (formattedAddress, { lat, lng }) => {
        setFormData({ ...formData, location: formattedAddress });
        setCoordinates({ lat, lng });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
    
        data.append('name', formData.name);
        data.append('location', formData.location);
        data.append('description', formData.description);
        data.append('serviceType', formData.serviceType);
        data.append('coordinates', JSON.stringify(coordinates));
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
                
                // Show success toast instead of alert
                toast.success('Service created successfully!');
            } else {
                // Show error toast instead of alert
                toast.error('Error creating service. Please try again.');
            }
           
        } catch (error) {
            console.error('Error creating service:', error);
    
            // Show error toast for any exceptions
            toast.error('Error creating service. Please try again.');
        }
        finally{
            setFormData({
                name: '',
                location: '',
                description: '',
                serviceType: ''}
                
        )
        setMainPhotoUrl(camera)
        }
    };
    

    return (
        <div className="create-post-container">
            <h1 className="create-post-title">Create New Service</h1>
            <form className="create-post-form" onSubmit={handleSubmit}>
                <div>
                    <label className="create-post-label" htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="create-post-input"
                        required
                    />
                </div>
                <div>
                    <label className="create-post-label" htmlFor="location">Location:</label>
                    <LocationInput onLocationSelect={handleLocationSelect} />
                </div>
                <div>
                    <label className="create-post-label" htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="create-post-textarea"
                        required
                    ></textarea>
                </div>
                <div>
                    <label className="create-post-label" htmlFor="serviceType">Service Type:</label>
                    <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="create-post-select"
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
                <div className="photo-upload-area">
                    <label className="create-post-label" htmlFor="mainPhoto">
                        Upload Main Photo
                    </label>
                    <input
                        type="file"
                        id="mainPhoto"
                        name="mainPhoto"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="create-post-input file-input"
                        style={{ display: 'none' }}
                    />
                    <div className="photo-preview" onClick={() => document.getElementById('mainPhoto').click()}>
                        <img src={mainPhotoUrl} alt="Main" className="create-post-photo-preview" />
                    </div>
                </div>
                <button type="submit" className="create-post-button">Create Service</button>
            </form>

            {serviceDetails && showExtraPhotosForm && (
                <ExtraPosts serviceId={serviceDetails._id} />
            )}
        </div>
    );
};

export default CreatePost;
