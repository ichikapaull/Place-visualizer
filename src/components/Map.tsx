import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import ReactMapGL from 'react-map-gl';
import { ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers';
import { Box, CircularProgress, Alert } from '@mui/material';
// d3-scale removed for PRD quintile coloring
import * as turf from '@turf/turf';
import { createTradeAreaLayer } from './Map/layers/createTradeAreaLayers';
import { createZipcodeLayer } from './Map/layers/createZipcodeLayer';
import type { ZipcodeFeature } from './Map/layers/createZipcodeLayer';
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
    industry: string[];
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

  // Apply industry filter to competitors (supports multi-select)
  const competitorFilters = (filters?.industry && filters.industry.length > 0)
    ? { industry: filters.industry }
    : undefined;
  const { data: competitors, isLoading: competitorsLoading, error: competitorsError } = useCompetitors(competitorFilters);
  const { data: myPlace, isLoading: myPlaceLoading, error: myPlaceError } = useMyPlace();

  // Fetch trade area data for active places
  const activePlaceIds = Array.from(activeTradeAreas);
  const { data: tradeAreaData } = useTradeAreaData(activePlaceIds);
  
  // Check if selected place has trade area data
  const { data: hasTradeAreaData } = useTradeAreaAvailability(selectedPlace?.id || null);
  
  // Home Zipcodes state and data (PRD: only one place at a time)
  const { zipcodePlaceId, showHomeZipcodes, setZipcodePlaceId, setShowHomeZipcodes, analysisType } = useAppStore();
  const zipcodeTargetPlace = React.useMemo(() => {
    if (!zipcodePlaceId) return null;
    if (selectedPlace && selectedPlace.id === zipcodePlaceId) return selectedPlace;
    if (myPlace?.id === zipcodePlaceId) return myPlace;
    const comp = (competitors || []).find(p => p.id === zipcodePlaceId) || null;
    return comp;
  }, [zipcodePlaceId, selectedPlace, myPlace, competitors]);
  const { data: homeZipcodeData, isLoading: zipcodesLoading } = useHomeZipcodeData(zipcodeTargetPlace);
  const { data: hasZipcodesData } = useHomeZipcodeAvailability(zipcodeTargetPlace);
  


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

  // PRD: If switching to Home Zipcodes while multiple Trade Areas are visible,
  // only keep My Place's Home Zipcodes on screen
  useEffect(() => {
    if (analysisType === 'Home Zipcodes' && activeTradeAreas.size > 0) {
      if (myPlace?.id) {
        setZipcodePlaceId(myPlace.id);
        setShowHomeZipcodes(true);
      } else {
        setZipcodePlaceId(null);
        setShowHomeZipcodes(false);
      }
    }
  }, [analysisType, activeTradeAreas.size, myPlace?.id, setZipcodePlaceId, setShowHomeZipcodes]);

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
  if (activeTradeAreas.size > 0 && analysisType === 'Trade Area' && tradeAreaData && filters?.tradeAreas) {
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

            const layer = createTradeAreaLayer(placeId, { percentage: tradeArea.percentage as 30|50|70, geometry: { type: 'Polygon', coordinates: polygonCoordinates } });
            
            console.log(`✅ Map: Added ${tradeArea.percentage}% trade area layer for place ${placeId}`);
            if (layer) layers.push(layer);
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
  console.log('🏠 Map: Zipcode layer conditions:', {
    showHomeZipcodes,
    zipcodePlaceId,
    hasZipcodeData: !!homeZipcodeData,
    zipcodeDataLength: homeZipcodeData?.length
  });
  
  if (showHomeZipcodes && zipcodePlaceId && homeZipcodeData && homeZipcodeData.length > 0) {
    console.log('🏠 Map: Rendering home zipcodes for place:', zipcodePlaceId);
    console.log('🏠 Map: Raw zipcode data count:', homeZipcodeData.length);
    
    // Find the selected place to get its coordinates
    const targetPlace = myPlace?.id === zipcodePlaceId ? myPlace : 
                       competitors?.find(p => p.id === zipcodePlaceId);
    
    if (!targetPlace) {
      console.warn('🏠 Map: Target place not found for zipcode filtering, available places:', 
        { myPlace: myPlace?.id, competitors: competitors?.map(c => c.id) });
    } else {
    
    const placeLng = Number(targetPlace.longitude);
    const placeLat = Number(targetPlace.latitude);
    const placePoint = turf.point([placeLng, placeLat]);
    
    console.log('🏠 Map: Target place coordinates:', [placeLng, placeLat]);
    
    // Filter zipcodes by distance (increased radius for better coverage)
    // Narrow down to avoid overwhelming fill
    const MAX_DISTANCE_KM = 50;
    
    // Test first few zipcodes to see their distances
    console.log('🏠 Map: Testing distances for first 3 zipcodes:');
    homeZipcodeData.slice(0, 3).forEach((zipcode, idx) => {
      try {
        const zipcodeCentroid = turf.centroid(zipcode.polygon);
        const distance = turf.distance(placePoint, zipcodeCentroid, { units: 'kilometers' });
        console.log(`  Zipcode ${idx + 1} (${zipcode.zipcode}): ${distance.toFixed(2)}km`);
      } catch (error) {
        console.log(`  Zipcode ${idx + 1} (${zipcode.zipcode}): ERROR -`, error);
      }
    });
    
    // Geometry sanity check to prevent world-covering artifacts
    const isGeometryValid = (geom: any): boolean => {
      if (!geom || (geom.type !== 'Polygon' && geom.type !== 'MultiPolygon')) return false;
      const arrays: number[][] = [];
      if (geom.type === 'Polygon') {
        geom.coordinates.forEach((ring: number[][]) => ring.forEach((p) => arrays.push(p)));
      } else {
        geom.coordinates.forEach((poly: number[][][]) => poly.forEach((ring) => ring.forEach((p) => arrays.push(p))));
      }
      // Reject if any coord out of bounds
      for (const [lon, lat] of arrays) {
        if (Number.isNaN(lon) || Number.isNaN(lat)) return false;
        if (lon < -180 || lon > 180 || lat < -90 || lat > 90) return false;
      }
      // Rough bbox size check (zipcodes should not span > 5 degrees)
      const lons = arrays.map(a => a[0]);
      const lats = arrays.map(a => a[1]);
      const lonSpan = Math.max(...lons) - Math.min(...lons);
      const latSpan = Math.max(...lats) - Math.min(...lats);
      if (lonSpan > 5 || latSpan > 5) return false;
      return true;
    };

    const filteredZipcodeData = homeZipcodeData.filter(zipcode => {
      try {
        if (!isGeometryValid(zipcode.polygon)) return false;
        // Get centroid of zipcode polygon
        const zipcodeCentroid = turf.centroid(zipcode.polygon);
        const distance = turf.distance(placePoint, zipcodeCentroid, { units: 'kilometers' });
        
        return distance <= MAX_DISTANCE_KM;
      } catch (error) {
        console.warn('🏠 Map: Error calculating distance for zipcode:', zipcode.zipcode, error);
        return false;
      }
    });
    
    console.log('🏠 Map: Filtered zipcode data count:', filteredZipcodeData.length, `(within ${MAX_DISTANCE_KM}km)`);
    
    if (filteredZipcodeData.length === 0) {
      console.log('🏠 Map: No zipcodes found within radius, showing all zipcodes instead');
      // Fallback: show all zipcodes if none found within radius
      const validAll = homeZipcodeData.filter(z => isGeometryValid(z.polygon)).slice(0, 20);
      const allZipcodesGeoJson = {
        type: 'FeatureCollection' as const,
        features: validAll.map(zipcode => ({
          type: 'Feature' as const,
          properties: {
            id: zipcode.id,
            zipcode: zipcode.zipcode,
            customer_count: zipcode.customer_count,
            quintile: zipcode.quintile
          },
          geometry: zipcode.polygon
        }))
      };
      
      const fallbackLayer = new GeoJsonLayer({
        id: `home-zipcodes-fallback-${zipcodePlaceId}`,
        data: allZipcodesGeoJson,
        getFillColor: [0, 136, 204, 40], // very low opacity safety fallback
        getLineColor: [255, 255, 255, 100],
        getLineWidth: 1,
        pickable: true,
        stroked: true,
        filled: true,
        opacity: 0.3
      });
      
      console.log(`✅ Map: Added fallback zipcodes layer (${validAll.length} zipcodes)`);
      layers.push(fallbackLayer);
    } else {
    
    // Convert filtered data to GeoJSON format for GeoJsonLayer
    const zipcodesGeoJson = {
      type: 'FeatureCollection' as const,
      features: filteredZipcodeData.map(zipcode => ({
        type: 'Feature' as const,
        properties: {
          id: zipcode.id,
          zipcode: zipcode.zipcode,
          customer_count: zipcode.customer_count,
          quintile: zipcode.quintile
        },
        geometry: zipcode.polygon // Using polygon field from customer_zipcodes
      }))
    };
    
    const zipcodesLayer = createZipcodeLayer(zipcodePlaceId, zipcodesGeoJson.features as unknown as ZipcodeFeature[]);
    
    console.log(`✅ Map: Added home zipcodes layer for place ${zipcodePlaceId}`);
    layers.push(zipcodesLayer);
    }
  }
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
      // Toggle zipcodes for the selected place (mutually exclusive)
      if (zipcodePlaceId === selectedPlace.id) {
        console.log('🗑️ Hiding zipcodes for place:', selectedPlace.id);
        setZipcodePlaceId(null);
        setShowHomeZipcodes(false);
      } else {
        console.log('🏠 Showing zipcodes for place:', selectedPlace.id);
        setZipcodePlaceId(selectedPlace.id);
        setShowHomeZipcodes(true);
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
          isTradeAreaSelected={analysisType === 'Trade Area'}
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
