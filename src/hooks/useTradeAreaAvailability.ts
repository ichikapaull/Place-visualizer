import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export const useTradeAreaAvailability = (placeId: string | null) => {
  return useQuery({
    queryKey: ['trade-area-availability', placeId],
    queryFn: async () => {
      if (!placeId) return false;
      
      console.log('🔍 Checking trade area availability for placeId:', placeId);
      
      try {
        const tradeAreas = await api.tradeAreas.getTradeAreas(placeId);
        const hasData = tradeAreas && tradeAreas.length > 0;
        console.log('✅ Trade area availability for', placeId, ':', hasData);
        return hasData;
      } catch (error) {
        console.error(`Failed to check trade area availability for place ${placeId}:`, error);
        return false;
      }
    },
    enabled: !!placeId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  });
};