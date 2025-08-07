import React from 'react';
import DeckGL from '@deck.gl/react';
import { Map as ReactMapGL } from 'react-map-gl';
import { ScatterplotLayer, IconLayer } from '@deck.gl/layers';
import { Box, CircularProgress, Alert } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from './Map/hooks/useMap';
import { useCompetitors, useMyPlace } from '../hooks/useApi';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const Map = () => {
  const { viewState, onViewStateChange } = useMap();
  const { data: competitors, isLoading: competitorsLoading, error: competitorsError } = useCompetitors();
  const { data: myPlace, isLoading: myPlaceLoading, error: myPlaceError } = useMyPlace();

  // Create layers
  const layers = [];

  // Add competitors layer (orange semi-transparent circles)
  if (competitors && competitors.length > 0) {
    layers.push(
      new ScatterplotLayer({
        id: 'competitors-layer',
        data: competitors,
        getPosition: (d: any) => [d.longitude, d.latitude],
        getRadius: 800, // 800m radius
        getFillColor: [255, 165, 0, 128], // Orange with 50% transparency
        getLineColor: [255, 165, 0, 200], // Orange border
        getLineWidth: 2,
        pickable: true,
        onClick: (info: any) => {
          console.log('Clicked competitor:', info.object);
        },
      })
    );
  }

  // Add my place layer (red triangle - larger than competitors)
  if (myPlace) {
    layers.push(
      new ScatterplotLayer({
        id: 'my-place-layer',
        data: [myPlace],
        getPosition: (d: any) => [d.longitude, d.latitude],
        getRadius: 1200, // 1200m radius - larger than competitors
        getFillColor: [255, 0, 0, 200], // Red with 80% opacity
        getLineColor: [139, 0, 0, 255], // Dark red border
        getLineWidth: 3,
        pickable: true,
        onClick: (info: any) => {
          console.log('Clicked my place:', info.object);
        },
      })
    );
  }

  // Show loading state
  if (competitorsLoading || myPlaceLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (competitorsError || myPlaceError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          {competitorsError?.message || myPlaceError?.message || 'Failed to load map data'}
        </Alert>
      </Box>
    );
  }

  return (
    <DeckGL
      initialViewState={viewState}
      onViewStateChange={onViewStateChange}
      controller={true}
      layers={layers}
      style={{ position: 'relative', width: '100vw', height: '100vh' }}
    >
      <ReactMapGL
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      />
    </DeckGL>
  );
};

export default Map;
