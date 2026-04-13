import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const defaultCenter = [20.5937, 78.9629];

const MapView = ({ location }) => {
  const center = location ? [location.latitude, location.longitude] : defaultCenter;

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom className="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {location && (
        <Marker position={[location.latitude, location.longitude]}>
          <Popup>Your current location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapView;
