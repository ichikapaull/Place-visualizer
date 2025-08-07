import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import type { Place } from '../types';

export const useHomeZipcodeData = (place: Place | null) => {
  return useQuery({
    queryKey: ['home-zipcodes', place?.id],
    queryFn: async () => {
      if (!place) return [];
      const placeId = place.id;
      const longitude = Number(place.longitude);
      const latitude = Number(place.latitude);
      
      console.log('🏠 Hook: Fetching home zipcodes for placeId:', placeId, 'at', latitude, longitude);
      
      try {
        const zipcodes = await api.homeZipcodes.getHomeZipcodes(placeId, longitude, latitude);
        console.log('✅ Hook: Got home zipcodes for', placeId, ':', zipcodes);
        return zipcodes;
      } catch (error) {
        console.error(`Failed to fetch home zipcodes for place ${placeId}:`, error);
        throw error;
      }
    },
    enabled: !!place?.id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useHomeZipcodeAvailability = (place: Place | null) => {
  return useQuery({
    queryKey: ['home-zipcodes-availability', place?.id],
    queryFn: async () => {
      if (!place?.id) return false;
      const placeId = place.id;
      
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
    enabled: !!place?.id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 1000,
  });
};