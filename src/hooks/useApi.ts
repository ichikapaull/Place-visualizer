import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';

// Query keys for caching
export const QUERY_KEYS = {
  PLACES: 'places',
  PLACE: 'place',
  MY_PLACE: 'myPlace',
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

// Customer Zipcodes hooks
export const useCustomerZipcodes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_ZIPCODES],
    queryFn: () => api.customerZipcodes.getCustomerZipcodes(),
    staleTime: 30 * 60 * 1000, // 30 minutes - Customer data changes less frequently
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useTopCustomerZipcodes = (limit: number = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TOP_CUSTOMER_ZIPCODES, limit],
    queryFn: () => api.customerZipcodes.getTopCustomerZipcodes(limit),
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
