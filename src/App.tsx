import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import { useAppStore } from './store/appStore';

function App() {
  const { filters, ui, setLoading, toggleLeftSidebar } = useAppStore();

  const handleTestLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
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
              Mevcut Sistem Durumu
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Chip
                label="✅ React 18 + TypeScript"
                color="primary"
                variant="outlined"
              />
              <Chip
                label="✅ Material-UI Teması"
                color="primary"
                variant="outlined"
              />
              <Chip
                label="✅ Zustand Store"
                color="primary"
                variant="outlined"
              />
              <Chip label="✅ React Query" color="primary" variant="outlined" />
              <Chip label="✅ Inter Font" color="primary" variant="outlined" />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h3" gutterBottom>
              Store Test
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Sol sidebar açık: {ui.leftSidebarOpen ? 'Evet' : 'Hayır'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Yükleniyor: {ui.loading ? 'Evet' : 'Hayır'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Minimum rating: {filters.minRating}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={toggleLeftSidebar}
              >
                Sidebar Aç/Kapat
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleTestLoading}
                disabled={ui.loading}
              >
                {ui.loading ? 'Yükleniyor...' : 'Loading Testi'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h3" gutterBottom>
              Proje Yapısı
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              component="pre"
              sx={{ fontSize: '0.75rem' }}
            >
              {`src/
├── api/          # API client & React Query setup
├── components/   # Reusable UI components
├── constants/    # App constants
├── contexts/     # React contexts
├── hooks/        # Custom hooks
├── pages/        # Page components
├── store/        # Zustand store
├── theme/        # MUI theme
├── types/        # TypeScript types
└── utils/        # Utility functions`}
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

export default App;
