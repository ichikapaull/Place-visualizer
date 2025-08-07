import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export const useTradeAreaData = (placeIds: string[]) => {
  return useQuery({
    queryKey: ['trade-areas', placeIds],
    queryFn: async () => {
      console.log('🔍 Hook: Fetching trade areas for placeIds:', placeIds);
      
      // Fetch all trade areas in parallel instead of sequentially
      const promises = placeIds.map(async (placeId) => {
        try {
          console.log('🔍 Hook: Fetching for placeId:', placeId);
          const tradeAreas = await api.tradeAreas.getTradeAreas(placeId);
          console.log('✅ Hook: Got trade areas for', placeId, ':', tradeAreas);
          return {
            placeId,
            tradeAreas
          };
        } catch (error) {
          console.error(`Failed to fetch trade areas for place ${placeId}:`, error);
          return {
            placeId,
            tradeAreas: []
          };
        }
      });
      
      const allTradeAreas = await Promise.all(promises);
      console.log('📊 Hook: Final result:', allTradeAreas);
      return allTradeAreas;
    },
    enabled: placeIds.length > 0,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    // Add performance optimizations
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1, // Only retry once
    retryDelay: 1000, // Wait 1 second before retry
  });
}; 