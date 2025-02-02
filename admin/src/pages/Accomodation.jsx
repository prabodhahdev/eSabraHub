import React, { useEffect, useState } from 'react';
import { fetchServicesByType, deleteService } from '../../../admin/src/ServicesAPI/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './ServicesAdmin.css'; // Import CSS file
import axios from 'axios';
import { toast } from 'react-toastify';

function Accommodation() {
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

    const handleDelete = async (id) => {
        try {
            await deleteService(id);
            setServices((prevServices) => prevServices.filter(service => service._id !== id));
            toast.success("Deleted Succussfully")
        } catch (error) {
            console.error('Error deleting service:', error);
            setError('Failed to delete service. Please try again.');
            toast.error('Failed to delete service. Please try again.')
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='table'>
            <h1 >Accommodation Services</h1>
            {services.length > 0 ? (
                <table className="servicesTable">
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}>Main Image</th>
                            <th style={{ width: '10%' }}>Extra Images</th>
                            <th style={{ width: '10%' }}>Name</th>
                            <th style={{ width: '12%' }}>Location</th>
                            <th style={{ width: '28%' }}>Description</th>
                            <th style={{ width: '5%' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service._id}>
                                <td>
                                    <img
                                        src={`http://localhost:5000/uploads/mainphotos/${service.mainPhoto}`}
                                        alt={service.name}
                                        className="serviceImage"
                                    />
                                </td>
                                <td>
                                    {service.extraPhotos && service.extraPhotos.length > 0 ? (
                                        <div className='extraPhotosContainer' style={{ display: 'flex', flexDirection: 'column', maxHeight: '450px', overflowY: 'auto' }}>
                                            {service.extraPhotos.map((photo, index) => (
                                                <img
                                                    key={index}
                                                    src={`http://localhost:5000/uploads/extrapics/${photo}`}
                                                    alt={`Extra ${index}`}
                                                    className="extraPhotoImage"
                                                  
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No extra photos</p>
                                    )}
                                </td>
                                <td className='location-admin'>{service.name}</td>
                                <td className='location-admin'>{service.location}</td>
                                <td className="description">{service.description}</td>
                                <td>
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        style={{ color: 'tomato', cursor: 'pointer' }}
                                        onClick={() => handleDelete(service._id)}
                                    />
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        style={{ color: 'Black', cursor: 'pointer', marginLeft: '10px' }}
                                        onClick={() => handleEdit(service._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No Accommodation services available.</p>
            )}
        </div>
    );
}

export default Accommodation;
