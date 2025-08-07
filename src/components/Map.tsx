import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { Map as ReactMapGL } from 'react-map-gl';
import { ScatterplotLayer } from '@deck.gl/layers';
import { Box, CircularProgress, Alert } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from './Map/hooks/useMap';
import { useCompetitors, useMyPlace } from '../hooks/useApi';
import PlaceInfoPopup from './PlaceInfoPopup';
import type { Place } from '../types';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface MapProps {
  filters?: {
    radius: number;
    industry: string;
    showLayer: boolean;
    tradeAreas: { [key: string]: boolean };
  };
  isTradeAreaSelected?: boolean;
}

const Map: React.FC<MapProps> = ({ filters, isTradeAreaSelected = false }) => {
  const { viewState, onViewStateChange } = useMap();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [initialViewSet, setInitialViewSet] = useState(false);

  // Apply industry filter to competitors
  const competitorFilters = filters?.industry ? { industry: filters.industry } : undefined;
  const { data: competitors, isLoading: competitorsLoading, error: competitorsError } = useCompetitors(competitorFilters);
  const { data: myPlace, isLoading: myPlaceLoading, error: myPlaceError } = useMyPlace();

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Filter competitors by radius if radius filter is set and myPlace exists
  const filteredCompetitors = React.useMemo(() => {
    if (!competitors || !myPlace || !filters?.radius || filters.radius === 0) {
      return competitors || [];
    }
    
    const myLat = Number(myPlace.latitude);
    const myLon = Number(myPlace.longitude);
    
    return competitors.filter(competitor => {
      const compLat = Number(competitor.latitude);
      const compLon = Number(competitor.longitude);
      const distance = calculateDistance(myLat, myLon, compLat, compLon);
      return distance <= filters.radius;
    });
  }, [competitors, myPlace, filters?.radius]);

  // Focus on my_place when data loads
  useEffect(() => {
    if (myPlace && !initialViewSet) {
      const newViewState = {
        longitude: Number(myPlace.longitude),
        latitude: Number(myPlace.latitude),
        zoom: 14, // Closer zoom to see the point clearly
        pitch: 0,
        bearing: 0,
      };
      onViewStateChange({ viewState: newViewState });
      setInitialViewSet(true);
    }
  }, [myPlace, initialViewSet, onViewStateChange]);

  // Create layers
  const layers = [];

  // Add competitors layer (orange semi-transparent circles - smaller size)
  if (filteredCompetitors && filteredCompetitors.length > 0 && filters?.showLayer !== false) {
    layers.push(
      new ScatterplotLayer({
        id: 'competitors-layer',
        data: filteredCompetitors,
        getPosition: (d: Place) => [Number(d.longitude), Number(d.latitude)],
        getRadius: 80, // More visible - 80m radius
        getFillColor: [255, 165, 0, 180], // Orange with more opacity (70%)
        getLineColor: [255, 140, 0, 255], // Darker orange border
        getLineWidth: 3,
        pickable: true,
        onClick: (info: any) => {
          if (info.object) {
            setSelectedPlace(info.object);
            // Use screen coordinates from the click event
            const x = info.x || 200;
            const y = info.y || 200;
            setPopupPosition({ x, y: y - 10 }); // Slightly above the click point
          }
        },
      })
    );
  }

  // Add my place layer (red circle - smaller than before but larger than competitors)
  if (myPlace && filters?.showLayer !== false) {
    layers.push(
      new ScatterplotLayer({
        id: 'my-place-layer',
        data: [myPlace],
        getPosition: (d: Place) => [Number(d.longitude), Number(d.latitude)],
        getRadius: 120, // More prominent - 120m radius
        getFillColor: [255, 0, 0, 220], // Bright red with high opacity
        getLineColor: [180, 0, 0, 255], // Dark red border
        getLineWidth: 4,
        pickable: true,
        onClick: (info: any) => {
          if (info.object) {
            setSelectedPlace(info.object);
            // Use screen coordinates from the click event
            const x = info.x || 200;
            const y = info.y || 200;
            setPopupPosition({ x, y: y - 10 }); // Slightly above the click point
          }
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

  const handleShowAction = () => {
    console.log('Show action clicked for:', selectedPlace?.name);
    // Here you can implement the actual functionality
    // For trade area: show trade area polygons
    // For zip codes: show zip code analysis
  };

  const handleMapClick = (info: any) => {
    // Only close popup when clicking on empty area (no object)
    if (!info.object) {
      setSelectedPlace(null);
      setPopupPosition(null);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <DeckGL
        initialViewState={viewState}
        onViewStateChange={onViewStateChange}
        controller={true}
        layers={layers}
        onClick={handleMapClick}
        getTooltip={({ object }: any) => object && `${object.name}`}
        style={{ position: 'relative', width: '100vw', height: '100vh' }}
      >
        <ReactMapGL
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        />
      </DeckGL>
      
      {/* Place Information Popup */}
      {selectedPlace && (
        <PlaceInfoPopup
          place={selectedPlace}
          isTradeAreaSelected={isTradeAreaSelected}
          position={popupPosition}
          onClose={() => {
            setSelectedPlace(null);
            setPopupPosition(null);
          }}
          onShowAction={handleShowAction}
        />
      )}
    </Box>
  );
};

export default Map;
