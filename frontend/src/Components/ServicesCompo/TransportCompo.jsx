// src/components/AccommodationCompo.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { fetchServicesByType } from './Api';
import './CommonServices.css';

const TransportCompo = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await fetchServicesByType('transport');
            setServices(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, []);

  const handleServiceClick = (id) => {
    navigate(`/details/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='frontend-services'>
      <h1>Transport Services</h1>
      {services.length > 0 ? (
          <div className="services-list">
          {services.map((service) => (
            <div className='service-list-gallery'>
              <div
              key={service._id}
              className="service-item"
              onClick={() => handleServiceClick(service._id)}
              style={{ cursor: 'pointer' }} 
            >
              <img
                src={`http://localhost:5000/uploads/mainphotos/${service.mainPhoto}`}
                alt={service.name}
                className="service-main-photo"
              />
              <h2>{service.name}</h2>
              < p className='services-location-icon-for-all'> <FontAwesomeIcon icon={faMapMarkerAlt} /> {service.location}</p>
            </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No accommodation services available.</p>
      )}
    </div>
  );
};

export default TransportCompo;
