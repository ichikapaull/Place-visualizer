import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

// Query keys for caching
export const QUERY_KEYS = {
  PLACES: 'places',
  PLACE: 'place',
  MY_PLACE: 'myPlace',
  COMPETITORS: 'competitors',
  INDUSTRIES: 'industries',
  TRADE_AREAS: 'tradeAreas',
  TRADE_AREA: 'tradeArea',
  CUSTOMER_ZIPCODES: 'customerZipcodes',
  TOP_CUSTOMER_ZIPCODES: 'topCustomerZipcodes',
} as const;

// Places hooks
export const usePlaces = (filters?: {
  category?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  minRating?: number;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLACES, filters],
    queryFn: () => api.places.getPlaces(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePlace = (id: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLACE, id],
    queryFn: () => (id ? api.places.getPlace(id) : null),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useMyPlace = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.MY_PLACE],
    queryFn: () => api.places.getMyPlace(),
    staleTime: 30 * 60 * 1000, // 30 minutes - My place doesn't change often
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useCompetitors = (filters?: {
  category?: string;
  industry?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  minRating?: number;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMPETITORS, filters],
    queryFn: () => api.places.getCompetitors(filters),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useIndustries = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.INDUSTRIES],
    queryFn: () => api.places.getIndustries(),
    staleTime: 60 * 60 * 1000, // 1 hour - Industries don't change often
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};

// Trade Areas hooks
export const useTradeAreas = (placeId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TRADE_AREAS, placeId],
    queryFn: () => (placeId ? api.tradeAreas.getTradeAreas(placeId) : []),
    enabled: !!placeId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useTradeArea = (
  placeId: string | null,
  percentage: 30 | 50 | 70 | null
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TRADE_AREA, placeId, percentage],
    queryFn: () =>
      placeId && percentage
        ? api.tradeAreas.getTradeArea(placeId, percentage)
        : null,
    enabled: !!placeId && !!percentage,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Customer Zipcodes hooks (Global zipcode data)
export const useCustomerZipcodes = (placeId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_ZIPCODES], // Remove placeId since it's global
    queryFn: () => api.homeZipcodes.getHomeZipcodes(placeId || ''), // Pass any ID since it's global
    staleTime: 30 * 60 * 1000, // 30 minutes - Customer data changes less frequently
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useTopCustomerZipcodes = (placeId: string | null, limit: number = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TOP_CUSTOMER_ZIPCODES, limit], // Remove placeId since it's global
    queryFn: async () => {
      const zipcodes = await api.homeZipcodes.getHomeZipcodes(placeId || ''); // Global data
      return zipcodes.slice(0, limit); // Take top N by customer_count (already ordered)
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Utility hook for invalidating queries
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  return {
    invalidatePlaces: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLACES] }),
    invalidatePlace: (id: string) =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLACE, id] }),
    invalidateMyPlace: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_PLACE] }),
    invalidateTradeAreas: (placeId: string) =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRADE_AREAS, placeId],
      }),
    invalidateCustomerZipcodes: () =>
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CUSTOMER_ZIPCODES],
      }),
    invalidateAll: () => queryClient.invalidateQueries(),
  };
};

// Main API hook that provides access to all hooks
export const useApi = () => ({
  places: {
    getAll: usePlaces,
    getById: usePlace,
    getMyPlace: useMyPlace,
  },
  tradeAreas: {
    getByPlaceId: useTradeAreas,
    getById: useTradeArea,
  },
  zipcodes: {
    getAll: useCustomerZipcodes,
    getTop: useTopCustomerZipcodes,
  },
});
