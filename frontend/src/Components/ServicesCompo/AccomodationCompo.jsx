// src/components/AccommodationCompo.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchServicesByType } from './Api';

import './CommonServices.css';

const AccommodationCompo = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await fetchServicesByType('accommodation');
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
    <div>
      <h1>Accommodation Services</h1>
      {services.length > 0 ? (
        <div className="services-list">
          {services.map((service) => (
            <div
              key={service._id}
              className="service-item"
              onClick={() => handleServiceClick(service._id)}
              style={{ cursor: 'pointer' }} // Optional: Add cursor pointer for better UX //
            >
              <img
                src={`http://localhost:5000/uploads/mainphotos/${service.mainPhoto}`}
                alt={service.name}
                className="service-main-photo"
              />
              <h2>{service.name}</h2>
              <p>Location: {service.location}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No accommodation services available.</p>
      )}
    </div>
  );
};

export default AccommodationCompo;


