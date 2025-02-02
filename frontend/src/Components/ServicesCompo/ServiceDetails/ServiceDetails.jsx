import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import LocationInput from '../../Map/LocationInput'; 
import './ServiceDetails.css';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [extraPhotos, setExtraPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if the page has already been reloaded for the current ID
    const reloadKey = `reloaded-${id}`;
    const hasReloaded = sessionStorage.getItem(reloadKey);

    if (!hasReloaded) {
      sessionStorage.setItem(reloadKey, 'true');
      window.location.reload(); // Reload the page once
      return;
    }

    const fetchServiceById = async (id) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/service/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching service by ID:', error);
        throw error;
      }
    };

    const fetchExtraPhotos = async (serviceId) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/extraphotos/${serviceId}`);
        return response.data.extraPhotos || [];
      } catch (error) {
        console.error('Error fetching extra photos:', error);
        return []; // Return an empty array in case of an error
      }
    };

    const getService = async () => {
      try {
        const serviceData = await fetchServiceById(id);
        setService(serviceData);
        const extraPhotosData = await fetchExtraPhotos(id);
        setExtraPhotos(extraPhotosData);
      } catch (error) {
        setError('Failed to fetch service details. Please try again.');
        console.error('Error fetching service details:', error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    getService();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="service-details">
      {service && (
        <>
          <div className="service-list-top">
            <div className="service-details-left-side">
              <h1>{service.name}</h1>
              <img
                src={`http://localhost:5000/uploads/mainphotos/${service.mainPhoto}`}
                alt={service.name}
                className="service-main-photo"
              />
            </div>
            <div className="service-details-right-side">
              <p className="location-service">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="google-map-icon" />
                {service.location}
              </p>
              <div className="service-list-display-location">
                <LocationInput
                  initialLocation={service.location}
                  onLocationSelect={(address, position) => {
                    console.log('Selected location:', address, position);
                  }}
                />
              </div>
              <p className="service-details-description-frontend">{service.description}</p>
            </div>
          </div>
          <h2 className="service-details-heading">See more...</h2>
          {extraPhotos.length > 0 ? (
            <div className="extra-photos-bottom-part-service-details">
              <div className="extra-photos-grid">
                {extraPhotos.map((photo, index) => (
                  <div key={index} className="extra-photos-bottom-part-service-details-secnd">
                    <img
                      src={`http://localhost:5000/uploads/extrapics/${photo}`}
                      alt={`Extra ${index}`}
                      style={{ width: '100%', height: 'auto', margin: '5px' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No extra photos available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ServiceDetails;
