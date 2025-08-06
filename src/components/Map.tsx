import React, { useRef, useEffect, useState } from 'react';
import DeckGL from '@deck.gl/react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { MapViewState, ViewStateChangeParameters } from '@deck.gl/core';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
if (MAPBOX_ACCESS_TOKEN) {
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
}

const Map = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [viewState, setViewState] = useState<MapViewState>({
    longitude: -122.4,
    latitude: 37.8,
    zoom: 14,
    pitch: 0,
    bearing: 0
  });

  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_ACCESS_TOKEN) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing
    });

    map.addControl(new mapboxgl.NavigationControl());
    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [viewState.longitude, viewState.latitude, viewState.zoom, viewState.pitch, viewState.bearing]);

  const handleViewStateChange = (e: ViewStateChangeParameters) => {
    setViewState(e.viewState);
    
    if (mapRef.current) {
      mapRef.current.jumpTo({
        center: [e.viewState.longitude, e.viewState.latitude],
        zoom: e.viewState.zoom,
        bearing: e.viewState.bearing,
        pitch: e.viewState.pitch
      });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      <DeckGL
        initialViewState={viewState}
        onViewStateChange={handleViewStateChange}
        controller={true}
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          pointerEvents: 'auto'
        }}
        layers={[]}
      />
    </div>
  );
};

export default Map;
