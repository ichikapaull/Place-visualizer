import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types for the store state
export interface FilterState {
  category: string | null;
  radius: number;
  minRating: number;
}

export interface MapState {
  center: [number, number];
  zoom: number;
  selectedPlaceId: string | null;
  showTradeArea: boolean;
  showCustomerDensity: boolean;
}

export interface UIState {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  loading: boolean;
  error: string | null;
}

// Combined store state
interface AppState {
  filters: FilterState;
  map: MapState;
  ui: UIState;
}

// Store actions
interface AppActions {
  // Filter actions
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Map actions
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  setSelectedPlace: (placeId: string | null) => void;
  toggleTradeArea: () => void;
  toggleCustomerDensity: () => void;

  // UI actions
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Initial state
const initialState: AppState = {
  filters: {
    category: null,
    radius: 1000, // meters
    minRating: 0,
  },
  map: {
    center: [29.0174, 41.0053], // Istanbul coordinates
    zoom: 10,
    selectedPlaceId: null,
    showTradeArea: false,
    showCustomerDensity: false,
  },
  ui: {
    leftSidebarOpen: true,
    rightSidebarOpen: true,
    loading: false,
    error: null,
  },
};

// Create the store
export const useAppStore = create<AppState & AppActions>()(
  devtools(
    (set) => ({
      ...initialState,

      // Filter actions
      setFilter: (filter) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...filter },
          }),
          false,
          'setFilter'
        ),

      resetFilters: () =>
        set({ filters: initialState.filters }, false, 'resetFilters'),

      // Map actions
      setMapCenter: (center) =>
        set(
          (state) => ({
            map: { ...state.map, center },
          }),
          false,
          'setMapCenter'
        ),

      setMapZoom: (zoom) =>
        set(
          (state) => ({
            map: { ...state.map, zoom },
          }),
          false,
          'setMapZoom'
        ),

      setSelectedPlace: (placeId) =>
        set(
          (state) => ({
            map: { ...state.map, selectedPlaceId: placeId },
          }),
          false,
          'setSelectedPlace'
        ),

      toggleTradeArea: () =>
        set(
          (state) => ({
            map: { ...state.map, showTradeArea: !state.map.showTradeArea },
          }),
          false,
          'toggleTradeArea'
        ),

      toggleCustomerDensity: () =>
        set(
          (state) => ({
            map: {
              ...state.map,
              showCustomerDensity: !state.map.showCustomerDensity,
            },
          }),
          false,
          'toggleCustomerDensity'
        ),

      // UI actions
      toggleLeftSidebar: () =>
        set(
          (state) => ({
            ui: { ...state.ui, leftSidebarOpen: !state.ui.leftSidebarOpen },
          }),
          false,
          'toggleLeftSidebar'
        ),

      toggleRightSidebar: () =>
        set(
          (state) => ({
            ui: { ...state.ui, rightSidebarOpen: !state.ui.rightSidebarOpen },
          }),
          false,
          'toggleRightSidebar'
        ),

      setLoading: (loading) =>
        set(
          (state) => ({
            ui: { ...state.ui, loading },
          }),
          false,
          'setLoading'
        ),

      setError: (error) =>
        set(
          (state) => ({
            ui: { ...state.ui, error },
          }),
          false,
          'setError'
        ),
    }),
    {
      name: 'place-trade-store',
    }
  )
);

// Selectors for easy access to specific state parts
export const useFilters = () => useAppStore((state) => state.filters);
export const useMapState = () => useAppStore((state) => state.map);
export const useUIState = () => useAppStore((state) => state.ui);
