import { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { theme } from './theme/theme';
import Map from './components/Map';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import RightSidebar from './components/RightSidebar/RightSidebar';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [legendOpen, setLegendOpen] = useState(true);
  const [analysisType, setAnalysisType] = useState('Trade Area Analysis');
  const [activeTradeAreas, setActiveTradeAreas] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<{
    radius: number;
    industry: string[];
    showLayer: boolean;
    tradeAreas: { [key: string]: boolean };
  }>({
    radius: 0,
    industry: [],
    showLayer: true,
    tradeAreas: { '30': true, '50': true, '70': true },
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleLegend = () => {
    setLegendOpen(!legendOpen);
  };

  const handleFiltersChange = (newFilters: {
    radius: number;
    industry: string[];
    showLayer: boolean;
    tradeAreas: { [key: string]: boolean };
  }) => {
    setFilters({
      radius: newFilters.radius,
      industry: newFilters.industry,
      showLayer: newFilters.showLayer,
      tradeAreas: newFilters.tradeAreas,
    });
  };

  const handleAnalysisTypeChange = (newAnalysisType: string) => {
    setAnalysisType(newAnalysisType);
  };

  const toggleTradeArea = (placeId: string) => {
    console.log('🔄 toggleTradeArea called with placeId:', placeId);
    setActiveTradeAreas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(placeId)) {
        console.log('🗑️ Removing placeId from activeTradeAreas:', placeId);
        newSet.delete(placeId);
      } else {
        console.log('➕ Adding placeId to activeTradeAreas:', placeId);
        newSet.add(placeId);
      }
      console.log('📊 New activeTradeAreas:', Array.from(newSet));
      return newSet;
    });
  };

  // Determine popup button text based on analysis type
  const isTradeAreaSelected = analysisType === 'Trade Area Analysis';

  return (
    <Box sx={{ display: 'flex', height: '100vh', position: 'relative' }}>
      {/* Top Blue Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: '#1976d2',
          zIndex: 1200
        }}
      >
        <Toolbar sx={{ minHeight: '64px' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon sx={{ fontWeight: 'bold', fontSize: '24px' }} />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <MapIcon sx={{ mr: 1, fontWeight: 'bold', fontSize: '24px' }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '20px'
              }}
            >
              Place & Trade Area Analyzer
            </Typography>
          </Box>

          <IconButton
            edge="end"
            color="inherit"
            aria-label="settings"
            onClick={toggleLegend}
            sx={{ ml: 2 }}
          >
            <SettingsIcon sx={{ fontWeight: 'bold', fontSize: '24px' }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Content with top margin for AppBar */}
      <Box sx={{ display: 'flex', height: '100vh', pt: '64px' }}>
        <Slide direction="right" in={sidebarOpen} mountOnEnter unmountOnExit>
          <Box>
            <LeftSidebar 
              onFiltersChange={handleFiltersChange} 
              onAnalysisTypeChange={handleAnalysisTypeChange}
            />
          </Box>
        </Slide>
        <Map 
          filters={filters} 
          isTradeAreaSelected={isTradeAreaSelected}
          activeTradeAreas={activeTradeAreas}
          onToggleTradeArea={toggleTradeArea}
        />
        <Slide direction="left" in={legendOpen} mountOnEnter unmountOnExit>
          <Box>
            <RightSidebar />
          </Box>
        </Slide>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
