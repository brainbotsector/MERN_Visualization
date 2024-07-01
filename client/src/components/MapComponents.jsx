import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const countriesGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Country A',
        population: 1000000,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]],
      },
    },
    // Add more features as needed
  ],
};

const MapComponent = () => {
  const onEachCountry = (feature, layer) => {
    layer.on({
      mouseover: () => {
        layer.setStyle({
          fillColor: 'blue',
        });
      },
      mouseout: () => {
        layer.setStyle({
          fillColor: 'green',
        });
      },
      click: () => {
        console.log(`Clicked on ${feature.properties.name}`);
      },
    });

    layer.bindTooltip(feature.properties.name);
  };

  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <GeoJSON data={countriesGeoJSON} onEachFeature={onEachCountry} />
    </MapContainer>
  );
};

export default MapComponent;
