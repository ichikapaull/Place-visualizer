import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import ReactMapGL from 'react-map-gl';
import { ScatterplotLayer, PolygonLayer, GeoJsonLayer } from '@deck.gl/layers';
import { Box, CircularProgress, Alert } from '@mui/material';
import { scaleSequential } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from './Map/hooks/useMap';
import { useCompetitors, useMyPlace } from '../hooks/useApi';
import { useTradeAreaData } from '../hooks/useTradeAreaData';
import { useTradeAreaAvailability } from '../hooks/useTradeAreaAvailability';
import { useHomeZipcodeData, useHomeZipcodeAvailability } from '../hooks/useHomeZipcodeData';
import { useAppStore } from '../store/appStore';

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
  activeTradeAreas?: Set<string>;
  onToggleTradeArea?: (placeId: string) => void;
}

const Map: React.FC<MapProps> = ({ 
  filters, 
  isTradeAreaSelected = false,
  activeTradeAreas = new Set(),
  onToggleTradeArea
}) => {
  const { viewState, onViewStateChange } = useMap();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [initialViewSet, setInitialViewSet] = useState(false);

  // Apply industry filter to competitors
  const competitorFilters = filters?.industry ? { industry: filters.industry } : undefined;
  const { data: competitors, isLoading: competitorsLoading, error: competitorsError } = useCompetitors(competitorFilters);
  const { data: myPlace, isLoading: myPlaceLoading, error: myPlaceError } = useMyPlace();

  // Fetch trade area data for active places
  const activePlaceIds = Array.from(activeTradeAreas);
  const { data: tradeAreaData } = useTradeAreaData(activePlaceIds);
  
  // Check if selected place has trade area data
  const { data: hasTradeAreaData } = useTradeAreaAvailability(selectedPlace?.id || null);
  
  // Home Zipcodes state and data (PRD: only one place at a time)
  const { zipcodePlaceId, showHomeZipcodes, setZipcodePlaceId } = useAppStore();
  const { data: homeZipcodeData, isLoading: zipcodesLoading } = useHomeZipcodeData(zipcodePlaceId);
  const { data: hasZipcodesData } = useHomeZipcodeAvailability(selectedPlace?.id || null);
  


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
      onViewStateChange({ viewState: newViewState, viewId: 'map', interactionState: {} });
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
        onClick: (info: { object?: Place; x?: number; y?: number }) => {
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
        onClick: (info: { object?: Place; x?: number; y?: number }) => {
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

  // Add Trade Area polygons for active places using real Supabase data
  if (activeTradeAreas.size > 0 && isTradeAreaSelected && tradeAreaData && filters?.tradeAreas) {
    console.log('🗺️ Map: Rendering trade areas for activeTradeAreas:', Array.from(activeTradeAreas));
    console.log('🗺️ Map: tradeAreaData:', tradeAreaData);
    console.log('🗺️ Map: filters.tradeAreas:', filters.tradeAreas);
    
    // Use real trade area data from Supabase
    tradeAreaData.forEach(({ placeId, tradeAreas }) => {
      console.log(`🗺️ Map: Processing place ${placeId} with ${tradeAreas?.length || 0} trade areas`);
      if (tradeAreas && tradeAreas.length > 0) {
        tradeAreas.forEach(tradeArea => {
          // Only show trade areas that are selected in the sidebar filter
          const isPercentageSelected = filters.tradeAreas[tradeArea.percentage.toString()];
          
          console.log(`🗺️ Map: Trade area ${tradeArea.percentage}% - selected: ${isPercentageSelected}`);
          
          if (isPercentageSelected && tradeArea.geometry) {
            // Parse the geometry from Supabase (should be GeoJSON format)
            let polygonCoordinates: number[][][];
            try {
              // The geometry should already be a JSON object from Supabase
              const geometry = tradeArea.geometry;
              
              console.log('🗺️ Map: Processing geometry:', geometry);
              
              // Extract coordinates from GeoJSON Polygon
              if (geometry && geometry.type === 'Polygon' && geometry.coordinates) {
                polygonCoordinates = geometry.coordinates;
                console.log(`🗺️ Map: Found polygon with ${polygonCoordinates.length} rings`);
              } else {
                console.error('❌ Invalid geometry format for trade area:', geometry);
                return;
              }
            } catch (error) {
              console.error('❌ Failed to parse trade area geometry:', error);
              return;
            }

            // Apply styling based on percentage - matching the legend colors
            let fillColor: [number, number, number, number];
            let strokeColor: [number, number, number, number];
            
            switch (tradeArea.percentage) {
              case 30:
                fillColor = [255, 215, 0, 120]; // Gold with transparency
                strokeColor = [255, 215, 0, 255]; // Solid gold border
                break;
              case 50:
                fillColor = [255, 165, 0, 120]; // Orange with transparency
                strokeColor = [255, 165, 0, 255]; // Solid orange border
                break;
              case 70:
                fillColor = [255, 0, 0, 120]; // Red with transparency
                strokeColor = [255, 0, 0, 255]; // Solid red border
                break;
              default:
                fillColor = [128, 128, 128, 120];
                strokeColor = [128, 128, 128, 255];
            }

            const layer = new PolygonLayer({
              id: `trade-area-${placeId}-${tradeArea.percentage}`,
              data: [{ coordinates: polygonCoordinates, percentage: tradeArea.percentage, placeId }],
              getPolygon: (d: { coordinates: number[][][] }) => d.coordinates,
              getFillColor: fillColor,
              getLineColor: strokeColor,
              getLineWidth: 3,
              pickable: true,
              stroked: true,
              filled: true,
              wireframe: false,
              lineWidthMinPixels: 2,
              lineWidthMaxPixels: 4,
              // Add hover and click interactions
              onHover: (info: { object?: { percentage: number; placeId: string } }) => {
                if (info.object) {
                  console.log(`🎯 Hovering over ${info.object.percentage}% trade area for place ${info.object.placeId}`);
                }
              },
            });
            
            console.log(`✅ Map: Added ${tradeArea.percentage}% trade area layer for place ${placeId}`);
            layers.push(layer);
          } else if (!isPercentageSelected) {
            console.log(`⏭️ Map: Skipping ${tradeArea.percentage}% trade area (not selected in filter)`);
          } else if (!tradeArea.geometry) {
            console.log(`⚠️ Map: No geometry found for ${tradeArea.percentage}% trade area`);
          }
        });
      }
    });
  }

  // Add Home Zipcodes choropleth layer (PRD: only one place at a time)
  if (showHomeZipcodes && zipcodePlaceId && homeZipcodeData && homeZipcodeData.length > 0) {
    console.log('🏠 Map: Rendering home zipcodes for place:', zipcodePlaceId);
    console.log('🏠 Map: Zipcode data:', homeZipcodeData);
    
    // Calculate color scale based on customer counts
    const customerCounts = homeZipcodeData.map(zc => zc.customer_count);
    const minCustomers = Math.min(...customerCounts);
    const maxCustomers = Math.max(...customerCounts);
    
    console.log('🏠 Map: Customer count range:', minCustomers, '-', maxCustomers);
    
    // Create color scale (yellow to red based on customer density)
    const colorScale = scaleSequential(interpolateYlOrRd)
      .domain([minCustomers, maxCustomers]);
    
    // Convert to GeoJSON format for GeoJsonLayer
    const zipcodesGeoJson = {
      type: 'FeatureCollection' as const,
      features: homeZipcodeData.map(zipcode => ({
        type: 'Feature' as const,
        properties: {
          id: zipcode.id,
          zipcode: zipcode.zipcode,
          customer_count: zipcode.customer_count,
          place_id: zipcode.place_id
        },
        geometry: zipcode.locations // Using JSONB locations field
      }))
    };
    
    const zipcodesLayer = new GeoJsonLayer({
      id: `home-zipcodes-${zipcodePlaceId}`,
      data: zipcodesGeoJson,
      getFillColor: (feature: { properties: { customer_count: number } }) => {
        const customerCount = feature.properties.customer_count;
        const colorStr = colorScale(customerCount);
        // Convert d3 color string to RGBA array
        const rgb = colorStr.match(/\d+/g);
        return rgb ? [parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]), 160] : [255, 255, 0, 160];
      },
      getLineColor: [255, 255, 255, 200],
      getLineWidth: 2,
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 3,
      pickable: true,
      stroked: true,
      filled: true,
      opacity: 0.7,
      updateTriggers: {
        getFillColor: [minCustomers, maxCustomers]
      },
      // Tooltip on hover
      onHover: (info: { object?: { properties: { zipcode: string; customer_count: number } } }) => {
        if (info.object) {
          const props = info.object.properties;
          console.log(`🏠 Hovering over zipcode ${props.zipcode} with ${props.customer_count} customers`);
        }
      },
    });
    
    console.log(`✅ Map: Added home zipcodes layer for place ${zipcodePlaceId}`);
    layers.push(zipcodesLayer);
  }

  // Show loading state
  if (competitorsLoading || myPlaceLoading || zipcodesLoading) {
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
    console.log('🔘 Show action clicked for:', selectedPlace?.name);
    console.log('📍 Selected place ID:', selectedPlace?.id);
    console.log('🔄 onToggleTradeArea function:', onToggleTradeArea);
    
    if (selectedPlace && onToggleTradeArea) {
      console.log('✅ Calling onToggleTradeArea with ID:', selectedPlace.id);
      onToggleTradeArea(selectedPlace.id);
    } else {
      console.log('❌ Missing selectedPlace or onToggleTradeArea');
    }
  };

  const handleZipcodesAction = () => {
    console.log('🏠 Zipcodes action clicked for:', selectedPlace?.name);
    console.log('📍 Selected place ID:', selectedPlace?.id);
    
    if (selectedPlace) {
      // PRD: Toggle zipcodes for this place (only one at a time)
      if (zipcodePlaceId === selectedPlace.id) {
        console.log('🗑️ Hiding zipcodes for place:', selectedPlace.id);
        setZipcodePlaceId(null);
      } else {
        console.log('🏠 Showing zipcodes for place:', selectedPlace.id);
        setZipcodePlaceId(selectedPlace.id);
      }
    } else {
      console.log('❌ Missing selectedPlace');
    }
  };

  const handleMapClick = (info: { object?: Place }) => {
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
        getTooltip={({ object }: { object?: Place }) => object ? `${object.name}` : null}
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
          isTradeAreaVisible={activeTradeAreas.has(selectedPlace.id)}
          hasTradeAreaData={hasTradeAreaData ?? true}
          isZipcodesVisible={zipcodePlaceId === selectedPlace.id}
          hasZipcodesData={hasZipcodesData ?? true}
          position={popupPosition}
          onClose={() => {
            setSelectedPlace(null);
            setPopupPosition(null);
          }}
          onShowAction={handleShowAction}
          onZipcodesAction={handleZipcodesAction}
        />
      )}
    </Box>
  );
};

export default Map;
