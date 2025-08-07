import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export const useHomeZipcodeData = (placeId: string | null) => {
  return useQuery({
    queryKey: ['home-zipcodes', placeId],
    queryFn: async () => {
      if (!placeId) return [];
      
      console.log('🏠 Hook: Fetching home zipcodes for placeId:', placeId);
      
      try {
        const zipcodes = await api.homeZipcodes.getHomeZipcodes(placeId);
        console.log('✅ Hook: Got home zipcodes for', placeId, ':', zipcodes);
        return zipcodes;
      } catch (error) {
        console.error(`Failed to fetch home zipcodes for place ${placeId}:`, error);
        throw error;
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

export const useHomeZipcodeAvailability = (placeId: string | null) => {
  return useQuery({
    queryKey: ['home-zipcodes-availability', placeId],
    queryFn: async () => {
      if (!placeId) return false;
      
      console.log('🔍 Hook: Checking home zipcodes availability for placeId:', placeId);
      
      try {
        const hasData = await api.homeZipcodes.checkHomeZipcodesAvailability(placeId);
        console.log('✅ Hook: Home zipcodes availability for', placeId, ':', hasData);
        return hasData;
      } catch (error) {
        console.error(`Failed to check home zipcodes availability for place ${placeId}:`, error);
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