import React, { useState } from 'react';
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { theme } from './theme/theme';
import Map from './components/Map';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
        </Toolbar>
      </AppBar>

      {/* Content with top margin for AppBar */}
      <Box sx={{ display: 'flex', height: '100vh', pt: '64px' }}>
        <Slide direction="right" in={sidebarOpen} mountOnEnter unmountOnExit>
          <Box>
            <LeftSidebar />
          </Box>
        </Slide>
        <Map />
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
