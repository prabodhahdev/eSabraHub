import React, { useState } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Marker } from '@react-google-maps/api';

const LocationInput = ({ onLocationSelect }) => {
    const [address, setAddress] = useState('');
    const [autocomplete, setAutocomplete] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: -3.745, lng: -74.003 }); // Default center
    const [markerPosition, setMarkerPosition] = useState(null); // State for marker position

    const handleLoad = (autoC) => {
        setAutocomplete(autoC);
    };

    const handlePlaceChanged = () => {
        if (autocomplete) {
            const place = autocomplete.getPlace();
            if (place && place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const formattedAddress = place.formatted_address;

                // Update the map center and marker position to the selected location
                setMapCenter({ lat, lng });
                setMarkerPosition({ lat, lng }); // Set marker position

                // Call the parent function with the selected location
                onLocationSelect(formattedAddress, { lat, lng });
                setAddress(formattedAddress);
            } else {
                alert('Please select a valid location.');
            }
        }
    };

    return (
        <LoadScript googleMapsApiKey="AIzaSyB4RaszB_X_T0AMhA1dDFVP0SZ-pm-U7eo" libraries={["places"]}>
            <div style={{ position: 'relative', width: '100%', height: '400px' }}>
                <GoogleMap
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={mapCenter} // Use the updated map center
                    zoom={10}
                >
                    <Autocomplete
                        onLoad={handleLoad}
                        onPlaceChanged={handlePlaceChanged}
                    >
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)} // Update address as user types
                            placeholder="Enter a location"
                            style={{
                                width: '300px',
                                height: '40px',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                position: 'absolute',
                                top: '10px', // Position it at the top of the map
                                left: '10px', // Align it to the left
                                zIndex: 10 // Ensure it appears above the map
                            }}
                        />
                    </Autocomplete>

                    {/* Show the marker if the position is set */}
                    {markerPosition && (
                        <Marker
                            position={markerPosition} // Set marker position
                            icon={{
                                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // URL for the red marker icon
                                scaledSize: new window.google.maps.Size(40, 40), // Resize the marker if necessary
                            }}
                        />
                    )}
                </GoogleMap>
            </div>
        </LoadScript>
    );
};

export default LocationInput;
