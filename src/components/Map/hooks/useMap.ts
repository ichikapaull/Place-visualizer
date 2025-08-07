import { useState, useCallback } from 'react';
import type { MapViewState, ViewStateChangeParameters } from '@deck.gl/core';

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -105.7821,
  latitude: 39.5501,
  zoom: 6,
  pitch: 0,
  bearing: 0,
};

export const useMap = () => {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);

  const onViewStateChange = useCallback((params: ViewStateChangeParameters) => {
    setViewState(params.viewState);
  }, []);

  return { viewState, onViewStateChange };
};
