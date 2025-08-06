import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Stack,
  Chip,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useApi } from './hooks/useApi';
import { theme } from './theme/theme';

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
  const { data: places = [], isLoading, error } = useApi().places.getAll();

  const handleTestApi = () => {
    console.log('Places:', places);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h1" component="h1" color="primary" gutterBottom>
          Place & Trade
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          color="text.secondary"
          gutterBottom
        >
          Verinin Ötesini Görün
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Karmaşık coğrafi verileri, stratejik kararlar almanızı sağlayan
          anlaşılır, eyleme geçirilebilir ve görsel içgörülere dönüştürüyoruz.
        </Typography>
      </Box>

      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h3" gutterBottom>
              Backend Status
            </Typography>
            
            {isLoading && (
              <Chip label="Veriler yükleniyor..." color="info" />
            )}
            
            {error && (
              <Chip label={`Hata: ${error.message}`} color="error" />
            )}
            
            {!isLoading && !error && (
              <Stack spacing={2}>
                <Chip 
                  label={`✅ Supabase Bağlantısı Başarılı`} 
                  color="success" 
                />
                <Chip 
                  label={`📍 ${places.length} adet place bulundu`} 
                  color="success" 
                />
                <Button 
                  variant="contained" 
                  onClick={handleTestApi}
                  sx={{ mt: 2 }}
                >
                  Console'da Places'ları Görüntüle
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h3" gutterBottom>
              Sonraki Adım
            </Typography>
            <Typography variant="body1">
              🗺️ Frontend harita görselleştirmesi implementasyonu
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Container>
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
