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
  // Blue palette to avoid "whitewash" effect
  const quintileColors: [number, number, number, number][] = [
    [198, 219, 239, 70],  // light blue
    [158, 202, 225, 85],
    [107, 174, 214, 100],
    [49, 130, 189, 120],
    [8, 81, 156, 140],
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
    getLineColor: [255, 255, 255, 120],
    getLineWidth: 0.7,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 2,
    pickable: true,
    stroked: true,
    filled: true,
    opacity: 0.25,
    updateTriggers: {
      getFillColor: [features.length],
    },
  });
};

