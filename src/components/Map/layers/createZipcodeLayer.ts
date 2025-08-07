import { GeoJsonLayer } from '@deck.gl/layers';

export interface ZipcodeFeatureProps {
  id: string;
  zipcode: string;
  customer_count: number;
  quintile: number; // 1-5
}

export interface ZipcodeFeature {
  type: 'Feature';
  properties: ZipcodeFeatureProps;
  geometry: GeoJSON.Geometry;
}

export const createZipcodeLayer = (placeId: string, features: ZipcodeFeature[]) => {
  const quintileColors: [number, number, number, number][] = [
    [247, 252, 253, 100],
    [229, 245, 249, 120],
    [153, 216, 201, 140],
    [44, 162, 95, 160],
    [0, 68, 27, 180],
  ];

  return new GeoJsonLayer({
    id: `home-zipcodes-${placeId}`,
    data: {
      type: 'FeatureCollection',
      features,
    },
    getFillColor: (feature: { properties: ZipcodeFeatureProps }) => {
      const quintile = feature.properties.quintile || 1;
      const colorIndex = Math.min(Math.max(quintile - 1, 0), 4);
      return quintileColors[colorIndex];
    },
    getLineColor: [255, 255, 255, 150],
    getLineWidth: 1,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 2,
    pickable: true,
    stroked: true,
    filled: true,
    opacity: 0.7,
    updateTriggers: {
      getFillColor: [features.length],
    },
  });
};

