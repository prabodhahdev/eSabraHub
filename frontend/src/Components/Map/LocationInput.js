import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Marker } from '@react-google-maps/api';

const LocationInput = ({ initialLocation, onLocationSelect }) => {
  const [address, setAddress] = useState(initialLocation || ''); // Initialize with initial location
  const [autocomplete, setAutocomplete] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -3.745, lng: -74.003 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(''); // State for error messages

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

        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
        setAddress(formattedAddress); // Update address state
        onLocationSelect(formattedAddress, { lat, lng });
      } else {
        alert('Please select a valid location.');
      }
    }
  };

  useEffect(() => {
    const geocodeLocation = async () => {
      setLoading(true); // Reset loading state when geocoding
      setError(''); // Clear any previous error messages

      // Wait for the Google Maps API to load
      if (!window.google) {
        setTimeout(geocodeLocation, 100); // Retry after a short delay
        return;
      }

      const geocoder = new window.google.maps.Geocoder();

      if (initialLocation && initialLocation.length > 0) {
        geocoder.geocode({ address: initialLocation }, (results, status) => {
          if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            setMapCenter({ lat, lng });
            setMarkerPosition({ lat, lng });
            setAddress(results[0].formatted_address); // Automatically set the address in the input
            setLoading(false); // Set loading to false when geocoding is done
          } else {
            setLoading(false); // Set loading to false in case of error
            setError('Could not find the location.'); // Set error state
            console.error('Geocoding failed:', status);
          }
        });
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMapCenter({ lat: latitude, lng: longitude });
            setMarkerPosition({ lat: latitude, lng: longitude });

            // Reverse geocode to get the address from current position
            geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
              if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
                setAddress(results[0].formatted_address); // Automatically set the address in the input
              } else {
                setError('Could not retrieve address for current location.'); // Set error state
                console.error('Reverse geocoding failed:', status);
              }
              setLoading(false); // Set loading to false after checking current position
            });
          },
          (error) => {
            setLoading(false); // Set loading to false on error
            setError('Could not retrieve current location.'); // Set error state
            console.error('Error getting location:', error);
          }
        );
      } else {
        setLoading(false); // Set loading to false if geolocation is not supported
        setError('Geolocation is not supported by this browser.'); // Set error state
      }
    };

    geocodeLocation();

    // Cleanup function to avoid memory leaks
    return () => {
      setLoading(false); // Reset loading when the component unmounts
      setError(''); // Clear error messages when the component unmounts
    };
    
  }, [initialLocation]); // Run effect when initialLocation changes

  return (
    <LoadScript googleMapsApiKey="AIzaSyB4RaszB_X_T0AMhA1dDFVP0SZ-pm-U7eo" libraries={["places"]}>
      <div className="map-container" style={{ position: 'relative', height: '400px', width: '100%' }}>
        {loading && <p>Loading map...</p>} {/* Loading message */}
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Error message */}

        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={mapCenter}
          zoom={15}
        >
          <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter a location"
              style={{
                width: '300px',
                height: '40px',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                position: 'absolute',
                top: '10px',
                left: '10px',
                zIndex: 10
              }}
            />
          </Autocomplete>

          {markerPosition && (
            <Marker
              position={markerPosition}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default LocationInput;