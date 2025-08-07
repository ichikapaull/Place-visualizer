import React from 'react';
import { Paper, Box, Typography, Divider, Stack, Button } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import HomeZipcodesLegend from './HomeZipcodesLegend';
import { useAppStore } from '../../store/appStore';

const RightSidebar: React.FC = () => {
  const { analysisType } = useAppStore();
  const isTradeArea = analysisType === 'Trade Area';
  return (
    <Paper 
      elevation={4}
      sx={{
        p: 2,
        backgroundColor: '#f5f5f5',
        width: 360,
        height: 'calc(100vh - 104px)',
        position: 'absolute',
        top: '84px',
        right: '20px',
        borderRadius: '10px',
        overflowY: 'auto',
        zIndex: 10
      }}
    >
      <Stack spacing={3}>
        {/* 1. Ana Başlık */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ 
            width: 20, 
            height: 20, 
            backgroundColor: 'orange',
            borderRadius: '50%',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 8,
              height: 8,
              backgroundColor: 'red',
              borderRadius: '50%'
            }
          }} />
          <Typography variant="h6" fontWeight="bold">
            Lejant & Analiz
          </Typography>
        </Box>

        <Divider />

        {/* 2. Aktif Analiz Bölümü */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <BarChartIcon sx={{ color: '#1976d2', fontSize: '20px' }} />
            <Typography fontWeight="600" sx={{ color: '#1976d2' }}>
              Aktif Analiz
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              textTransform: 'none',
              fontWeight: '600',
              fontSize: '14px',
              py: 1.5,
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#bbdefb'
              }
            }}
          >
            {isTradeArea ? 'Trade Area Analysis' : 'Home Zipcodes Analysis'}
          </Button>
        </Box>

        {/* 3. Dinamik Lejant Bölümü */}
        {isTradeArea ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <DescriptionIcon sx={{ color: '#1976d2', fontSize: '20px' }} />
              <Typography fontWeight="600" sx={{ color: '#1976d2' }}>
                Trade Area Lejantı
              </Typography>
            </Box>
            
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: 'gold', borderRadius: 1 }} />
                <Typography fontWeight="500">%30 Trade Area</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: 'orange', borderRadius: 1 }} />
                <Typography fontWeight="500">%50 Trade Area</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                <Box sx={{ width: 20, height: 20, backgroundColor: 'red', borderRadius: 1 }} />
                <Typography fontWeight="500">%70 Trade Area</Typography>
              </Box>
            </Stack>
          </Box>
        ) : (
          <HomeZipcodesLegend />
        )}

        <Divider />

        {/* 4. Bilgi Kısmı */}
        <Box sx={{ textAlign: 'center' }}>
          <InfoIcon sx={{ color: '#666', fontSize: '24px', mb: 1 }} />
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              fontSize: '14px',
              lineHeight: 1.4
            }}
          >
            Haritada bir Trade Area polygon'una tıklayın
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default RightSidebar; 