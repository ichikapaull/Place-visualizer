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

export const createZipcodeLayer = (placeId: string, features: ZipcodeFeature[], enableInteraction: boolean = true) => {
  // Blue palette to avoid "whitewash" effect
  const quintileColors: [number, number, number, number][] = [
    [198, 219, 239, 140],  // light blue
    [158, 202, 225, 170],
    [107, 174, 214, 190],
    [49, 130, 189, 210],
    [8, 81, 156, 230],
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
    // Improve readability and interaction
    getLineColor: [8, 81, 156, 200],
    getLineWidth: 1,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 2,
    pickable: enableInteraction,
    autoHighlight: enableInteraction,
    highlightColor: enableInteraction ? [255, 255, 0, 200] : [0, 0, 0, 0],
    stroked: true,
    filled: true,
    updateTriggers: {
      getFillColor: [features.length],
    },
  });
};

