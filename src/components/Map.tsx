import DeckGL from '@deck.gl/react';
import { Map as ReactMapGL } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMap } from './Map/hooks/useMap';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const Map = () => {
  const { viewState, onViewStateChange } = useMap();

  return (
    <DeckGL
      initialViewState={viewState}
      onViewStateChange={onViewStateChange}
      controller={true}
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
