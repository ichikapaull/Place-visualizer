import { create } from 'zustand';
import type { Place } from '../types';

type AnalysisType = 'Trade Area' | 'Home Zipcodes';

interface AppState {
  radiusFilter: number;
  setRadiusFilter: (radius: number) => void;
  industryFilter: string[];
  setIndustryFilter: (industries: string[]) => void;
  showPlacesLayer: boolean;
  setShowPlacesLayer: (show: boolean) => void;
  analysisType: AnalysisType;
  setAnalysisType: (type: AnalysisType) => void;
  tradeAreaVisibility: {
    '30': boolean;
    '50': boolean;
    '70': boolean;
  };
  setTradeAreaVisibility: (layer: '30' | '50' | '70', visible: boolean) => void;
  setAllTradeAreaVisibility: (visible: boolean) => void;
  showAnalysisLayer: boolean;
  setShowAnalysisLayer: (show: boolean) => void;
  selectedPlace: Place | null;
  setSelectedPlace: (place: Place | null) => void;
  // Home Zipcodes state (PRD: only one place can show zipcodes at a time)
  zipcodePlaceId: string | null;
  setZipcodePlaceId: (placeId: string | null) => void;
  showHomeZipcodes: boolean;
  setShowHomeZipcodes: (show: boolean) => void;
  clearAllFilters: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  radiusFilter: 0,
  setRadiusFilter: (radius) => set({ radiusFilter: radius }),
  industryFilter: [],
  setIndustryFilter: (industries) => set({ industryFilter: industries }),
  showPlacesLayer: true,
  setShowPlacesLayer: (show) => set({ showPlacesLayer: show }),
  analysisType: 'Trade Area',
  setAnalysisType: (type) => set({ analysisType: type }),
  tradeAreaVisibility: {
    '30': true,
    '50': true,
    '70': true,
  },
  setTradeAreaVisibility: (layer, visible) =>
    set((state) => ({
      tradeAreaVisibility: {
        ...state.tradeAreaVisibility,
        [layer]: visible,
      },
    })),
  setAllTradeAreaVisibility: (visible) => set({
    tradeAreaVisibility: {
      '30': visible,
      '50': visible,
      '70': visible,
    }
  }),
  showAnalysisLayer: true,
  setShowAnalysisLayer: (show) => set({ showAnalysisLayer: show }),
  selectedPlace: null,
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  // Home Zipcodes state (PRD: mutual exclusivity with trade areas)
  zipcodePlaceId: null,
  setZipcodePlaceId: (placeId) => set((state) => ({
    zipcodePlaceId: placeId,
    // PRD: When showing zipcodes, ensure trade areas are hidden for clarity
    showAnalysisLayer: placeId ? false : state.showAnalysisLayer,
  })),
  showHomeZipcodes: false,
  setShowHomeZipcodes: (show) => set((state) => ({
    showHomeZipcodes: show,
    // PRD: Mutual exclusivity - hide trade areas when showing zipcodes
    showAnalysisLayer: show ? false : state.showAnalysisLayer,
  })),
  clearAllFilters: () => set({
    radiusFilter: 0,
    industryFilter: [],
    tradeAreaVisibility: {
      '30': true,
      '50': true,
      '70': true,
    },
    zipcodePlaceId: null,
    showHomeZipcodes: false,
  }),
}));
