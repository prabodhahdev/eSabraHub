import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for notifications
import './ExtraPhotos.css'; // Import your CSS file

const ExtraPhotos = ({ serviceId }) => {
    const [files, setFiles] = useState([]);

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (files.length === 0) {
            toast.warning('Please select files to upload.'); // Show error toast for no files
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

            // If the upload is successful, show a success message
            toast.success("Post Created Successfully"); // Show success toast

            // Clear form fields after successful upload
            setFiles([]);
            document.querySelector('input[type="file"]').value = ''; // Clear the file input

        } catch (err) {
            console.error('Error uploading files:', err);

            // Show error toast if there's an issue
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred'; 
            toast.error(errorMessage); // Show error toast with the error message
        }
    };

    // Function to generate image previews
    const renderImagePreviews = () => {
        const imageArray = Array.from(files);
        return imageArray.map((file, index) => {
            const imageUrl = URL.createObjectURL(file);
            return (
                <img
                    key={index}
                    src={imageUrl}
                    alt="Preview"
                    className="image-preview"
                />
            );
        });
    };

    return (
        <div className="extra-photos-container">
            <h2>If you have extra photos to add. you can add</h2>
            <form className="extra-photos-form" onSubmit={handleSubmit}>
                <label className="custom-file-upload">
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                    />
                    <span className="upload-icon" /> {/* Replace this with an actual image or icon if needed */}
                    <p>Select Images</p>
                </label>
                
                {/* Display image previews below the label */}
                <div className="preview-images-container">
                    {renderImagePreviews()}
                </div>

                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default ExtraPhotos;
