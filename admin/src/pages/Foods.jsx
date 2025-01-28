import React, { useEffect, useState } from 'react';
import { fetchServicesByType, deleteService } from '../ServicesAPI/Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './ServicesAdmin.css'; // Import CSS file

function Foods() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchServicesByType('food');
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
        } catch (error) {
            console.error('Error deleting service:', error);
            setError('Failed to delete service. Please try again.');
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Accommodation Services</h1>
            {services.length > 0 ? (
                <table className="servicesTable">
                    <thead>
                        <tr>
                            <th>Main Image</th>
                            <th>Extra Images</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Description</th>
                            <th>Actions</th>
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
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {service.extraPhotos.map((photo, index) => (
                                                <img
                                                    key={index}
                                                    src={`http://localhost:5000/uploads/extrapics/${photo}`}
                                                    alt={`Extra ${index}`}
                                                    className="extraPhotoImage"
                                                    style={{ width: '100px', height: 'auto', margin: '5px' }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No extra photos</p>
                                    )}
                                </td>
                                <td>{service.name}</td>
                                <td>{service.location}</td>
                                <td>{service.description}</td>
                                <td>
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        style={{ color: 'red', cursor: 'pointer' }}
                                        onClick={() => handleDelete(service._id)}
                                    />
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        style={{ color: 'blue', cursor: 'pointer', marginLeft: '10px' }}
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

export default Foods;
