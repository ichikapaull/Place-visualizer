import { PolygonLayer } from '@deck.gl/layers';

interface TradeAreaGeometry {
  type: 'Polygon';
  coordinates: number[][][];
}

interface TradeAreaItem {
  percentage: 30 | 50 | 70;
  geometry: TradeAreaGeometry | null;
}

export const createTradeAreaLayer = (placeId: string, tradeArea: TradeAreaItem) => {
  if (!tradeArea.geometry || tradeArea.geometry.type !== 'Polygon') return null;

  const polygonCoordinates = tradeArea.geometry.coordinates;

  let fillColor: [number, number, number, number];
  let strokeColor: [number, number, number, number];

  switch (tradeArea.percentage) {
    case 30:
      // Lowest opacity for 30% (widest area)
      fillColor = [255, 215, 0, 80];
      strokeColor = [255, 215, 0, 255];
      break;
    case 50:
      // Medium opacity for 50%
      fillColor = [255, 165, 0, 120];
      strokeColor = [255, 165, 0, 255];
      break;
    case 70:
      // Highest opacity for 70% (smallest area)
      fillColor = [255, 0, 0, 180];
      strokeColor = [255, 0, 0, 255];
      break;
    default:
      fillColor = [128, 128, 128, 120];
      strokeColor = [128, 128, 128, 255];
  }

  return new PolygonLayer({
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
  });
};

