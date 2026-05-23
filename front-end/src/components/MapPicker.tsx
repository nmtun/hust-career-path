import L from 'leaflet';
import {MapContainer, Marker, TileLayer, useMap, useMapEvents} from 'react-leaflet';
import {useEffect, useMemo} from 'react';
import type {LocationCoordinates} from '@/types/models';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DEFAULT_ZOOM = 13;
const DEFAULT_ICON = L.icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DEFAULT_ICON;

interface MapPickerProps {
  value: LocationCoordinates;
  onChange: (coords: LocationCoordinates) => void;
  className?: string;
}

function MapClickHandler({onChange}: {onChange: (coords: LocationCoordinates) => void}) {
  useMapEvents({
    click(event) {
      onChange({lat: event.latlng.lat, lng: event.latlng.lng});
    },
  });
  return null;
}

function MapRecenter({center}: {center: [number, number]}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}

export default function MapPicker({value, onChange, className}: MapPickerProps) {
  const center = useMemo<[number, number]>(() => [value.lat, value.lng], [value.lat, value.lng]);

  return (
    <MapContainer center={center} zoom={DEFAULT_ZOOM} scrollWheelZoom className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapRecenter center={center} />
      <MapClickHandler onChange={onChange} />
      <Marker position={center} />
    </MapContainer>
  );
}
