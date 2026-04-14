import { MapContainer, Marker, TileLayer, Popup, Polyline, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const defaultCenter = [20.5937, 78.9629];

const MapView = ({ location, path = [], policeStations = [] }) => {
  const center = location ? [location.latitude, location.longitude] : defaultCenter;

  // Convert track path into Leaflet coordinate format
  const polylinePath = path.map(p => [p.latitude, p.longitude]);

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom className="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* User Current Position */}
      {location && (
        <Marker position={[location.latitude, location.longitude]}>
          <Popup>
            <div className="map-popup">
              <strong>Your current location</strong>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Police Stations */}
      {policeStations.map((ps, idx) => (
        <CircleMarker 
          key={idx} 
          center={[ps.latitude, ps.longitude]} 
          color="#3b82f6" 
          fillColor="#3b82f6" 
          fillOpacity={0.6}
          radius={12}
        >
          <Popup>
            <div className="map-popup">
              <strong>{ps.name} (Police Station)</strong>
              <p>{ps.address}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      {/* SOS/Tracking Path */}
      {polylinePath.length > 1 && (
        <Polyline 
          positions={polylinePath} 
          pathOptions={{ color: '#f43f5e', weight: 4, dashArray: '8, 8' }} 
        />
      )}
    </MapContainer>
  );
};

export default MapView;
