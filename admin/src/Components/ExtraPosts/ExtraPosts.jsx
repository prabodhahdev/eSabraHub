import React, { useState } from 'react';
import axios from 'axios';

const ExtraPhotos = ({ serviceId }) => {
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (files.length === 0) {
            setMessage('');
            setError('Please select files to upload.');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('extraPhotos', files[i]);
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/extraphotos/extra/${serviceId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage(response.data.message);
            setError('');

            // Clear form fields after successful upload
            setFiles([]);
            document.querySelector('input[type="file"]').value = ''; // Clear the file input

        } catch (err) {
            console.error('Error uploading files:', err);
            setMessage('');
            setError(err.response?.data?.message || 'An unexpected error occurred');
        }
    };

    return (
        <div>
            <h2>Upload Extra Photos</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default ExtraPhotos;
